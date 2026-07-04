/**
 * 文件功能：扫描 Web-Presentation 项目模板包目录，读取 ZIP 项目数据并生成成果展示数据。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { generatedRoot, pathExists, siteRoot, toPosix } from './site-utils.mjs';
import {
  extractZipEntry,
  getZipEntry,
  readZipArchive,
  readZipObjectJson,
} from './template-zip-reader.mjs';

const showcaseRoot = path.join(siteRoot, 'showcases');
const generatedShowcaseRoot = path.join(generatedRoot, 'public', 'showcases');
const generatedShowcaseAssetRoot = path.join(generatedRoot, 'showcases');
const templatePackageExtension = '.wptemplate.zip';
const templateManifestPath = 'manifest.json';
const templateMetadataPath = 'metadata/template.json';
const templateScreenshotsPath = 'metadata/screenshots.json';
const templateProjectPath = 'project/project.json';
const templateRoutesPath = 'project/routes.json';
const expectedPackageType = 'web-presentation-project-template';
const expectedSchemaVersion = '1';

/** 扫描成果目录，读取扁平放置的 .wptemplate.zip 并输出排序后的成果数据。 */
export async function scanShowcases() {
  if (!(await pathExists(showcaseRoot))) {
    return [];
  }

  const entries = await fs.readdir(showcaseRoot, { withFileTypes: true });
  const packages = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(templatePackageExtension))
    .sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'));
  const seenSlugs = new Map();
  const showcases = [];

  for (const entry of packages) {
    const slug = buildSlugFromPackageFileName(entry.name);
    const packagePath = path.join(showcaseRoot, entry.name);

    if (seenSlugs.has(slug)) {
      throw new Error(`成果 slug ${slug} 重复：${seenSlugs.get(slug)} 与 ${relativeSitePath(packagePath)}。`);
    }
    seenSlugs.set(slug, relativeSitePath(packagePath));

    showcases.push(await readShowcasePackage({
      slug,
      packageFileName: entry.name,
      packagePath,
    }));
  }

  return sortShowcases(showcases);
}

/** 读取单个模板包；展示主数据来自 project/project.json，manifest 和 template 只承担校验。 */
async function readShowcasePackage({ slug, packageFileName, packagePath }) {
  const zip = await readZipArchive(packagePath);
  const manifest = readZipObjectJson(zip, templateManifestPath, packagePath);
  validateManifest(manifest, packagePath);
  readZipObjectJson(zip, templateMetadataPath, packagePath);
  const projectPayload = readZipObjectJson(zip, templateProjectPath, packagePath);
  const routesPayload = readZipObjectJson(zip, templateRoutesPath, packagePath);
  const screenshots = readZipObjectJson(zip, templateScreenshotsPath, packagePath);
  const supplement = await readShowcaseSupplement(buildSupplementPath(packageFileName));
  const publicDir = path.join(generatedShowcaseRoot, slug);
  const assetDir = path.join(generatedShowcaseAssetRoot, slug);
  const screenshotItems = sortScreenshotItemsByRoutes({
    items: normalizeScreenshotItems(screenshots),
    routesPayload,
    packagePath,
  });

  await fs.mkdir(publicDir, { recursive: true });
  await fs.mkdir(assetDir, { recursive: true });
  await fs.copyFile(packagePath, path.join(publicDir, packageFileName));

  const coverFileName = await writeShowcaseCover({
    zip,
    screenshots,
    fallbackItem: screenshotItems[0],
    publicDir,
    assetDir,
    packagePath,
  });
  const slides = await writeShowcaseScreenshots({
    zip,
    imageItems: screenshotItems,
    publicDir,
    assetDir,
    packagePath,
  });

  return normalizeShowcase({
    slug,
    packageFileName,
    coverFileName,
    slides,
    manifest,
    projectPayload,
    supplement,
  });
}

/** 校验模板包 manifest 的包类型、版本、必要路径字段和计数字段。 */
function validateManifest(manifest, packagePath) {
  const stringFields = [
    ['package_type', expectedPackageType],
    ['schema_version', expectedSchemaVersion],
    ['template_path', templateMetadataPath],
    ['screenshots_path', templateScreenshotsPath],
    ['project_path', templateProjectPath],
    ['routes_path', templateRoutesPath],
  ];

  for (const [field, expectedValue] of stringFields) {
    const actualValue = normalizeScalarText(manifest[field]);
    if (!actualValue) {
      throw new Error(`${relativeSitePath(packagePath)} 的 manifest.json 缺少 ${field}。`);
    }
    if (actualValue !== expectedValue) {
      throw new Error(`${relativeSitePath(packagePath)} 的 manifest.json 字段 ${field} 应为 ${expectedValue}，实际为 ${actualValue}。`);
    }
  }

  for (const field of ['page_count', 'component_count', 'asset_count', 'theme_count', 'font_count']) {
    const countValue = normalizeInteger(manifest[field]);
    if (!Number.isInteger(countValue) || countValue < 0) {
      throw new Error(`${relativeSitePath(packagePath)} 的 manifest.json 字段 ${field} 必须是非负整数。`);
    }
  }

  validateManifestArrayCount(manifest, 'pages', 'page_count', packagePath);
  validateManifestArrayCount(manifest, 'components', 'component_count', packagePath);
  validateManifestArrayCount(manifest, 'assets', 'asset_count', packagePath);
  validateManifestArrayCount(manifest, 'themes', 'theme_count', packagePath);
  validateManifestArrayCount(manifest, 'fonts', 'font_count', packagePath);
}

/** 校验 manifest 中数组字段与对应计数字段一致；缺失数组时不强制失败。 */
function validateManifestArrayCount(manifest, arrayField, countField, packagePath) {
  if (manifest[arrayField] === undefined) {
    return;
  }

  if (!Array.isArray(manifest[arrayField])) {
    throw new Error(`${relativeSitePath(packagePath)} 的 manifest.json 字段 ${arrayField} 必须是数组。`);
  }

  const expectedCount = normalizeInteger(manifest[countField]);
  if (Number.isInteger(expectedCount) && manifest[arrayField].length !== expectedCount) {
    throw new Error(`${relativeSitePath(packagePath)} 的 manifest.json 字段 ${arrayField} 数量与 ${countField} 不一致。`);
  }
}

/** 合并项目数据和站点补充字段，形成页面渲染使用的稳定对象。 */
function normalizeShowcase({ slug, packageFileName, coverFileName, slides, manifest, projectPayload, supplement }) {
  const pageCount = normalizeInteger(manifest.page_count) || slides.length;
  const pageWidth = normalizeNumber(projectPayload.page_width);
  const pageHeight = normalizeNumber(projectPayload.page_height);
  const aspectRatio = formatAspectRatio(pageWidth, pageHeight);
  const themeNames = normalizeThemeNames(manifest);
  const themeKey = normalizeText(projectPayload.theme_key);
  const menuMode = normalizeText(projectPayload.menu_mode);
  const summary = normalizeText(supplement.summary)
    || normalizeText(projectPayload.description)
    || buildFallbackSummary();

  return {
    slug,
    templateSlug: slug,
    title: normalizeText(supplement.title) || normalizeText(projectPayload.name) || slug,
    summary,
    category: normalizeText(supplement.category) || 'project-template',
    tags: themeNames.slice(0, 6),
    pageCount,
    pageWidth,
    pageHeight,
    aspectRatio,
    baseFontSize: normalizeText(projectPayload.base_font_size),
    styleSpecMarkdown: normalizeText(projectPayload.style_spec_markdown),
    themeKey,
    themeNames,
    menuMode,
    runtimeKitManifestVersion: normalizeText(manifest.runtime_kit_manifest_version),
    model: normalizeText(supplement.model),
    cost: normalizeText(supplement.cost),
    previewUrl: normalizeText(supplement.previewUrl),
    featured: supplement.featured === true,
    sortOrder: normalizeNumber(supplement.sortOrder),
    createdAt: normalizeText(manifest.exported_at),
    updatedAt: normalizeText(manifest.exported_at),
    coverFileName,
    detailPath: `./showcases/${encodePathSegment(slug)}.html`,
    packageFileName,
    slides,
  };
}

/** 输出成果封面；优先使用 screenshots.cover，缺失时使用路由排序后的第一张截图。 */
async function writeShowcaseCover({ zip, screenshots, fallbackItem, publicDir, assetDir, packagePath }) {
  const coverPath = normalizeText(screenshots?.cover?.path) || normalizeText(fallbackItem?.path);
  if (!coverPath) {
    throw new Error(`${relativeSitePath(packagePath)} 缺少可用封面截图。`);
  }

  const coverEntry = getZipEntry(zip, coverPath);
  if (!coverEntry) {
    throw new Error(`${relativeSitePath(packagePath)} 缺少封面截图 ${coverPath}。`);
  }

  const coverFileName = `cover${normalizeImageExtension(coverPath)}`;
  const coverContent = extractZipEntry(zip, coverEntry, packagePath);
  await fs.writeFile(path.join(publicDir, coverFileName), coverContent);
  await fs.writeFile(path.join(assetDir, coverFileName), coverContent);
  return coverFileName;
}

/** 输出模板包内页面截图，文件名按最终路由顺序生成 slide-01、slide-02 等。 */
async function writeShowcaseScreenshots({ zip, imageItems, publicDir, assetDir, packagePath }) {
  const slides = [];

  for (const [index, item] of imageItems.entries()) {
    const entry = getZipEntry(zip, item.path);
    if (!entry) {
      throw new Error(`${relativeSitePath(packagePath)} 缺少截图 ${item.path}。`);
    }

    const order = index + 1;
    const fileName = `slide-${String(order).padStart(2, '0')}${normalizeImageExtension(item.path)}`;
    const content = extractZipEntry(zip, entry, packagePath);

    await fs.writeFile(path.join(publicDir, fileName), content);
    await fs.writeFile(path.join(assetDir, fileName), content);
    slides.push({
      fileName,
      title: item.title || `第 ${order} 页`,
      order,
      width: item.width,
      height: item.height,
      sourcePageCode: item.sourcePageCode,
    });
  }

  return slides;
}

/** 规范化截图列表；截图文件路径、标题和尺寸都来自 metadata/screenshots.json。 */
function normalizeScreenshotItems(screenshots) {
  const pages = Array.isArray(screenshots?.pages) ? screenshots.pages : [];
  const items = pages.length > 0 ? pages : [screenshots?.cover].filter(Boolean);

  return items
    .map((item, index) => ({
      path: normalizeText(item?.path),
      title: normalizeText(item?.title) || `第 ${index + 1} 页`,
      order: normalizeNumber(item?.order) ?? index + 1,
      width: normalizeNumber(item?.width),
      height: normalizeNumber(item?.height),
      sourcePageCode: normalizeText(item?.source_page_code),
    }))
    .filter((item) => item.path);
}

/** 按 project/routes.json 的页面路由顺序组织截图，路由缺截图时直接失败。 */
function sortScreenshotItemsByRoutes({ items, routesPayload, packagePath }) {
  const routeItems = collectRoutePageEntries(routesPayload, packagePath);
  if (routeItems.length === 0) {
    return [...items].sort(sortByScreenshotOrder);
  }

  const itemsBySource = new Map();
  for (const item of items) {
    if (item.sourcePageCode && !itemsBySource.has(item.sourcePageCode)) {
      itemsBySource.set(item.sourcePageCode, item);
    }
  }

  const sortedItems = [];
  const usedItems = new Set();
  for (const routeItem of routeItems) {
    const item = itemsBySource.get(routeItem.sourcePageCode);
    if (!item) {
      throw new Error(`${relativeSitePath(packagePath)} 的路由页面 ${routeItem.sourcePageCode} 缺少截图。`);
    }
    if (usedItems.has(item)) {
      continue;
    }
    sortedItems.push(item);
    usedItems.add(item);
  }

  const leftovers = items
    .filter((item) => !usedItems.has(item))
    .sort(sortByScreenshotOrder);

  return [...sortedItems, ...leftovers];
}

/** 递归展开 routes 树，只保留带 source_page_code 的页面路由。 */
function collectRoutePageEntries(routesPayload, packagePath) {
  if (!Array.isArray(routesPayload.routes)) {
    throw new Error(`${relativeSitePath(packagePath)} 的 project/routes.json 缺少 routes 数组。`);
  }

  const routeItems = [];
  let sequence = 0;

  function visit(nodes) {
    const orderedNodes = nodes
      .map((node, index) => ({ node, index }))
      .sort((left, right) => {
        const leftOrder = normalizeNumber(left.node?.order) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = normalizeNumber(right.node?.order) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder || left.index - right.index;
      });

    for (const { node } of orderedNodes) {
      const currentSequence = sequence;
      sequence += 1;
      const sourcePageCode = normalizeText(node?.source_page_code);

      if (node?.route_type === 'page' && sourcePageCode) {
        routeItems.push({
          sourcePageCode,
          order: normalizeNumber(node.order) ?? Number.MAX_SAFE_INTEGER,
          sequence: currentSequence,
        });
      }

      if (Array.isArray(node?.children) && node.children.length > 0) {
        visit(node.children);
      }
    }
  }

  visit(routesPayload.routes);
  return routeItems.sort((left, right) => left.order - right.order || left.sequence - right.sequence);
}

/** 读取可选补充配置；文件不存在时返回空对象，JSON 非对象时报错。 */
async function readShowcaseSupplement(filePath) {
  if (!(await pathExists(filePath))) {
    return {};
  }

  const raw = await fs.readFile(filePath, 'utf8');
  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${relativeSitePath(filePath)} 必须是 JSON 对象。`);
  }
  return value;
}

/** 生成同名站点补充配置路径，例如 foo.wptemplate.zip 对应 foo.showcase.json。 */
function buildSupplementPath(packageFileName) {
  return path.join(showcaseRoot, `${stripTemplateExtension(packageFileName)}.showcase.json`);
}

/** 对成果列表排序：显式顺序优先，其次按更新时间或创建时间倒序。 */
function sortShowcases(showcases) {
  return [...showcases].sort((left, right) => {
    const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftTime = Date.parse(left.updatedAt || left.createdAt || '') || 0;
    const rightTime = Date.parse(right.updatedAt || right.createdAt || '') || 0;
    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return left.title.localeCompare(right.title, 'zh-CN');
  });
}

/** 按 screenshots 原始 order 排序，作为路由之外截图的兜底顺序。 */
function sortByScreenshotOrder(left, right) {
  const leftOrder = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
  const rightOrder = Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER;
  return leftOrder - rightOrder || left.title.localeCompare(right.title, 'zh-CN') || left.path.localeCompare(right.path);
}

/** 从模板包文件名生成安全 URL slug。 */
function buildSlugFromPackageFileName(packageFileName) {
  const baseName = stripTemplateExtension(packageFileName);
  const slug = baseName
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');

  if (!slug) {
    throw new Error(`${packageFileName} 无法生成有效成果 slug。`);
  }
  return slug;
}

/** 去掉 .wptemplate.zip 后缀，保留原始大小写作为下载文件名来源。 */
function stripTemplateExtension(packageFileName) {
  if (!packageFileName.toLowerCase().endsWith(templatePackageExtension)) {
    return packageFileName;
  }
  return packageFileName.slice(0, -templatePackageExtension.length);
}

/** 从 manifest.themes 提取主题名称。 */
function normalizeThemeNames(manifest) {
  return Array.isArray(manifest.themes)
    ? uniqueTexts(manifest.themes.map((theme) => normalizeText(theme?.name)))
    : [];
}

/** 根据页面尺寸计算标准比例文本。 */
function formatAspectRatio(width, height) {
  if (!width || !height) {
    return '';
  }

  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/** 计算两个正整数的最大公约数。 */
function greatestCommonDivisor(left, right) {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

/** 规范化文本字段。 */
function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** 将字符串或数字统一转换为非空文本。 */
function normalizeScalarText(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Number.isFinite(value)) {
    return String(value);
  }
  return '';
}

/** 规范化数值字段。 */
function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

/** 规范化整数计数字段。 */
function normalizeInteger(value) {
  const numberValue = normalizeNumber(value);
  return Number.isInteger(numberValue) ? numberValue : null;
}

/** 去重并保持原始顺序。 */
function uniqueTexts(values) {
  return [...new Set(values.filter(Boolean))];
}

/** 缺少摘要时不生成说明文案，避免详情页出现重复的模板解释。 */
function buildFallbackSummary() {
  return '';
}

/** 保留常见图片扩展名；未知扩展按 PNG 输出。 */
function normalizeImageExtension(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp'].includes(extension) ? extension : '.png';
}

/** 编码单个 URL path segment，避免中文或空格破坏下载链接。 */
function encodePathSegment(value) {
  return encodeURIComponent(value).replace(/%2F/gi, '/');
}

/** 将绝对路径压缩为站点相对路径，便于错误信息定位。 */
function relativeSitePath(filePath) {
  return toPosix(path.relative(siteRoot, filePath));
}
