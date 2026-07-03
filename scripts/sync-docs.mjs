/**
 * 文件功能：从 web-presentation 同步 Markdown 文档和资源，并生成 VitePress 导航数据。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  collectMarkdownLinks,
  generatedRelativeForSource,
  generatedRoot,
  getMarkdownTitle,
  isExternalHref,
  listFiles,
  pathExists,
  resolveSourceRoot,
  rewriteMarkdownLinks,
  routeForSourceMarkdown,
  safeDecodePathname,
  siteRoot,
  sortDocsByReadmeOrder,
  sourceRef,
  sourceRepo,
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
  const docsReadmeContent = await fs.readFile(path.join(sourceRoot, 'docs', 'README.md'), 'utf8');
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

  return sortDocsByReadmeOrder(docs, docsReadmeContent, sourceRoot);
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

源文档 \`${sourceRelative}\` 在当前 \`web-presentation\` 源仓中不存在。

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

/** 生成 VitePress 首页，首页聚合项目定位、关键入口和源 README 摘要。 */
async function writeHomePage(sourceRoot) {
  const sourceReadme = await fs.readFile(path.join(sourceRoot, 'README.md'), 'utf8');
  const summary = sourceReadme
    .split(/\r?\n/)
    .find((line) => line.trim() && !line.startsWith('#'))
    ?.trim() || '面向 AI 演示文稿创作的平台集成仓库。';

  const home = `---
layout: home
hero:
  name: web-presentation
  text: AI 演示文稿创作平台
  tagline: ${JSON.stringify(summary)}
  actions:
    - theme: brand
      text: 用户快速上手
      link: /docs/user/getting-started.html
    - theme: alt
      text: 平台架构
      link: /docs/developer/platform-architecture.html
    - theme: alt
      text: GitHub
      link: https://github.com/${sourceRepo}
features:
  - title: 平台控制面
    details: 管理用户、工作空间、项目、页面、资源、组件、主题、样式、AI Agent 和构建产物。
  - title: 创作工作台
    details: 面向演示文稿创作，串联页面编辑、资产引用、AI 侧边栏、预览和构建入口。
  - title: Runtime 能力
    details: 基于 Vue/Vite 提供页面预览、组件预览、截图、诊断和构建执行链路。
  - title: 文档自动同步
    details: 站点构建时扫描源仓文档，自动生成导航、侧边栏和项目主页。
---

<section class="home-visual" aria-label="平台总览">
  <div>
    <p class="home-eyebrow">项目文档入口</p>
    <h2>从产品理解到部署运维的统一入口</h2>
    <p>用户文档、开发文档和部署说明均来自 <code>web-presentation</code> 源仓，站点只负责解析、组织和发布。</p>
    <div class="home-links">
      <a href="./docs/">文档中心</a>
      <a href="./docs/user/project-status.html">当前状态与路线</a>
      <a href="./docs/developer/deployment-guide.html">生产部署指南</a>
      <a href="./project-readme.html">源仓 README</a>
    </div>
  </div>
  <img src="./docs/assets/平台总览.png" alt="web-presentation 平台总览图">
</section>

<section class="home-meta">
  <span>文档源：${sourceRepo}@${sourceRef}</span>
  <span>构建目录：site/.generated</span>
</section>
`;

  await fs.writeFile(path.join(generatedRoot, 'index.md'), home, 'utf8');
}

/** 构建单个文档分区的侧边栏，按目录自动生成二级分组。 */
function buildSectionSidebar(docs, basePrefix, sectionTitle) {
  const sectionDocs = docs.filter((doc) => doc.sourceRelative.startsWith(basePrefix));
  const topItems = [];
  const nestedGroups = new Map();

  for (const doc of sectionDocs) {
    const rest = doc.sourceRelative.slice(basePrefix.length);
    const parts = rest.split('/');

    if (parts.length === 1) {
      topItems.push({ text: doc.title, link: doc.route });
      continue;
    }

    const groupName = parts[0];
    if (!nestedGroups.has(groupName)) {
      nestedGroups.set(groupName, []);
    }
    nestedGroups.get(groupName).push(doc);
  }

  const groupItems = [...nestedGroups.entries()].map(([groupName, groupDocs]) => {
    const readme = groupDocs.find((doc) => doc.sourceRelative.endsWith('/README.md'));
    const children = groupDocs
      .filter((doc) => doc !== readme)
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
async function writeVitePressData(docs) {
  const firstUserDoc = docs.find((doc) => doc.sourceRelative.startsWith('docs/user/'));
  const firstDeveloperDoc = docs.find((doc) => doc.sourceRelative.startsWith('docs/developer/'));
  const data = {
    nav: [
      { text: '首页', link: '/' },
      { text: '用户文档', link: firstUserDoc?.route || '/docs/' },
      { text: '开发文档', link: firstDeveloperDoc?.route || '/docs/' },
      { text: '文档中心', link: '/docs/' },
      { text: 'GitHub', link: `https://github.com/${sourceRepo}` },
    ],
    sidebar: {
      '/docs/user/': buildSectionSidebar(docs, 'docs/user/', '用户文档'),
      '/docs/developer/': buildSectionSidebar(docs, 'docs/developer/', '开发文档'),
      '/docs/': [
        ...buildSectionSidebar(docs, 'docs/user/', '用户文档'),
        ...buildSectionSidebar(docs, 'docs/developer/', '开发文档'),
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
  await writeMissingAssetPlaceholders(sourceRoot);
  const docs = await syncMarkdownFiles(sourceRoot);
  await writeMissingMarkdownPlaceholders(sourceRoot);
  await writeHomePage(sourceRoot);
  await writeVitePressData(docs);

  console.log(`已同步 ${docs.length} 篇文档：${toPosix(path.relative(siteRoot, generatedRoot))}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
