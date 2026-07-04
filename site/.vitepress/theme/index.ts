/**
 * 文件功能：注册 VitePress 默认主题并加载 Web-Presentation-site 的站点样式。
 */
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import HomePage from './components/HomePage.vue';
import ShowcaseDetailPage from './components/ShowcaseDetailPage.vue';
import ShowcasesPage from './components/ShowcasesPage.vue';
import './custom.css';
import './showcase.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage);
    app.component('ShowcasesPage', ShowcasesPage);
    app.component('ShowcaseDetailPage', ShowcaseDetailPage);
  },
} satisfies Theme;
