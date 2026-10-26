/**
 * 文件功能：渲染 Web-Presentation-site 的页面入口、案例详情页和组件数据模块。
 *
 * 案例数据完全来自 `site/showcases/<slug>/showcase.json`，构建期不再解析模板源码。
 */
import { sourceRef, sourceRepo } from './site-utils.mjs';

/** 渲染首页路由入口；主体布局由 VitePress 主题中的 HomePage 组件负责。 */
export function renderHomePage() {
  return `---
layout: home
title: Web-Presentation
editLink: false
lastUpdated: false
---

<HomePage />
`;
}

/** 渲染案例展示路由入口；主体布局由 VitePress 主题中的 ShowcasesPage 组件负责。 */
export function renderShowcasesPage() {
  return `---
layout: home
title: 案例展示
editLink: false
lastUpdated: false
---

<ShowcasesPage />
`;
}

/** 渲染案例列表数据模块，供 Vue 组件直接消费。 */
export function renderShowcasesData(showcases) {
  return `/**
 * 文件功能：由 sync-docs 自动生成的案例展示组件数据。
 */
export interface ShowcaseDetail {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  featured: boolean;
  pageCount: number;
  pageWidth: number | null;
  pageHeight: number | null;
  aspectRatio: string;
  baseFontSize: string;
  themeKey: string;
  themeNames: string[];
  assetTypes: string[];
  hasComponents: boolean;
  backgroundTone: string;
  menuMode: string;
  styleSpecMarkdown: string;
  sourceProjectCode: string;
  createdAt: string;
  updatedAt: string;
  detailPath: string;
  coverPath: string;
  coverAvailable: boolean;
  packagePath: string;
  packageFileName: string;
  packageAvailable: boolean;
  previewAvailable: boolean;
  previewPath: string;
}

export interface SourceMeta {
  sourceRepo: string;
  sourceRef: string;
  showcaseDirectory: string;
}

export const showcases: ShowcaseDetail[] = ${JSON.stringify(showcases.map(serializeShowcaseDetail), null, 2)};

export const sourceMeta: SourceMeta = ${JSON.stringify({
    sourceRepo,
    sourceRef,
    showcaseDirectory: 'site/showcases/<slug>/showcase.json',
  }, null, 2)};
`;
}

/** 渲染轻量案例摘要数据模块，供首页和案例列表使用。 */
export function renderShowcaseSummariesData(showcases) {
  return `/**
 * 文件功能：由 sync-docs 自动生成的案例展示摘要数据。
 */
export interface ShowcaseSummary {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  featured: boolean;
  pageCount: number;
  pageWidth: number | null;
  pageHeight: number | null;
  aspectRatio: string;
  baseFontSize: string;
  themeNames: string[];
  assetTypes: string[];
  hasComponents: boolean;
  backgroundTone: string;
  createdAt: string;
  updatedAt: string;
  detailPath: string;
  coverPath: string;
  coverAvailable: boolean;
  packageFileName: string;
  packageAvailable: boolean;
  previewAvailable: boolean;
  previewPath: string;
}

export interface SourceMeta {
  sourceRepo: string;
  sourceRef: string;
  showcaseDirectory: string;
}

export const showcaseSummaries: ShowcaseSummary[] = ${JSON.stringify(showcases.map(serializeShowcaseSummary), null, 2)};

export const sourceMeta: SourceMeta = ${JSON.stringify({
    sourceRepo,
    sourceRef,
    showcaseDirectory: 'site/showcases/<slug>/showcase.json',
  }, null, 2)};
`;
}

/** 渲染单个案例详情页。 */
export function renderShowcaseDetailPage(showcase) {
  return `---
layout: home
title: ${JSON.stringify(showcase.title)}
editLink: false
lastUpdated: false
---

<ShowcaseDetailPage slug="${escapeAttribute(showcase.slug)}" />
`;
}

/** 序列化详情页需要的完整案例数据。 */
function serializeShowcaseDetail(showcase) {
  return {
    slug: showcase.slug,
    title: showcase.title,
    summary: showcase.summary,
    category: showcase.category,
    tags: showcase.tags,
    featured: showcase.featured,
    pageCount: showcase.pageCount,
    pageWidth: showcase.pageWidth,
    pageHeight: showcase.pageHeight,
    aspectRatio: showcase.aspectRatio,
    baseFontSize: showcase.baseFontSize,
    themeKey: showcase.themeKey,
    themeNames: showcase.themeNames,
    assetTypes: showcase.assetTypes,
    hasComponents: showcase.hasComponents,
    backgroundTone: showcase.backgroundTone,
    menuMode: showcase.menuMode,
    styleSpecMarkdown: showcase.styleSpecMarkdown,
    sourceProjectCode: showcase.sourceProjectCode,
    createdAt: showcase.createdAt,
    updatedAt: showcase.updatedAt,
    detailPath: showcase.detailPath,
    coverPath: showcase.coverPath,
    coverAvailable: showcase.coverAvailable,
    packagePath: showcase.packagePath,
    packageFileName: showcase.packageFile,
    packageAvailable: showcase.packageAvailable,
    previewAvailable: showcase.previewAvailable,
    previewPath: showcase.previewPath,
  };
}

/** 序列化首页和列表页需要的轻量案例摘要。 */
function serializeShowcaseSummary(showcase) {
  return {
    slug: showcase.slug,
    title: showcase.title,
    summary: showcase.summary,
    category: showcase.category,
    tags: showcase.tags,
    featured: showcase.featured,
    pageCount: showcase.pageCount,
    pageWidth: showcase.pageWidth,
    pageHeight: showcase.pageHeight,
    aspectRatio: showcase.aspectRatio,
    baseFontSize: showcase.baseFontSize,
    themeNames: showcase.themeNames,
    assetTypes: showcase.assetTypes,
    hasComponents: showcase.hasComponents,
    backgroundTone: showcase.backgroundTone,
    createdAt: showcase.createdAt,
    updatedAt: showcase.updatedAt,
    detailPath: showcase.detailPath,
    coverPath: showcase.coverPath,
    coverAvailable: showcase.coverAvailable,
    packageFileName: showcase.packageFile,
    packageAvailable: showcase.packageAvailable,
    previewAvailable: showcase.previewAvailable,
    previewPath: showcase.previewPath,
  };
}

/** 转义 HTML 文本节点。 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 转义 HTML 属性值。 */
function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}
