/**
 * 文件功能：声明构建期由 Vite define 注入的全局常量类型。
 */

/** 构建时读取环境变量 ICP_BEIAN 注入的备案号，未配置时为空字符串。 */
declare const __SITE_BEIAN_NUMBER__: string;

/** 构建时读取环境变量 ICP_BEIAN_HREF 注入的备案跳转地址。 */
declare const __SITE_BEIAN_HREF__: string;
