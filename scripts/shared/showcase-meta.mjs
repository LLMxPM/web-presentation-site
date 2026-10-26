/**
 * 文件功能：模板包元数据与主图的共用解析逻辑。
 *
 * 导入流程（本地管理页）与历史案例迁移脚本都需要把 manifest/project 映射为
 * `showcase.json` 的展示字段，两者共用本模块，避免口径漂移；主图来源、
 * 主图命名和图片尺寸读取也集中在此。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  defaultCoverFileName,
  formatAspectRatio,
  normalizeNumber,
  normalizeSlug,
  normalizeText,
  uniqueTexts,
} from './showcase-store.mjs';

/** 主图允许的扩展名；jpeg 在落地时统一归并为 jpg。 */
export const supportedCoverExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

/** 判断扩展名是否可作为主图格式，供上传校验复用。 */
export function isSupportedCoverExtension(extension) {
  return supportedCoverExtensions.includes(String(extension ?? '').toLowerCase());
}

/** 从截图清单挑选主图来源，优先 cover，其次第一张页面截图。 */
export function resolveCoverSource(screenshots) {
  const coverPath = normalizeText(screenshots?.cover?.path);
  if (coverPath) {
    return coverPath;
  }
  const pages = Array.isArray(screenshots?.pages) ? screenshots.pages : [];
  return normalizeText(pages[0]?.path);
}

/** 把截图来源路径归一为 `cover.<ext>`；未知格式回退 `cover.png`。 */
export function normalizeCoverFileName(sourcePath) {
  const extension = path.extname(String(sourcePath ?? '')).toLowerCase();
  if (extension === '.jpeg') {
    return 'cover.jpg';
  }
  return supportedCoverExtensions.includes(extension) ? `cover${extension}` : defaultCoverFileName;
}

/**
 * 把主图写入案例的 public 目录，并清掉其它扩展名的旧主图。
 *
 * 先写新文件再删旧文件：写入失败时旧主图仍然可用，不会出现「一张主图都没有」。
 * 返回文件名与像素尺寸，供 showcase.json 的 `cover` 字段使用。
 */
export async function saveCover({ directory, buffer, sourcePath }) {
  const fileName = normalizeCoverFileName(sourcePath);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, fileName), buffer);

  const entries = await fs.readdir(directory, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => entry.isFile() && /^cover\.(png|jpe?g|webp)$/i.test(entry.name) && entry.name !== fileName)
    .map((entry) => fs.rm(path.join(directory, entry.name), { force: true })));

  const size = readImageSize(buffer);
  return { file: fileName, width: size?.width ?? null, height: size?.height ?? null };
}

/**
 * 将模板包的 manifest/project 映射为 showcase.json 的字段。
 *
 * 返回展示字段与 `meta`；`suggestedSlug` 供导入流程预填目录名。
 * 两条链路共用同一份实现，保证同一模板包在两处得到完全一致的 meta。
 */
export function buildTemplateFields({ manifest, project }) {
  const pageWidth = normalizeNumber(project?.page_width);
  const pageHeight = normalizeNumber(project?.page_height);
  const themeKey = normalizeText(project?.theme_key);
  const themeNames = Array.isArray(manifest?.themes)
    ? uniqueTexts(manifest.themes.map((item) => normalizeText(item?.name)))
    : [];
  const assetTypes = Array.isArray(manifest?.assets)
    ? uniqueTexts(manifest.assets.map((item) => normalizeText(item?.asset_type)))
    : [];

  return {
    title: normalizeText(project?.name) || normalizeText(manifest?.project_code),
    summary: normalizeText(project?.description),
    sourceProjectCode: normalizeText(project?.source_project_code),
    suggestedSlug: normalizeSlug(normalizeText(project?.name) || 'showcase'),
    styleSpecMarkdown: normalizeText(project?.style_spec_markdown),
    meta: {
      pageCount: normalizeNumber(manifest?.page_count) ?? 0,
      pageWidth,
      pageHeight,
      aspectRatio: formatAspectRatio(pageWidth, pageHeight),
      baseFontSize: normalizeText(project?.base_font_size),
      themeKey,
      themeNames,
      assetTypes,
      hasComponents: Array.isArray(manifest?.components) && manifest.components.length > 0,
      backgroundTone: detectBackgroundTone(project?.theme_config_yaml, themeKey),
      menuMode: normalizeText(project?.menu_mode),
    },
  };
}

/**
 * 从主题 YAML 中提取默认背景色并判断明暗，供卡片和详情页展示。
 *
 * 优先在 `themeKey` 对应的主题块内查找 background.default，找不到时退回全局首个匹配，
 * 避免多主题模板一律取到第一个主题的底色。
 */
export function detectBackgroundTone(themeConfigYaml, themeKey) {
  const text = typeof themeConfigYaml === 'string' ? themeConfigYaml.replace(/\r\n/g, '\n') : '';
  if (!text) {
    return '';
  }

  const blockPattern = new RegExp(`${escapeRegExp(themeKey)}\\s*:\\s*[\\s\\S]{0,2000}?background\\s*:\\s*[\\s\\S]{0,200}?default\\s*:\\s*['"]?(#[0-9a-fA-F]{3,8})`);
  const fallbackPattern = /background\s*:\s*[\s\S]{0,200}?default\s*:\s*['"]?(#[0-9a-fA-F]{3,8})/;
  const match = (themeKey ? blockPattern.exec(text) : null) || fallbackPattern.exec(text);

  if (!match) {
    return '';
  }
  return isLightColor(match[1]) ? 'light' : 'dark';
}

/** 判断十六进制颜色是否偏亮；无法解析时按亮色处理，保证文字对比度安全。 */
function isLightColor(hex) {
  const value = String(hex).replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value.slice(0, 6);
  if (normalized.length !== 6) {
    return true;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/** 读取 PNG/JPEG/WebP 头部像素尺寸；无法识别时返回 null。 */
export function readImageSize(buffer) {
  if (buffer.length > 24 && buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer.length > 4 && buffer.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }

  if (buffer.length > 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const format = buffer.toString('ascii', 12, 16);
    if (format === 'VP8X') {
      const width = 1 + buffer.readUIntLE(24, 3);
      const height = 1 + buffer.readUIntLE(27, 3);
      return { width, height };
    }
    if (format === 'VP8 ') {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }
  }

  return null;
}

/** 转义正则中的特殊字符，供主题块匹配使用。 */
function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
