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

/**
 * 读取备案配置：
 * - 未设置 ICP_BEIAN 时注入空字符串，页脚备案区域整体不渲染，等价于关闭开关；
 * - ICP_BEIAN_HREF 缺省指向工信部备案查询站。
 */
const beianNumber = (process.env.ICP_BEIAN || '').trim();
const beianHref = (process.env.ICP_BEIAN_HREF || 'https://beian.miit.gov.cn/').trim();

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
  vite: {
    define: {
      __SITE_BEIAN_NUMBER__: JSON.stringify(beianNumber),
      __SITE_BEIAN_HREF__: JSON.stringify(beianHref),
    },
  },
  markdown: {
    languageAlias: {
      env: 'dotenv',
    },
  },
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
    // 页脚由 theme/components/SiteFooter.vue 统一渲染（版权 + 备案号同一行）。
    // 这里不再配置 footer，避免默认 VPFooter 与自定义页脚重复。
  },
});
