<!-- 文件功能：渲染案例展示列表页，支持关键词、分类与标签筛选。 -->
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
        <p>展示 Web-Presentation 平台生成的真实演示项目。每个案例包含主图、项目资料、在线预览和可导入的模板包。</p>
      </div>
      <div class="showcase-stat-grid" aria-label="案例统计">
        <article v-for="stat in statCards" :key="stat.label" class="showcase-stat">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </article>
      </div>
    </section>

    <section v-if="showcaseSummaries.length > 0" class="showcase-filter" aria-label="案例筛选">
      <div class="showcase-filter-row">
        <input
          v-model="keyword"
          class="showcase-filter-search"
          type="search"
          placeholder="搜索标题、摘要或标签"
          aria-label="搜索案例"
        >
        <span class="showcase-filter-count">{{ filteredShowcases.length }} / {{ showcaseSummaries.length }}</span>
        <button
          v-if="hasActiveFilter"
          type="button"
          class="showcase-filter-reset"
          @click="resetFilters"
        >
          清空筛选
        </button>
      </div>

      <div class="showcase-filter-row showcase-filter-chips" aria-label="按分类筛选">
        <span class="showcase-filter-label">分类</span>
        <button
          v-for="item in categoryOptions"
          :key="item.name"
          type="button"
          class="showcase-chip"
          :class="{ 'showcase-chip-active': category === item.name }"
          @click="toggleCategory(item.name)"
        >
          {{ item.name }}
          <span>{{ item.count }}</span>
        </button>
      </div>

      <div v-if="tagOptions.length > 0" class="showcase-filter-row showcase-filter-chips" aria-label="按标签筛选">
        <span class="showcase-filter-label">标签</span>
        <button
          v-for="item in tagOptions"
          :key="item.tag"
          type="button"
          class="showcase-chip"
          :class="{ 'showcase-chip-active': activeTags.includes(item.tag) }"
          @click="toggleTag(item.tag)"
        >
          {{ item.tag }}
          <span>{{ item.count }}</span>
        </button>
      </div>
    </section>

    <div v-if="filteredShowcases.length > 0" class="showcase-grid">
      <ShowcaseCard v-for="showcase in filteredShowcases" :key="showcase.slug" :showcase="showcase" />
    </div>
    <div v-else-if="showcaseSummaries.length > 0" class="showcase-empty">
      <h3>没有符合筛选条件的案例</h3>
      <p>试试清空筛选，或换一个关键词。</p>
    </div>
    <div v-else class="showcase-empty">
      <h3>还没有可展示的案例</h3>
      <p>运行 <code>pnpm run manage:showcases</code> 打开本地管理页，导入模板包后即可生成案例卡片。</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import { showcaseSummaries } from '../../../.generated/showcase-summaries';
import ShowcaseCard from './ShowcaseCard.vue';

const keyword = ref('');
const category = ref('');
const activeTags = ref<string[]>([]);

/** 汇总案例页顶部的规模指标，输入来自生成脚本产出的案例摘要。 */
const statCards = computed(() => {
  const pageTotal = showcaseSummaries.reduce((total, showcase) => total + showcase.pageCount, 0);
  return [
    { label: '项目数量', value: String(showcaseSummaries.length) },
    { label: '页面总数', value: String(pageTotal) },
  ];
});

/** 统计当前数据中真实出现的分类，分类是自由文本，直接按文本分组。 */
const categoryOptions = computed(() => {
  const map = new Map<string, number>();
  for (const item of showcaseSummaries) {
    map.set(item.category, (map.get(item.category) || 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'zh-CN'));
});

/** 统计真实出现的标签，按出现次数倒序，便于优先展示常用标签。 */
const tagOptions = computed(() => {
  const map = new Map<string, number>();
  for (const item of showcaseSummaries) {
    for (const tag of item.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag, 'zh-CN'));
});

/** 组合关键词、分类与标签筛选；标签之间为「或」关系。 */
const filteredShowcases = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase();

  return showcaseSummaries.filter((item) => {
    if (category.value && item.category !== category.value) {
      return false;
    }
    if (activeTags.value.length > 0 && !activeTags.value.some((tag) => item.tags.includes(tag))) {
      return false;
    }
    if (!normalizedKeyword) {
      return true;
    }

    const haystack = [item.title, item.summary, item.category, ...item.tags].join(' ').toLowerCase();
    return haystack.includes(normalizedKeyword);
  });
});

const hasActiveFilter = computed(() => Boolean(keyword.value || category.value || activeTags.value.length > 0));

/** 分类为单选，再次点击同一分类时取消。 */
function toggleCategory(key: string): void {
  category.value = category.value === key ? '' : key;
}

/** 标签为多选，用于「命中任意标签」的宽口径筛选。 */
function toggleTag(tag: string): void {
  const index = activeTags.value.indexOf(tag);
  if (index >= 0) {
    activeTags.value.splice(index, 1);
  } else {
    activeTags.value.push(tag);
  }
}

/** 一键清空全部筛选条件。 */
function resetFilters(): void {
  keyword.value = '';
  category.value = '';
  activeTags.value = [];
}

/** 把筛选状态写入地址栏，便于分享具体筛选结果。 */
function syncUrl(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const params = new URLSearchParams();
  if (keyword.value.trim()) {
    params.set('q', keyword.value.trim());
  }
  if (category.value) {
    params.set('category', category.value);
  }
  if (activeTags.value.length > 0) {
    params.set('tags', activeTags.value.join(','));
  }

  const search = params.toString();
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
}

/** 首次进入时读取地址栏筛选条件，保证分享链接可用。 */
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  keyword.value = params.get('q') || '';
  category.value = params.get('category') || '';
  activeTags.value = (params.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean);
});

watch([keyword, category, activeTags], syncUrl, { deep: true });

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
