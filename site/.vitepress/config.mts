/**
 * 文件功能：配置 Web-Presentation-site 的 VitePress 构建、导航、搜索和 GitHub Pages base。
 */
import { defineConfig } from 'vitepress';
import { generatedNav, generatedSidebar } from '../.generated/vitepress-data';

/** 规范化 GitHub Pages base，保证首尾斜杠符合 VitePress 要求。 */
function normalizeBase(base: string): string {
  const withLeadingSlash = base.startsWith('/') ? base : `/${base}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

const siteBase = normalizeBase(process.env.SITE_BASE || '/web-presentation-site/');

export default defineConfig({
  lang: 'zh-CN',
  title: 'Web-Presentation',
  description: 'AI 演示文稿创作平台项目主页与文档中心',
  base: siteBase,
  srcDir: '.generated',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${siteBase}favicon.svg` }]],
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: false,
  themeConfig: {
    nav: generatedNav,
    sidebar: generatedSidebar,
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LLMxPM/Web-Presentation' },
    ],
    editLink: {
      pattern: ({ filePath }) => {
        let sourcePath = filePath;
        if (filePath === 'index.md' || filePath === 'project-readme.md') {
          sourcePath = 'README.md';
        } else if (filePath === 'docs/index.md') {
          sourcePath = 'docs/README.md';
        } else if (filePath.startsWith('docs/') && filePath.endsWith('/index.md')) {
          sourcePath = `${filePath.slice(0, -'index.md'.length)}README.md`;
        }
        return `https://github.com/LLMxPM/Web-Presentation/edit/main/${sourcePath}`;
      },
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      copyright: '© 2026 LLMxPM · Web-Presentation',
    },
  },
});
