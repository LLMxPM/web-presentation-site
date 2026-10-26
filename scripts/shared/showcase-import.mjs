/**
 * 文件功能：案例导入、构建产物导入与主图更新的一次性落地逻辑。
 *
 * 采用「暂存 → 校验 → 整体替换」两阶段流程：暂存目录位于 `site/.manage-staging`，
 * 只有 commit 阶段才会覆盖正式目录，导入失败不会破坏已有案例。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathExists, siteRoot, toPosix } from './site-utils.mjs';
import { readZipEntries, extractZipEntries } from './zip-reader.mjs';
import {
  buildTemplateFields,
  isSupportedCoverExtension,
  resolveCoverSource,
  saveCover,
  supportedCoverExtensions,
} from './showcase-meta.mjs';
import {
  currentSchemaVersion,
  defaultCategory,
  encodePathSegment,
  normalizeNumber,
  normalizeSlug,
  normalizeText,
  previewEntryFileName,
  previewRoot,
  publicShowcaseRoot,
  readShowcaseRecord,
  showcaseRoot,
  templatePackageFileName,
  writeShowcaseRecord,
} from './showcase-store.mjs';

const stagingRoot = path.join(siteRoot, '.manage-staging');
const trashRoot = path.join(siteRoot, '.manage-trash');
const requiredTemplateFiles = [
  'manifest.json',
  'metadata/template.json',
  'metadata/screenshots.json',
  'project/project.json',
  'project/routes.json',
];
const expectedPackageType = 'web-presentation-project-template';
const supportedSchemaVersions = ['1', '2'];

/**
 * 暂存模板 ZIP：解压到临时目录并解析展示数据，等待用户确认。
 *
 * 返回暂存票据、解析结果、文件清单和告警；不解压任何内容到正式目录。
 */
export async function stageTemplateImport({ zipBuffer, fileName }) {
  const entries = readZipEntries(zipBuffer);
  const strippedEntries = stripSingleRootDirectory(entries);
  const names = new Set(strippedEntries.filter((entry) => !entry.isDirectory).map((entry) => entry.name));

  const missing = requiredTemplateFiles.filter((file) => !names.has(file));
  if (missing.length > 0) {
    throw new Error(`模板包缺少必需文件：${missing.join('、')}`);
  }

  const token = buildToken();
  const stagingDirectory = path.join(stagingRoot, token);
  const extractedDirectory = path.join(stagingDirectory, 'extracted');
  await fs.mkdir(extractedDirectory, { recursive: true });

  try {
    const written = await extractZipEntries(strippedEntries, extractedDirectory);
    const snapshot = await readTemplateSnapshot(extractedDirectory);
    const coverSource = resolveCoverSource(snapshot.screenshots);

    if (!coverSource) {
      throw new Error('模板包中没有可用截图，无法生成站点主图。');
    }

    const parsed = buildTemplateFields(snapshot);
    await fs.writeFile(path.join(stagingDirectory, 'upload.zip'), zipBuffer);
    await fs.writeFile(path.join(stagingDirectory, 'meta.json'), JSON.stringify({
      kind: 'template',
      fileName,
      coverSource,
      parsed,
      fileCount: written.length,
      totalBytes: written.reduce((total, item) => total + item.size, 0),
    }, null, 2), 'utf8');

    return {
      token,
      parsed,
      coverSource,
      files: summarizeFiles(written),
      fileCount: written.length,
      totalBytes: written.reduce((total, item) => total + item.size, 0),
    };
  } catch (error) {
    await fs.rm(stagingDirectory, { recursive: true, force: true });
    throw error;
  }
}

/**
 * 提交模板导入：先落分发资源，再整体替换模板源码目录，最后写 showcase.json。
 *
 * 顺序是刻意安排的：主图与下载包先写 public 目录，这一步失败时源码目录与
 * showcase.json 都保持原样；`showcase.json` 必须写在目录替换之后，因为旧记录
 * 就放在被替换的目录里。
 */
export async function commitTemplateImport({ token, slug, fields }) {
  const stagingDirectory = path.join(stagingRoot, token);
  const extractedDirectory = path.join(stagingDirectory, 'extracted');

  if (!(await pathExists(extractedDirectory))) {
    throw new Error('暂存内容已失效，请重新上传模板包。');
  }

  const meta = JSON.parse(await fs.readFile(path.join(stagingDirectory, 'meta.json'), 'utf8'));
  const normalizedSlug = normalizeSlug(slug || meta.parsed.suggestedSlug);
  const targetDirectory = path.join(showcaseRoot, normalizedSlug);
  const publicDirectory = path.join(publicShowcaseRoot, normalizedSlug);
  const previous = await readShowcaseRecord(normalizedSlug);

  // 主图来源来自包内的 screenshots.json，解析后必须仍落在暂存目录内。
  const coverSourceRoot = path.resolve(extractedDirectory);
  const coverSourcePath = path.resolve(coverSourceRoot, ...String(meta.coverSource).split('/'));
  if (coverSourcePath !== coverSourceRoot && !coverSourcePath.startsWith(`${coverSourceRoot}${path.sep}`)) {
    throw new Error(`主图来源路径不合法：${meta.coverSource}`);
  }
  if (!(await pathExists(coverSourcePath))) {
    throw new Error(`暂存内容中缺少主图来源 ${meta.coverSource}，请重新上传模板包。`);
  }

  await fs.mkdir(publicDirectory, { recursive: true });
  const coverResult = await writeCoverFromSource({ sourcePath: coverSourcePath, publicDirectory });
  await fs.copyFile(path.join(stagingDirectory, 'upload.zip'), path.join(publicDirectory, templatePackageFileName));

  const now = new Date().toISOString();
  const record = {
    schemaVersion: currentSchemaVersion,
    slug: normalizedSlug,
    title: normalizeText(fields?.title) || previous?.title || meta.parsed.title,
    summary: normalizeText(fields?.summary) || previous?.summary || meta.parsed.summary,
    category: normalizeText(fields?.category) || previous?.category || defaultCategory,
    tags: Array.isArray(fields?.tags) ? fields.tags : (previous?.tags || []),
    featured: typeof fields?.featured === 'boolean' ? fields.featured : (previous?.featured === true),
    sortOrder: normalizeNumber(fields?.sortOrder) ?? previous?.sortOrder ?? null,
    hidden: typeof fields?.hidden === 'boolean' ? fields.hidden : (previous?.hidden === true),
    cover: { file: coverResult.file, width: coverResult.width, height: coverResult.height },
    template: {
      file: templatePackageFileName,
      size: readFileSize(await fs.stat(path.join(publicDirectory, templatePackageFileName))),
      sourceProjectCode: meta.parsed.sourceProjectCode,
      importedAt: now,
    },
    preview: previous?.preview || { available: false, entry: previewEntryFileName, importedAt: '' },
    meta: meta.parsed.meta,
    styleSpecMarkdown: meta.parsed.styleSpecMarkdown,
    model: previous?.model || '',
    cost: previous?.cost || '',
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };

  await replaceDirectory(extractedDirectory, targetDirectory);

  try {
    await writeShowcaseRecord(normalizedSlug, record);
  } catch (error) {
    // 目录已被替换但记录未写入时，用旧记录回填，避免案例从站点直接消失。
    if (previous) {
      await writeShowcaseRecord(normalizedSlug, previous).catch(() => undefined);
    }
    throw error;
  }

  await fs.rm(stagingDirectory, { recursive: true, force: true });

  return { slug: normalizedSlug, record };
}

/**
 * 暂存构建产物 ZIP：解包并检查入口与资源引用。
 *
 * 只做校验与清单输出；产物内容留在暂存目录，等待 commit 才替换预览目录。
 */
export async function stageBuildImport({ zipBuffer }) {
  const entries = readZipEntries(zipBuffer);
  const strippedEntries = stripSingleRootDirectory(entries);
  const files = strippedEntries.filter((entry) => !entry.isDirectory);
  const entryFile = files.find((entry) => entry.name === previewEntryFileName);

  if (!entryFile) {
    throw new Error(`构建产物根目录缺少 ${previewEntryFileName}，请确认导出的是构建产物而不是模板包。`);
  }

  const warnings = checkBuildReferences(strippedEntries);
  const blocking = warnings.filter((item) => item.level === 'error');
  if (blocking.length > 0) {
    throw new Error(blocking.map((item) => item.message).join('；'));
  }

  const token = buildToken();
  const stagingDirectory = path.join(stagingRoot, token);
  const extractedDirectory = path.join(stagingDirectory, 'extracted');
  await fs.mkdir(extractedDirectory, { recursive: true });

  try {
    const written = await extractZipEntries(strippedEntries, extractedDirectory);
    await fs.writeFile(path.join(stagingDirectory, 'meta.json'), JSON.stringify({
      kind: 'build',
      fileCount: written.length,
    }, null, 2), 'utf8');

    return {
      token,
      entry: previewEntryFileName,
      files: summarizeFiles(written),
      fileCount: written.length,
      totalBytes: written.reduce((total, item) => total + item.size, 0),
      warnings: warnings.map((item) => item.message),
    };
  } catch (error) {
    await fs.rm(stagingDirectory, { recursive: true, force: true });
    throw error;
  }
}

/** 提交构建产物：整体替换预览目录，清空旧哈希资源后写回 showcase.json。 */
export async function commitBuildImport({ token, slug }) {
  const stagingDirectory = path.join(stagingRoot, token);
  const extractedDirectory = path.join(stagingDirectory, 'extracted');

  if (!(await pathExists(extractedDirectory))) {
    throw new Error('暂存内容已失效，请重新上传构建产物。');
  }

  const record = await readShowcaseRecord(slug);
  if (!record) {
    throw new Error(`案例 ${slug} 不存在，请先导入模板包。`);
  }

  const targetDirectory = path.join(previewRoot, slug);
  await replaceDirectory(extractedDirectory, targetDirectory);
  await fs.rm(stagingDirectory, { recursive: true, force: true });

  const now = new Date().toISOString();
  const nextRecord = {
    ...record,
    preview: { available: true, entry: previewEntryFileName, importedAt: now },
    updatedAt: now,
  };
  await writeShowcaseRecord(slug, nextRecord);

  return { slug, previewPath: `/previews/${encodePathSegment(slug)}/${previewEntryFileName}` };
}

/** 更新主图：写入新文件并清掉其它扩展名的旧主图，保证只有一张。 */
export async function updateCover({ slug, buffer, fileName }) {
  const record = await readShowcaseRecord(slug);
  if (!record) {
    throw new Error(`案例 ${slug} 不存在。`);
  }

  if (!isSupportedCoverExtension(path.extname(fileName || '').toLowerCase())) {
    throw new Error(`主图仅支持 ${supportedCoverExtensions.join('、')} 格式。`);
  }

  const saved = await saveCover({
    directory: path.join(publicShowcaseRoot, slug),
    buffer,
    sourcePath: fileName,
  });
  const now = new Date().toISOString();
  await writeShowcaseRecord(slug, {
    ...record,
    cover: { file: saved.file, width: saved.width, height: saved.height },
    updatedAt: now,
  });

  return saved;
}

/** 删除案例：目录整体移入回收站，避免误删后无法恢复。 */
export async function deleteShowcase(slug) {
  const targets = [
    path.join(showcaseRoot, slug),
    path.join(publicShowcaseRoot, slug),
    path.join(previewRoot, slug),
  ];
  const trashDirectory = path.join(trashRoot, `${Date.now()}-${normalizeSlug(slug)}`);

  let moved = 0;
  const failures = [];

  for (const target of targets) {
    if (!(await pathExists(target))) {
      continue;
    }
    await fs.mkdir(trashDirectory, { recursive: true });
    try {
      await moveToTrash(target, path.join(trashDirectory, path.basename(target)));
      moved += 1;
    } catch (error) {
      failures.push(`${toPosix(path.relative(siteRoot, target))}：${error.message}`);
    }
  }

  if (moved === 0 && failures.length === 0) {
    throw new Error(`案例 ${slug} 不存在。`);
  }
  if (failures.length > 0) {
    throw new Error(`部分目录无法移动（可能被其它程序占用，请关闭后重试）：${failures.join('；')}`);
  }
  return { trashDirectory: toPosix(path.relative(siteRoot, trashDirectory)) };
}

/**
 * 把目录移入回收站。
 *
 * Windows 下目录仍被占用时 rename 会报 EPERM，此时改用「复制 + 删除」兜底，
 * 保证单个文件句柄不会让整个删除操作失败。
 */
async function moveToTrash(sourcePath, targetPath) {
  try {
    await fs.rename(sourcePath, targetPath);
    return;
  } catch (error) {
    if (error.code !== 'EPERM' && error.code !== 'EBUSY' && error.code !== 'EXDEV') {
      throw error;
    }
  }

  await fs.cp(sourcePath, targetPath, { recursive: true, force: true });
  await fs.rm(sourcePath, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

/** 读取模板目录的解析结果；缺失字段时给出可定位错误。 */
export async function readTemplateSnapshot(directory) {
  const manifest = await readJsonObject(directory, 'manifest.json');
  const project = await readJsonObject(directory, 'project/project.json');
  const screenshots = await readJsonObject(directory, 'metadata/screenshots.json');
  await readJsonObject(directory, 'metadata/template.json');
  await readJsonObject(directory, 'project/routes.json');

  if (normalizeText(manifest.package_type) !== expectedPackageType) {
    throw new Error(`manifest.json 的 package_type 应为 ${expectedPackageType}，实际为 ${manifest.package_type ?? '空'}。`);
  }
  if (!supportedSchemaVersions.includes(String(manifest.schema_version))) {
    throw new Error(`manifest.json 的 schema_version 应为 ${supportedSchemaVersions.join(' 或 ')}。`);
  }
  if (!Number.isInteger(Number(manifest.page_count))) {
    throw new Error('manifest.json 缺少合法的 page_count。');
  }

  return { manifest, project, screenshots };
}

/** 构建产物引用检查：识别绝对路径与后端预览地址，避免上线后 404。 */
function checkBuildReferences(entries) {
  const warnings = [];
  const entryFile = entries.find((entry) => entry.name === previewEntryFileName);
  const entryHtml = entryFile?.content.toString('utf8') ?? '';

  if (/(?:src|href)\s*=\s*["']\/(?!\/)/i.test(entryHtml)) {
    warnings.push({
      level: 'error',
      message: 'index.html 中存在以 / 开头的绝对资源路径，构建时需使用 base_url: "./"，请重新构建后再导入。',
    });
  }
  if (/\/preview\/artifacts\/|\/build-artifacts\/|\/api\/workspaces\//.test(entryHtml)) {
    warnings.push({
      level: 'error',
      message: 'index.html 引用了后端预览地址，产物不是离线可托管的静态包，请用本地资源快照模式重新构建。',
    });
  }

  const absoluteBackendInJs = entries.some((entry) => (
    entry.name.endsWith('.js') && /\/preview\/artifacts\/|\/api\/workspaces\//.test(entry.content.toString('utf8').slice(0, 400000))
  ));
  if (absoluteBackendInJs) {
    warnings.push({
      level: 'error',
      message: '构建产物 JS 中仍包含后端资源地址，图片和字体会在静态托管下失效，请重新构建。',
    });
  }

  const hasAssetsDirectory = entries.some((entry) => entry.name.startsWith('assets/'));
  if (!hasAssetsDirectory) {
    warnings.push({ level: 'warning', message: '产物中没有 assets/ 目录，请确认构建包完整。' });
  }

  return warnings;
}

/** 解压后如果所有条目都被同一个顶层目录包裹，去掉该层，兼容「压缩整个文件夹」。 */
function stripSingleRootDirectory(entries) {
  const fileEntries = entries.filter((entry) => !entry.isDirectory && entry.name.includes('/'));
  if (fileEntries.length === 0) {
    return entries;
  }

  const firstSegment = fileEntries[0].name.split('/')[0];
  const allWrapped = entries.every((entry) => entry.name === firstSegment || entry.name.startsWith(`${firstSegment}/`));
  if (!allWrapped) {
    return entries;
  }

  return entries
    .map((entry) => ({
      ...entry,
      name: entry.name === firstSegment ? '' : entry.name.slice(firstSegment.length + 1),
    }))
    .filter((entry) => entry.name);
}

/** 读取目录内 JSON 对象，错误信息带相对路径。 */
async function readJsonObject(directory, relativePath) {
  const filePath = path.join(directory, ...relativePath.split('/'));
  let raw;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    throw new Error(`缺少必需文件 ${relativePath}。`);
  }

  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${relativePath} 必须是 JSON 对象。`);
  }
  return value;
}

/** 用目录整体替换目标目录；先备旧目录，失败时回滚。 */
async function replaceDirectory(sourceDirectory, targetDirectory) {
  const backupDirectory = `${targetDirectory}.replaced-${buildToken()}`;
  const hadTarget = await pathExists(targetDirectory);

  if (hadTarget) {
    await fs.rename(targetDirectory, backupDirectory);
  }

  try {
    await fs.mkdir(path.dirname(targetDirectory), { recursive: true });
    await fs.rename(sourceDirectory, targetDirectory);
  } catch (error) {
    if (hadTarget) {
      await fs.rename(backupDirectory, targetDirectory).catch(() => undefined);
    }
    throw error;
  }

  if (hadTarget) {
    await fs.rm(backupDirectory, { recursive: true, force: true });
  }
}

/** 从模板截图写出站点主图，返回文件名与像素尺寸。 */
async function writeCoverFromSource({ sourcePath, publicDirectory }) {
  if (!(await pathExists(sourcePath))) {
    throw new Error(`模板截图 ${toPosix(path.relative(siteRoot, sourcePath))} 不存在。`);
  }

  const buffer = await fs.readFile(sourcePath);
  return saveCover({ directory: publicDirectory, buffer, sourcePath });
}

/** 生成短随机 token，用于暂存目录和备份目录命名。 */
function buildToken() {
  return `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
}

/** 汇总文件清单，返回按体积倒序的前若干项，避免管理页渲染过慢。 */
function summarizeFiles(files) {
  return [...files]
    .sort((left, right) => right.size - left.size)
    .slice(0, 12)
    .map((item) => ({ name: item.name, size: item.size }));
}

/** 从 stat 结果读取字节数。 */
function readFileSize(stat) {
  return Number(stat.size) || 0;
}
