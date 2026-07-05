/**
 * 文件功能：从 Web-Presentation 同步 Markdown 文档和资源，并生成 VitePress 导航数据。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  renderHomePage,
  renderShowcaseSummariesData,
  renderShowcaseDetailPage,
  renderShowcasesData,
  renderShowcasesPage,
} from './shared/page-renderers.mjs';
import { scanShowcases } from './shared/showcase-scanner.mjs';
import {
  collectReadmeOrders,
  collectMarkdownLinks,
  generatedRelativeForSource,
  generatedRoot,
  getMarkdownTitle,
  isExternalHref,
  isReadmeMarkdown,
  listFiles,
  pathExists,
  resolveSourceRoot,
  rewriteMarkdownLinks,
  routeForSourceMarkdown,
  safeDecodePathname,
  siteRoot,
  sortDocsByDirectoryReadme,
  sortDocsByReadmeOrder,
  splitHref,
  titleFromFile,
  toPosix,
} from './shared/site-utils.mjs';

/** 校验源项目关键目录，避免在错误路径下生成空站点。 */
async function assertSourceShape(sourceRoot) {
  const docsDir = path.join(sourceRoot, 'docs');
  const readmePath = path.join(sourceRoot, 'README.md');

  if (!(await pathExists(docsDir)) || !(await pathExists(readmePath))) {
    throw new Error(`源项目路径无效：${sourceRoot}，需要包含 README.md 和 docs/。`);
  }
}

/** 读取源文档元数据，并将 Markdown 内容写入生成目录。 */
async function syncMarkdownFiles(sourceRoot) {
  const sourceFiles = await listFiles(path.join(sourceRoot, 'docs'));
  const markdownFiles = sourceFiles.filter((filePath) => filePath.toLowerCase().endsWith('.md'));
  const rootReadmePath = path.join(sourceRoot, 'README.md');
  const allMarkdownFiles = [rootReadmePath, ...markdownFiles];
  const docs = [];

  for (const sourceFilePath of allMarkdownFiles) {
    const sourceRelative = toPosix(path.relative(sourceRoot, sourceFilePath));
    const generatedRelative = generatedRelativeForSource(sourceRelative);
    const generatedPath = path.join(generatedRoot, generatedRelative);
    const rawContent = await fs.readFile(sourceFilePath, 'utf8');
    const content = rewriteMarkdownLinks(rawContent, sourceFilePath, sourceRoot);

    await fs.mkdir(path.dirname(generatedPath), { recursive: true });
    await fs.writeFile(generatedPath, content, 'utf8');

    if (sourceRelative.startsWith('docs/')) {
      docs.push({
        sourceRelative,
        title: getMarkdownTitle(rawContent, titleFromFile(sourceFilePath)),
        route: routeForSourceMarkdown(sourceRelative),
      });
    }
  }

  const readmeOrders = await collectReadmeOrders(docs, sourceRoot);

  return {
    docs: sortDocsByReadmeOrder(docs, readmeOrders),
    readmeOrders,
  };
}

/** 复制文档资源目录；资源不存在时创建空目录，保证相对路径稳定。 */
async function syncAssets(sourceRoot) {
  const sourceAssets = path.join(sourceRoot, 'docs', 'assets');
  const generatedAssets = path.join(generatedRoot, 'docs', 'assets');
  const publicAssets = path.join(generatedRoot, 'public', 'docs', 'assets');

  await fs.mkdir(path.dirname(generatedAssets), { recursive: true });
  await fs.mkdir(path.dirname(publicAssets), { recursive: true });
  await fs.writeFile(path.join(generatedRoot, 'public', '.nojekyll'), '', 'utf8');

  if (await pathExists(sourceAssets)) {
    await fs.cp(sourceAssets, generatedAssets, { recursive: true, force: true });
    await fs.cp(sourceAssets, publicAssets, { recursive: true, force: true });
    return;
  }

  await fs.mkdir(generatedAssets, { recursive: true });
  await fs.mkdir(publicAssets, { recursive: true });
}

/** 同步站点自有 public 资源，避免 srcDir 指向 .generated 后丢失静态文件。 */
async function syncSitePublicAssets() {
  const sitePublic = path.join(siteRoot, 'public');
  const generatedPublic = path.join(generatedRoot, 'public');

  if (await pathExists(sitePublic)) {
    await fs.cp(sitePublic, generatedPublic, { recursive: true, force: true });
  }
}

/** 生成缺失资源的临时占位文件，避免源仓历史断链阻断 VitePress 构建。 */
async function writeMissingAssetPlaceholders(sourceRoot) {
  const sourceFiles = await listFiles(path.join(sourceRoot, 'docs'));
  const markdownFiles = [
    path.join(sourceRoot, 'README.md'),
    ...sourceFiles.filter((filePath) => filePath.toLowerCase().endsWith('.md')),
  ];
  const writtenTargets = new Set();

  for (const sourceFilePath of markdownFiles) {
    const content = await fs.readFile(sourceFilePath, 'utf8');
    for (const { href } of collectMarkdownLinks(content)) {
      if (!href || href.startsWith('#') || isExternalHref(href)) {
        continue;
      }

      const { pathname } = splitHref(href);
      if (!pathname || pathname.toLowerCase().endsWith('.md')) {
        continue;
      }

      const targetPath = path.resolve(path.dirname(sourceFilePath), safeDecodePathname(pathname));
      if (await pathExists(targetPath)) {
        continue;
      }

      const sourceRelative = toPosix(path.relative(sourceRoot, targetPath));
      if (sourceRelative.startsWith('..')) {
        continue;
      }

      const generatedPath = path.join(generatedRoot, generatedRelativeForSource(sourceRelative));
      if (writtenTargets.has(generatedPath)) {
        continue;
      }

      await fs.mkdir(path.dirname(generatedPath), { recursive: true });
      const placeholder = renderMissingAsset(sourceRelative);
      await fs.writeFile(generatedPath, placeholder, 'utf8');
      await writePublicPlaceholder(sourceRelative, placeholder);
      writtenTargets.add(generatedPath);
    }
  }
}

/** 为被引用但源仓不存在的 docs Markdown 生成临时页面，避免站点出现 404。 */
async function writeMissingMarkdownPlaceholders(sourceRoot) {
  const sourceFiles = await listFiles(path.join(sourceRoot, 'docs'));
  const markdownFiles = [
    path.join(sourceRoot, 'README.md'),
    ...sourceFiles.filter((filePath) => filePath.toLowerCase().endsWith('.md')),
  ];
  const writtenTargets = new Set();

  for (const sourceFilePath of markdownFiles) {
    const content = await fs.readFile(sourceFilePath, 'utf8');
    for (const { href } of collectMarkdownLinks(content)) {
      if (!href || href.startsWith('#') || isExternalHref(href)) {
        continue;
      }

      const { pathname } = splitHref(href);
      if (!pathname || !pathname.toLowerCase().endsWith('.md')) {
        continue;
      }

      const targetPath = path.resolve(path.dirname(sourceFilePath), safeDecodePathname(pathname));
      if (await pathExists(targetPath)) {
        continue;
      }

      const sourceRelative = toPosix(path.relative(sourceRoot, targetPath));
      if (!sourceRelative.startsWith('docs/')) {
        continue;
      }

      const generatedPath = path.join(generatedRoot, generatedRelativeForSource(sourceRelative));
      if (writtenTargets.has(generatedPath)) {
        continue;
      }

      await fs.mkdir(path.dirname(generatedPath), { recursive: true });
      await fs.writeFile(generatedPath, renderMissingMarkdown(sourceRelative), 'utf8');
      writtenTargets.add(generatedPath);
    }
  }
}

/** 输出缺失文档占位页，明确问题来自源仓文档缺失。 */
function renderMissingMarkdown(sourceRelative) {
  return `# 文档暂缺

源文档 \`${sourceRelative}\` 在当前 \`Web-Presentation\` 源仓中不存在。

该页面由站点同步脚本临时生成，用于避免发布后的文档链接返回 404。请在源仓补齐文档后重新同步站点。
`;
}

/** 同步缺失资源占位到 public，使原始 docs/assets 路径也可直接访问。 */
async function writePublicPlaceholder(sourceRelative, placeholder) {
  const publicPath = path.join(generatedRoot, 'public', sourceRelative);
  await fs.mkdir(path.dirname(publicPath), { recursive: true });
  await fs.writeFile(publicPath, placeholder, 'utf8');
}

/** 根据扩展名输出占位内容；SVG 图片使用可视占位，其它资源使用文本占位。 */
function renderMissingAsset(sourceRelative) {
  if (sourceRelative.toLowerCase().endsWith('.svg')) {
    const label = sourceRelative.length > 58 ? `${sourceRelative.slice(0, 55)}...` : sourceRelative;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="360" viewBox="0 0 960 360" role="img" aria-label="缺失资源占位图">
  <rect width="960" height="360" fill="#f8fafc"/>
  <rect x="24" y="24" width="912" height="312" rx="8" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="480" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#0f766e">缺失资源占位图</text>
  <text x="480" y="212" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">${escapeXml(label)}</text>
</svg>
`;
  }

  return `缺失资源占位文件：${sourceRelative}\n`;
}

/** 转义 SVG 文本节点，避免资源路径中的特殊字符破坏占位图。 */
function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 生成 VitePress 首页，首页突出产品能力和精选案例。 */
async function writeHomePage(showcases) {
  await fs.writeFile(path.join(generatedRoot, 'index.md'), renderHomePage(showcases), 'utf8');
}

/** 生成案例展示页，内容来自 site/showcases 下的项目模板包。 */
async function writeShowcasesPage(showcases) {
  await fs.writeFile(path.join(generatedRoot, 'showcases.md'), renderShowcasesPage(showcases), 'utf8');
}

/** 生成案例组件静态数据，供首页、列表页和详情页复用。 */
async function writeShowcasesData(showcases) {
  await fs.writeFile(path.join(generatedRoot, 'showcase-summaries.ts'), renderShowcaseSummariesData(showcases), 'utf8');
  await fs.writeFile(path.join(generatedRoot, 'showcases-data.ts'), renderShowcasesData(showcases), 'utf8');
}

/** 生成每个案例的详情页，承载截图轮播、配置详情和下载入口。 */
async function writeShowcaseDetailPages(showcases) {
  for (const showcase of showcases) {
    const detailPath = path.join(generatedRoot, 'showcases', `${showcase.slug}.md`);
    await fs.mkdir(path.dirname(detailPath), { recursive: true });
    await fs.writeFile(detailPath, renderShowcaseDetailPage(showcase), 'utf8');
  }
}

/** 构建单个文档分区的侧边栏，按目录自动生成二级分组。 */
function buildSectionSidebar(docs, basePrefix, sectionTitle, readmeOrders) {
  const sectionDocs = docs.filter((doc) => doc.sourceRelative.startsWith(basePrefix));
  const topDocs = [];
  const nestedGroups = new Map();

  for (const doc of sectionDocs) {
    const rest = doc.sourceRelative.slice(basePrefix.length);
    const parts = rest.split('/');

    if (parts.length === 1) {
      topDocs.push(doc);
      continue;
    }

    const groupName = parts[0];
    if (!nestedGroups.has(groupName)) {
      nestedGroups.set(groupName, []);
    }
    nestedGroups.get(groupName).push(doc);
  }

  const baseDirectory = basePrefix.replace(/\/$/, '');
  const topItems = sortDocsByDirectoryReadme(topDocs, baseDirectory, readmeOrders)
    .map((doc) => ({ text: doc.title, link: doc.route }));

  const groupItems = [...nestedGroups.entries()].map(([groupName, groupDocs]) => {
    const readme = groupDocs.find((doc) => isReadmeMarkdown(doc.sourceRelative));
    const groupDirectory = `${basePrefix}${groupName}`;
    const children = sortDocsByDirectoryReadme(
      groupDocs.filter((doc) => doc !== readme),
      groupDirectory,
      readmeOrders,
    )
      .map((doc) => ({ text: doc.title, link: doc.route }));

    return {
      text: readme?.title || groupName,
      link: readme?.route,
      items: children,
    };
  });

  return [{ text: sectionTitle, items: [...topItems, ...groupItems] }];
}

/** 生成导航与侧边栏配置模块，供 VitePress config 直接导入。 */
async function writeVitePressData(docs, readmeOrders) {
  const firstUserDoc = docs.find((doc) => doc.sourceRelative.startsWith('docs/user/'));
  const firstDeveloperDoc = docs.find((doc) => doc.sourceRelative.startsWith('docs/developer/'));
  const data = {
    nav: [
      { text: '首页', link: '/' },
      { text: '案例展示', link: '/showcases.html' },
      { text: '用户文档', link: firstUserDoc?.route || '/docs/' },
      { text: '开发文档', link: firstDeveloperDoc?.route || '/docs/' },
      { text: '文档中心', link: '/docs/' },
    ],
    sidebar: {
      '/docs/user/': buildSectionSidebar(docs, 'docs/user/', '用户文档', readmeOrders),
      '/docs/developer/': buildSectionSidebar(docs, 'docs/developer/', '开发文档', readmeOrders),
      '/docs/': [
        ...buildSectionSidebar(docs, 'docs/user/', '用户文档', readmeOrders),
        ...buildSectionSidebar(docs, 'docs/developer/', '开发文档', readmeOrders),
      ],
    },
  };

  const moduleContent = `/**
 * 文件功能：由 sync-docs 自动生成的 VitePress 导航数据。
 */
import type { DefaultTheme } from 'vitepress';

export const generatedNav: DefaultTheme.NavItem[] = ${JSON.stringify(data.nav, null, 2)};

export const generatedSidebar: DefaultTheme.Sidebar = ${JSON.stringify(data.sidebar, null, 2)};
`;

  await fs.writeFile(path.join(generatedRoot, 'vitepress-data.ts'), moduleContent, 'utf8');
}

/** 主流程：清空生成目录，重新同步资源、文档和站点配置数据。 */
async function main() {
  const sourceRoot = resolveSourceRoot();
  await assertSourceShape(sourceRoot);
  await fs.rm(generatedRoot, { recursive: true, force: true });
  await fs.mkdir(generatedRoot, { recursive: true });
  await syncAssets(sourceRoot);
  await syncSitePublicAssets();
  const showcases = await scanShowcases();
  await writeShowcasesData(showcases);
  await writeMissingAssetPlaceholders(sourceRoot);
  const { docs, readmeOrders } = await syncMarkdownFiles(sourceRoot);
  await writeMissingMarkdownPlaceholders(sourceRoot);
  await writeHomePage(showcases);
  await writeShowcasesPage(showcases);
  await writeShowcaseDetailPages(showcases);
  await writeVitePressData(docs, readmeOrders);

  console.log(`已同步 ${docs.length} 篇文档、${showcases.length} 个案例：${toPosix(path.relative(siteRoot, generatedRoot))}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
