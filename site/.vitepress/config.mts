/**
 * 文件功能：配置 web-presentation-site 的 VitePress 构建、导航、搜索和 GitHub Pages base。
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
  title: 'web-presentation',
  description: 'AI 演示文稿创作平台项目主页与文档中心',
  base: siteBase,
  srcDir: '.generated',
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
      { icon: 'github', link: 'https://github.com/LLMxPM/web-presentation' },
    ],
    editLink: {
      pattern: ({ filePath }) => {
        const sourcePath = filePath === 'index.md' || filePath === 'project-readme.md'
          ? 'README.md'
          : filePath;
        return `https://github.com/LLMxPM/web-presentation/edit/main/${sourcePath}`;
      },
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: '由 web-presentation 源文档自动生成',
      copyright: 'Copyright © LLMxPM',
    },
  },
});
