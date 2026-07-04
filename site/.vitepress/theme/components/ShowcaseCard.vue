<!-- 文件功能：渲染首页和案例展示页复用的案例卡片。 -->
<template>
  <article class="showcase-card" :class="{ 'showcase-card-featured': showcase.featured }">
    <a class="showcase-card-link" :href="siteUrl(showcase.detailPath)">
      <span class="showcase-cover">
        <img :src="siteUrl(showcase.coverPath)" :alt="`${showcase.title} 封面`">
        <span class="showcase-cover-badge">{{ formatRatio(showcase) }}</span>
      </span>
      <span class="showcase-card-body">
        <span class="showcase-card-title-row">
          <span class="showcase-card-heading">{{ showcase.title }}</span>
          <span v-if="showcase.featured">精选</span>
        </span>
        <span class="showcase-card-summary">{{ formatSummary(showcase.summary) }}</span>
        <span class="showcase-card-meta" aria-label="案例关键数据">
          <span>
            <strong>{{ showcase.pageCount || '未标注' }}</strong>
            <small>页面</small>
          </span>
          <span>
            <strong>{{ formatSize(showcase) }}</strong>
            <small>尺寸</small>
          </span>
          <span>
            <strong>{{ formatTheme(showcase.themeNames) }}</strong>
            <small>主题</small>
          </span>
        </span>
        <span v-if="visibleTags.length > 0" class="showcase-tags">
          <span v-for="tag in visibleTags.slice(0, 3)" :key="tag">{{ tag }}</span>
        </span>
      </span>
    </a>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import type { ShowcaseSummary } from '../../../.generated/showcase-summaries';

const props = defineProps<{
  showcase: ShowcaseSummary;
}>();

/** 卡片只展示非主题类标签，避免标签和主题字段重复。 */
const visibleTags = computed(() => {
  const themeNames = new Set(props.showcase.themeNames);
  return props.showcase.tags.filter((tag) => !themeNames.has(tag));
});

/** 格式化卡片摘要，缺失时给出稳定占位说明，避免卡片主体塌陷。 */
function formatSummary(value: string): string {
  return value || '包含完整页面截图、主题配置和可复用项目模板包。';
}

/** 格式化封面角标，优先展示项目画布比例。 */
function formatRatio(showcase: ShowcaseSummary): string {
  return showcase.aspectRatio || formatSize(showcase);
}

/** 格式化页面尺寸，供缺少宽高比的数据兜底展示。 */
function formatSize(showcase: ShowcaseSummary): string {
  if (!showcase.pageWidth || !showcase.pageHeight) {
    return '模板包';
  }

  return `${showcase.pageWidth} x ${showcase.pageHeight}`;
}

/** 压缩主题名称，卡片中只展示首个主题，完整主题在详情页呈现。 */
function formatTheme(themeNames: string[]): string {
  return themeNames[0] || props.showcase.category || '未标注';
}

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
