<!-- 文件功能：渲染案例展示列表页。 -->
<template>
  <main class="site-page showcase-page" aria-label="案例展示">
    <a class="showcase-back-link" :href="siteUrl('/')" aria-label="返回首页">
      <span aria-hidden="true">←</span>
      返回首页
    </a>

    <section class="showcase-page-hero" aria-label="案例列表概览">
      <div class="showcase-page-heading">
        <p class="home-eyebrow">Showcase library</p>
        <h1>案例列表</h1>
        <p>展示 Web-Presentation 平台生成的真实演示项目。每个案例都包含封面截图、页面规模、主题信息和可导入的模板包。</p>
      </div>
      <div class="showcase-stat-grid" aria-label="案例统计">
        <article v-for="stat in statCards" :key="stat.label" class="showcase-stat">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </article>
      </div>
    </section>

    <div v-if="showcaseSummaries.length > 0" class="showcase-grid">
      <ShowcaseCard v-for="showcase in showcaseSummaries" :key="showcase.slug" :showcase="showcase" />
    </div>
    <div v-else class="showcase-empty">
      <h3>还没有可展示的项目模板包</h3>
      <p>将解压后的模板目录放入 <code>site/showcases/</code> 后，构建脚本会自动生成案例卡片、封面和下载包。</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { showcaseSummaries } from '../../../.generated/showcase-summaries';
import ShowcaseCard from './ShowcaseCard.vue';

/** 汇总案例页顶部的规模指标，输入来自生成脚本产出的案例摘要。 */
const statCards = computed(() => {
  const pageTotal = showcaseSummaries.reduce((total, showcase) => total + showcase.pageCount, 0);

  return [
    { label: '项目数量', value: String(showcaseSummaries.length) },
    { label: '页面总数', value: String(pageTotal) },
  ];
});

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
