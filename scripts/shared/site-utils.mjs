/**
 * 文件功能：提供站点脚本共享的路径解析、Markdown 链接处理和文档路由工具。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);

export const projectRoot = path.resolve(path.dirname(currentFile), '..', '..');
export const siteRoot = path.join(projectRoot, 'site');
export const generatedRoot = path.join(siteRoot, '.generated');
export const sourceRepo = process.env.SOURCE_REPO || 'LLMxPM/web-presentation';
export const sourceRef = process.env.SOURCE_REF || 'main';

/** 将系统路径统一为 URL 和 VitePress 配置使用的 POSIX 路径。 */
export function toPosix(value) {
  return value.replace(/\\/g, '/');
}

/** 判断文件或目录是否存在，输出布尔值而不是抛出异常。 */
export async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

/** 解析源项目目录；本地默认读取同级 web-presentation，CI 可显式传入路径。 */
export function resolveSourceRoot() {
  if (process.env.SOURCE_REPO_PATH) {
    return path.resolve(projectRoot, process.env.SOURCE_REPO_PATH);
  }

  return path.resolve(projectRoot, '..', 'web-presentation');
}

/** 递归列出目录中的全部文件；输入目录不存在时返回空数组。 */
export async function listFiles(rootDir) {
  if (!(await pathExists(rootDir))) {
    return [];
  }

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      return listFiles(entryPath);
    }
    return [entryPath];
  }));

  return files.flat();
}

/** 从 Markdown 内容中提取一级标题；没有标题时使用回退值。 */
export function getMarkdownTitle(content, fallbackTitle) {
  const match = content.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].replace(/`/g, '').trim() : fallbackTitle;
}

/** 将文件名转为可读标题；主要用于缺少一级标题的文档。 */
export function titleFromFile(filePath) {
  const name = path.basename(filePath, path.extname(filePath));
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/** 判断链接是否为站外协议链接，避免误处理 http、mailto、data 等 URL。 */
export function isExternalHref(href) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
}

/** 拆分链接路径和 hash/query 后缀；输出用于路径解析和原样保留锚点。 */
export function splitHref(href) {
  const hashIndex = href.indexOf('#');
  const queryIndex = href.indexOf('?');
  const indexes = [hashIndex, queryIndex].filter((index) => index >= 0);
  const cutIndex = indexes.length > 0 ? Math.min(...indexes) : -1;

  if (cutIndex < 0) {
    return { pathname: href, suffix: '' };
  }

  return {
    pathname: href.slice(0, cutIndex),
    suffix: href.slice(cutIndex),
  };
}

/** 安全解码 Markdown 链接路径；非法转义保持原值，避免中断同步。 */
export function safeDecodePathname(pathname) {
  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
}

/** 将源仓 Markdown 相对路径映射为站点路由。 */
export function routeForSourceMarkdown(sourceRelativePath) {
  const sourcePath = toPosix(sourceRelativePath);

  if (sourcePath === 'README.md') {
    return '/project-readme.html';
  }

  if (sourcePath.endsWith('/README.md')) {
    return `/${sourcePath.slice(0, -'README.md'.length)}`;
  }

  return `/${sourcePath.replace(/\.md$/i, '.html')}`;
}

/** 将源仓 Markdown 相对路径映射为生成目录内的文件路径。 */
export function generatedRelativeForSource(sourceRelativePath) {
  const sourcePath = toPosix(sourceRelativePath);
  return sourcePath === 'README.md' ? 'project-readme.md' : sourcePath;
}

/** 生成指向源仓文件的 GitHub URL，用于无法纳入站点路由的内部链接。 */
export function githubBlobUrl(sourceRelativePath, suffix = '') {
  const encodedPath = toPosix(sourceRelativePath)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://github.com/${sourceRepo}/blob/${sourceRef}/${encodedPath}${suffix}`;
}

/** 采集 Markdown 行内链接和图片链接，输出 href 及所在行号。 */
export function collectMarkdownLinks(content) {
  const links = [];
  const pattern = /!?\[[^\]\n]*\]\(([^)\s]+)\)/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const line = content.slice(0, match.index).split(/\r?\n/).length;
    links.push({ href: match[1], line });
  }

  return links;
}

/** 重写 Markdown 中可被站点承载的内部 .md 链接，输出适合 VitePress 的路由。 */
export function rewriteMarkdownLinks(content, sourceFilePath, sourceRoot) {
  return content.replace(/(!?\[[^\]\n]*\]\()([^\s)]+)(\))/g, (full, prefix, href, suffix) => {
    if (href.startsWith('#') || isExternalHref(href)) {
      return full;
    }

    const { pathname, suffix: hrefSuffix } = splitHref(href);
    if (!pathname.toLowerCase().endsWith('.md')) {
      return full;
    }

    const decodedPathname = safeDecodePathname(pathname);
    const targetPath = path.resolve(path.dirname(sourceFilePath), decodedPathname);
    const sourceRelative = toPosix(path.relative(sourceRoot, targetPath));

    if (sourceRelative === 'README.md' || sourceRelative.startsWith('docs/')) {
      return `${prefix}${routeForSourceMarkdown(sourceRelative)}${hrefSuffix}${suffix}`;
    }

    return `${prefix}${githubBlobUrl(sourceRelative, hrefSuffix)}${suffix}`;
  });
}

/** 按文档中心中的链接顺序排序；没有显式出现的文档按路径排序。 */
export function sortDocsByReadmeOrder(docs, docsReadmeContent, sourceRoot) {
  const order = new Map();
  const readmePath = path.join(sourceRoot, 'docs', 'README.md');

  collectMarkdownLinks(docsReadmeContent).forEach(({ href }, index) => {
    const { pathname } = splitHref(href);
    if (!pathname.toLowerCase().endsWith('.md')) {
      return;
    }

    const absolutePath = path.resolve(path.dirname(readmePath), safeDecodePathname(pathname));
    const sourceRelative = toPosix(path.relative(sourceRoot, absolutePath));
    order.set(sourceRelative, index);
  });

  return [...docs].sort((left, right) => {
    const leftOrder = order.has(left.sourceRelative) ? order.get(left.sourceRelative) : Number.MAX_SAFE_INTEGER;
    const rightOrder = order.has(right.sourceRelative) ? order.get(right.sourceRelative) : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.sourceRelative.localeCompare(right.sourceRelative, 'zh-CN');
  });
}
