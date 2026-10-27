/**
 * 文件功能：定义案例展示数据的目录约定、数据结构与读写逻辑。
 *
 * 站点构建阶段只读取 `site/showcases/<slug>/showcase.json`，不再解析模板源码；
 * 因此本模块是「导入期写入 / 构建期读取」两侧共用的唯一数据契约。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathExists, projectRoot, siteRoot, toPosix } from './site-utils.mjs';

export const showcaseRoot = path.join(siteRoot, 'showcases');
export const publicShowcaseRoot = path.join(siteRoot, 'public', 'showcases');
export const previewRoot = path.join(siteRoot, 'public', 'previews');
export const taxonomyPath = path.join(showcaseRoot, 'taxonomy.json');
export const showcaseFileName = 'showcase.json';
export const templatePackageFileName = 'template.wptemplate.zip';
export const defaultCoverFileName = 'cover.png';
export const previewEntryFileName = 'index.html';
export const currentSchemaVersion = 1;

/** 分类是站点展示口径，默认值用于兜底，不在词表里时也能正常构建。 */
export const defaultCategory = '未分类';

/** 内置分类词表兜底；taxonomy.json 缺少 categories 字段时用它完成迁移。 */
const fallbackCategories = ['语文课堂', '技术分享', '产品介绍', '品牌运营'];

/** 内置标签词表兜底；taxonomy.json 缺失时仍能构建站点。 */
const fallbackTagGroups = [
  { name: '场景', tags: ['教学', '汇报', '宣传', '分享', '发布', '培训'] },
  { name: '风格', tags: ['国风', '极简', '商务', '科技', '活泼', '杂志', '手绘'] },
  { name: '内容', tags: ['语文', '技术', '产品', '品牌', '运营', '数据'] },
];

/**
 * 读取词表：分类是一层平铺列表，标签仍按分组维护。
 *
 * `categories` 字段缺失时回落到内置分类，兼容本次改造之前写下的 taxonomy.json；
 * 字段存在但为空数组时保持为空，尊重人工清空词表的意图。
 */
export async function readTaxonomy() {
  if (!(await pathExists(taxonomyPath))) {
    return {
      categories: [...fallbackCategories],
      tagGroups: structuredClone(fallbackTagGroups),
    };
  }

  const raw = await fs.readFile(taxonomyPath, 'utf8');
  const value = JSON.parse(raw);
  const categories = Array.isArray(value?.categories)
    ? uniqueTexts(value.categories.map(normalizeText))
    : [...fallbackCategories];
  const tagGroups = Array.isArray(value?.tagGroups)
    ? value.tagGroups
      .map((group) => ({
        name: normalizeText(group?.name) || '标签',
        tags: Array.isArray(group?.tags) ? uniqueTexts(group.tags.map(normalizeText)) : [],
      }))
      .filter((group) => group.tags.length > 0)
    : [];

  if (tagGroups.length === 0) {
    tagGroups.push(...structuredClone(fallbackTagGroups));
  }

  return { categories, tagGroups };
}

/** 写回词表，保持稳定字段顺序，便于 Git 对比。 */
export async function writeTaxonomy(taxonomy) {
  const categories = uniqueTexts((Array.isArray(taxonomy?.categories) ? taxonomy.categories : []).map(normalizeText));
  const tagGroups = (Array.isArray(taxonomy?.tagGroups) ? taxonomy.tagGroups : [])
    .map((group) => ({
      name: normalizeText(group?.name) || '标签',
      tags: uniqueTexts((Array.isArray(group?.tags) ? group.tags : []).map(normalizeText)),
    }))
    .filter((group) => group.tags.length > 0);

  const payload = { categories, tagGroups };
  await fs.mkdir(showcaseRoot, { recursive: true });
  await fs.writeFile(taxonomyPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

/** 把任意输入规范化为合法 slug，供导入流程生成目录名。 */
export function normalizeSlug(value) {
  const slug = String(value ?? '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');

  if (!slug) {
    throw new Error(`无法从「${value}」生成有效 slug。`);
  }
  return slug;
}

/** 列出所有包含 showcase.json 的案例目录，输出目录名即 slug。 */
export async function listShowcaseSlugs() {
  if (!(await pathExists(showcaseRoot))) {
    return [];
  }

  const entries = await fs.readdir(showcaseRoot, { withFileTypes: true });
  const slugs = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (await pathExists(path.join(showcaseRoot, entry.name, showcaseFileName))) {
      slugs.push(entry.name);
    }
  }
  return slugs.sort((left, right) => left.localeCompare(right, 'zh-CN'));
}

/** 读取原始 showcase.json；不存在时返回 null。 */
export async function readShowcaseRecord(slug) {
  const filePath = path.join(showcaseRoot, slug, showcaseFileName);
  if (!(await pathExists(filePath))) {
    return null;
  }

  const raw = await fs.readFile(filePath, 'utf8');
  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`site/showcases/${slug}/${showcaseFileName} 必须是 JSON 对象。`);
  }
  return value;
}

/** 写回 showcase.json，统一补齐 schemaVersion 与 slug。 */
export async function writeShowcaseRecord(slug, record) {
  const directory = path.join(showcaseRoot, slug);
  await fs.mkdir(directory, { recursive: true });
  const payload = { schemaVersion: currentSchemaVersion, slug, ...record };
  await fs.writeFile(path.join(directory, showcaseFileName), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

/**
 * 将原始记录规范化为构建期使用的案例对象。
 *
 * 只做字段兜底和派生，不读取模板源码；返回对象同时供数据模块和详情页使用。
 */
export function normalizeShowcaseRecord(slug, record) {
  const meta = record?.meta && typeof record.meta === 'object' ? record.meta : {};
  const cover = record?.cover && typeof record.cover === 'object' ? record.cover : {};
  const template = record?.template && typeof record.template === 'object' ? record.template : {};
  const preview = record?.preview && typeof record.preview === 'object' ? record.preview : {};

  const coverFile = normalizeText(cover.file);
  const templateFile = normalizeText(template.file);
  const previewEntry = normalizeText(preview.entry) || previewEntryFileName;

  return {
    schemaVersion: normalizeNumber(record?.schemaVersion) ?? currentSchemaVersion,
    slug,
    title: normalizeText(record?.title) || slug,
    summary: normalizeText(record?.summary),
    category: normalizeText(record?.category) || defaultCategory,
    tags: Array.isArray(record?.tags) ? uniqueTexts(record.tags.map(normalizeText)) : [],
    featured: record?.featured === true,
    sortOrder: normalizeNumber(record?.sortOrder),
    hidden: record?.hidden === true,
    pageCount: normalizeNumber(meta.pageCount) ?? 0,
    pageWidth: normalizeNumber(meta.pageWidth),
    pageHeight: normalizeNumber(meta.pageHeight),
    aspectRatio: normalizeText(meta.aspectRatio),
    baseFontSize: normalizeText(meta.baseFontSize),
    themeKey: normalizeText(meta.themeKey),
    themeNames: Array.isArray(meta.themeNames) ? uniqueTexts(meta.themeNames.map(normalizeText)) : [],
    assetTypes: Array.isArray(meta.assetTypes) ? uniqueTexts(meta.assetTypes.map(normalizeText)) : [],
    hasComponents: meta.hasComponents === true,
    backgroundTone: normalizeText(meta.backgroundTone),
    menuMode: normalizeText(meta.menuMode),
    styleSpecMarkdown: normalizeText(record?.styleSpecMarkdown),
    model: normalizeText(record?.model),
    cost: normalizeText(record?.cost),
    sourceProjectCode: normalizeText(template.sourceProjectCode),
    createdAt: normalizeText(record?.createdAt),
    updatedAt: normalizeText(record?.updatedAt),
    coverFile,
    coverPath: coverFile ? `/showcases/${encodePathSegment(slug)}/${encodePathSegment(coverFile)}` : '',
    packageFile: templateFile,
    packagePath: templateFile ? `/showcases/${encodePathSegment(slug)}/${encodePathSegment(templateFile)}` : '',
    previewEntry,
    previewAvailable: preview.available === true,
    previewPath: `/previews/${encodePathSegment(slug)}/${encodePathSegment(previewEntry)}`,
    detailPath: `/showcases/${encodePathSegment(slug)}.html`,
  };
}

/**
 * 构建期读取全部案例。
 *
 * 缺失 showcase.json 的目录会被跳过并记录问题；资源缺失只降级不中断，
 * 保证单个案例出错不会阻断整站发布。
 */
export async function loadShowcasesForBuild() {
  const taxonomy = await readTaxonomy();
  const slugs = await listShowcaseSlugs();
  const showcases = [];
  const problems = [];

  for (const slug of slugs) {
    let record;
    try {
      record = await readShowcaseRecord(slug);
    } catch (error) {
      problems.push({ slug, level: 'error', message: error.message });
      continue;
    }

    if (!record) {
      continue;
    }

    if (normalizeText(record.slug) && normalizeText(record.slug) !== slug) {
      problems.push({
        slug,
        level: 'warning',
        message: `showcase.json 中的 slug「${record.slug}」与目录名不一致，已按目录名构建。`,
      });
    }

    const showcase = normalizeShowcaseRecord(slug, record);
    const missing = await findMissingAssets(showcase);
    for (const item of missing) {
      problems.push({ slug, level: 'warning', message: `缺少${item.label}：${item.path}` });
    }

    showcases.push({
      ...showcase,
      coverAvailable: Boolean(showcase.coverFile) && !missing.some((item) => item.kind === 'cover'),
      packageAvailable: Boolean(showcase.packageFile) && !missing.some((item) => item.kind === 'package'),
      previewAvailable: showcase.previewAvailable && !missing.some((item) => item.kind === 'preview'),
    });
  }

  return { showcases: sortShowcases(showcases.filter((item) => !item.hidden)), problems, taxonomy };
}

/** 校验案例引用的静态资源是否真实存在，输出缺失项而不是抛错。 */
async function findMissingAssets(showcase) {
  const missing = [];
  const slugSegment = encodePathSegment(showcase.slug);

  if (showcase.coverFile) {
    const coverPath = path.join(publicShowcaseRoot, showcase.slug, showcase.coverFile);
    if (!(await pathExists(coverPath))) {
      missing.push({ kind: 'cover', label: '主图', path: `site/public/showcases/${slugSegment}/${showcase.coverFile}` });
    }
  }

  if (showcase.packageFile) {
    const packagePath = path.join(publicShowcaseRoot, showcase.slug, showcase.packageFile);
    if (!(await pathExists(packagePath))) {
      missing.push({ kind: 'package', label: '模板包', path: `site/public/showcases/${slugSegment}/${showcase.packageFile}` });
    }
  }

  if (showcase.previewAvailable) {
    const previewPath = path.join(previewRoot, showcase.slug, showcase.previewEntry);
    if (!(await pathExists(previewPath))) {
      missing.push({ kind: 'preview', label: '预览入口', path: `site/public/previews/${slugSegment}/${showcase.previewEntry}` });
    }
  }

  return missing;
}

/** 排序规则：显式 sortOrder 优先，其次精选，再按更新时间倒序。 */
export function sortShowcases(showcases) {
  return [...showcases].sort((left, right) => {
    const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }

    const leftTime = Date.parse(left.updatedAt || left.createdAt || '') || 0;
    const rightTime = Date.parse(right.updatedAt || right.createdAt || '') || 0;
    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }
    return left.title.localeCompare(right.title, 'zh-CN');
  });
}

/** 计算画幅比例文本，用于卡片角标和详情资料。 */
export function formatAspectRatio(width, height) {
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

/** 编码单个 URL path segment，避免中文或空格破坏链接。 */
export function encodePathSegment(value) {
  return encodeURIComponent(value).replace(/%2F/gi, '/');
}

/** 规范化文本字段。 */
export function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** 规范化数值字段；空值与非法值统一返回 null。 */
export function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

/** 去重并保持原始顺序。 */
export function uniqueTexts(values) {
  return [...new Set(values.filter(Boolean))];
}

/** 输出便于错误提示的项目相对路径。 */
export function relativeProjectPath(targetPath) {
  return toPosix(path.relative(projectRoot, targetPath));
}
