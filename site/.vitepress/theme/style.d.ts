/**
 * 文件功能：声明 VitePress 主题中 CSS 文件的副作用导入类型。
 */
declare module '*.css';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
