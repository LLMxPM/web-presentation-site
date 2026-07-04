/**
 * 文件功能：渲染 Web-Presentation-site 的页面入口、案例详情页和组件数据模块。
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
  pageCount: number;
  pageWidth: number | null;
  pageHeight: number | null;
  aspectRatio: string;
  baseFontSize: string;
  themeNames: string[];
  previewUrl: string;
  featured: boolean;
  styleSpecMarkdown: string;
  createdAt: string;
  updatedAt: string;
  detailPath: string;
  coverPath: string;
  packagePath: string;
  packageFileName: string;
  slideCount: number;
  slides: ShowcaseSlide[];
}

export interface ShowcaseSlide {
  fileName: string;
  title: string;
  order: number;
  width: number | null;
  height: number | null;
  sourcePageCode: string;
  imagePath: string;
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
    showcaseDirectory: 'site/showcases/*.wptemplate.zip',
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
  pageCount: number;
  pageWidth: number | null;
  pageHeight: number | null;
  aspectRatio: string;
  baseFontSize: string;
  themeNames: string[];
  previewUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  detailPath: string;
  coverPath: string;
  packageFileName: string;
  slideCount: number;
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
    showcaseDirectory: 'site/showcases/*.wptemplate.zip',
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
    pageCount: showcase.pageCount,
    pageWidth: showcase.pageWidth,
    pageHeight: showcase.pageHeight,
    aspectRatio: showcase.aspectRatio,
    baseFontSize: showcase.baseFontSize,
    themeNames: showcase.themeNames,
    previewUrl: showcase.previewUrl,
    featured: showcase.featured,
    styleSpecMarkdown: showcase.styleSpecMarkdown,
    createdAt: showcase.createdAt,
    updatedAt: showcase.updatedAt,
    detailPath: buildShowcaseDetailPath(showcase),
    coverPath: buildPublicAssetPath(showcase, showcase.coverFileName),
    packagePath: buildPublicAssetPath(showcase, showcase.packageFileName),
    packageFileName: showcase.packageFileName,
    slideCount: showcase.slides.length,
    slides: showcase.slides.map((slide) => ({
      fileName: slide.fileName,
      title: slide.title,
      order: slide.order,
      width: slide.width,
      height: slide.height,
      sourcePageCode: slide.sourcePageCode,
      imagePath: buildPublicAssetPath(showcase, slide.fileName),
    })),
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
    pageCount: showcase.pageCount,
    pageWidth: showcase.pageWidth,
    pageHeight: showcase.pageHeight,
    aspectRatio: showcase.aspectRatio,
    baseFontSize: showcase.baseFontSize,
    themeNames: showcase.themeNames,
    previewUrl: showcase.previewUrl,
    featured: showcase.featured,
    createdAt: showcase.createdAt,
    updatedAt: showcase.updatedAt,
    detailPath: buildShowcaseDetailPath(showcase),
    coverPath: buildPublicAssetPath(showcase, showcase.coverFileName),
    packageFileName: showcase.packageFileName,
    slideCount: showcase.slides.length,
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

/** 构建案例详情页根路径，运行时由 withBase 补站点 base。 */
function buildShowcaseDetailPath(showcase) {
  return `/showcases/${encodePathSegment(showcase.slug)}.html`;
}

/** 构建 public 目录中的案例资源路径，运行时由 withBase 补站点 base。 */
function buildPublicAssetPath(showcase, fileName) {
  return `/showcases/${encodePathSegment(showcase.slug)}/${encodePathSegment(fileName)}`;
}

/** 编码单个 URL path segment。 */
function encodePathSegment(value) {
  return encodeURIComponent(value).replace(/%2F/gi, '/');
}
