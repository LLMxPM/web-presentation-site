/**
 * 文件功能：注册 VitePress 默认主题并加载 Web-Presentation-site 的站点样式。
 */
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import HomePage from './components/HomePage.vue';
import ShowcaseDetailPage from './components/ShowcaseDetailPage.vue';
import ShowcasesPage from './components/ShowcasesPage.vue';
import SiteFooter from './components/SiteFooter.vue';
import './custom.css';
import './showcase.css';

export default {
  extends: DefaultTheme,
  /** 复用默认 Layout，并在全站底部插槽挂载统一页脚（版权 + 备案号）。 */
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(SiteFooter),
    });
  },
  enhanceApp({ app }) {
    app.component('HomePage', HomePage);
    app.component('ShowcasesPage', ShowcasesPage);
    app.component('ShowcaseDetailPage', ShowcaseDetailPage);
  },
} satisfies Theme;
