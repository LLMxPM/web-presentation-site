<!-- 文件功能：渲染单个成果详情页，包括配置摘要、样式规范、截图轮播和下载入口。 -->
<template>
  <main class="site-page showcase-detail-page" :aria-label="showcase ? `${showcase.title} 详情` : '成果详情'">
    <a class="showcase-back-link" :href="siteUrl('/showcases.html')" aria-label="返回成果列表">
      <span aria-hidden="true">←</span>
      返回成果列表
    </a>

    <section v-if="showcase" class="showcase-detail-content">
      <section class="showcase-detail-hero" aria-label="成果概览">
        <div class="showcase-detail-copy">
          <p class="home-eyebrow">{{ showcase.category }}</p>
          <h1>{{ showcase.title }}</h1>
          <p class="showcase-detail-summary">{{ formatDetailSummary(showcase.summary) }}</p>
          <div v-if="visibleTags.length > 0" class="showcase-tags showcase-detail-tags" aria-label="成果标签">
            <span v-for="tag in visibleTags" :key="tag">{{ tag }}</span>
          </div>
          <div class="showcase-actions">
            <label
              v-if="showcase.styleSpecMarkdown"
              class="showcase-action"
              :for="styleSpecToggleId"
              role="button"
            >
              样式规范
            </label>
            <a
              v-if="showcase.previewUrl"
              class="showcase-action"
              :href="showcase.previewUrl"
              target="_blank"
              rel="noreferrer"
            >
              在线预览
            </a>
            <a
              class="showcase-action showcase-action-primary"
              :href="siteUrl(showcase.packagePath)"
              :download="showcase.packageFileName"
            >
              下载模板
            </a>
          </div>
        </div>

        <aside class="showcase-detail-cover-panel" aria-label="成果封面">
          <img :src="siteUrl(showcase.coverPath)" :alt="`${showcase.title} 封面`">
        </aside>
      </section>

      <section class="showcase-config-panel" aria-label="配置详情">
        <div class="showcase-section-heading">
          <p class="home-eyebrow">Profile</p>
        </div>
        <div class="showcase-config-tags">
          <span v-for="tag in configTags" :key="tag.label">
            <strong>{{ tag.label }}</strong>{{ tag.value }}
          </span>
        </div>
      </section>

      <div v-if="showcase.styleSpecMarkdown" class="showcase-style-modal">
        <input :id="styleSpecToggleId" type="checkbox" class="showcase-modal-toggle">
        <div
          class="showcase-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="styleSpecTitleId"
        >
          <label
            class="showcase-modal-backdrop"
            :for="styleSpecToggleId"
            aria-label="关闭样式规范"
          ></label>
          <section class="showcase-modal-panel">
            <div class="showcase-modal-header">
              <h2 :id="styleSpecTitleId">样式规范</h2>
              <div class="showcase-modal-actions">
                <button
                  type="button"
                  class="showcase-modal-copy"
                  aria-live="polite"
                  @click="copyStyleSpec"
                >
                  {{ styleSpecCopyText }}
                </button>
                <label class="showcase-modal-close" :for="styleSpecToggleId" role="button">关闭</label>
              </div>
            </div>
            <pre class="showcase-style-spec"><code>{{ showcase.styleSpecMarkdown }}</code></pre>
          </section>
        </div>
      </div>

      <section class="showcase-carousel" aria-label="页面截图轮播">
        <div class="showcase-carousel-heading">
          <div>
            <p class="home-eyebrow">Slides</p>
            <h2>页面截图</h2>
          </div>
          <div class="showcase-carousel-actions">
            <span>{{ showcase.slides.length }} 张</span>
            <button
              v-if="activeSlide"
              type="button"
              class="showcase-action"
              @click="openImageViewer"
            >
              放大查看
            </button>
          </div>
        </div>
        <div v-if="activeSlide" class="showcase-carousel-wrap" :style="slideRatioStyle(activeSlide)">
          <div class="showcase-carousel-main">
            <figure class="showcase-slide showcase-slide-active" :style="slideRatioStyle(activeSlide)">
              <img :src="siteUrl(activeSlide.imagePath)" :alt="activeSlide.title">
              <figcaption>{{ activeSlide.order }} / {{ showcase.slides.length }} · {{ activeSlide.title }}</figcaption>
            </figure>
          </div>
          <div class="showcase-carousel-thumbs" aria-label="截图选择">
            <button
              v-for="(slide, index) in showcase.slides"
              :key="slide.fileName"
              type="button"
              class="showcase-thumb"
              :class="{ 'showcase-thumb-active': index === activeSlideIndex }"
              :aria-label="`查看 ${slide.title}`"
              :style="slideRatioStyle(slide)"
              @click="selectSlide(index)"
            >
              <img :src="siteUrl(slide.imagePath)" alt="">
              <span>{{ slide.order }}. {{ slide.title }}</span>
            </button>
          </div>
        </div>
        <div v-else class="showcase-empty">
          <h3>没有页面截图</h3>
          <p>模板包中未找到可展示的页面截图。</p>
        </div>
      </section>

      <div
        v-if="isPresentationOpen && activeSlide"
        ref="presentationDialog"
        class="showcase-presentation"
        role="dialog"
        aria-modal="true"
        aria-label="放大查看"
        tabindex="-1"
        @keydown.esc="closeImageViewer"
        @keydown.left.prevent="showPreviousSlide"
        @keydown.right.prevent="showNextSlide"
      >
        <div class="showcase-presentation-header">
          <div>
            <strong>{{ activeSlide.order }} / {{ showcase.slides.length }}</strong>
            <span>{{ activeSlide.title }}</span>
          </div>
          <button type="button" class="showcase-presentation-button" @click="closeImageViewer">关闭</button>
        </div>
        <div class="showcase-presentation-stage">
          <img :src="siteUrl(activeSlide.imagePath)" :alt="activeSlide.title">
        </div>
        <div class="showcase-presentation-controls" aria-label="放映控制">
          <button type="button" class="showcase-presentation-button" @click="showPreviousSlide">上一页</button>
          <button type="button" class="showcase-presentation-button" @click="showNextSlide">下一页</button>
        </div>
      </div>
    </section>

    <section v-else class="showcase-empty">
      <h3>未找到成果详情</h3>
      <p>当前路由引用的成果 slug 为 <code>{{ slug }}</code>，但生成数据中没有对应项目。</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import { showcases } from '../../../.generated/showcases-data';
import type { ShowcaseDetail, ShowcaseSlide } from '../../../.generated/showcases-data';

const props = defineProps<{
  slug: string;
}>();

const activeSlideIndex = ref(0);
const isPresentationOpen = ref(false);
const presentationDialog = ref<HTMLElement | null>(null);
const styleSpecCopyState = ref<'idle' | 'copied' | 'failed'>('idle');
let styleSpecCopyTimer: ReturnType<typeof window.setTimeout> | undefined;

/** 根据路由占位页传入的 slug 查找成果详情数据。 */
const showcase = computed<ShowcaseDetail | undefined>(() => (
  showcases.find((item) => item.slug === props.slug)
));

/** 当前展示的截图，切换成果时会自动回到第一张。 */
const activeSlide = computed<ShowcaseSlide | undefined>(() => (
  showcase.value?.slides[activeSlideIndex.value]
));

/** 去掉与主题名相同的标签，避免详情顶部重复展示。 */
const visibleTags = computed(() => {
  if (!showcase.value) {
    return [];
  }

  const themeNames = new Set(showcase.value.themeNames);
  return showcase.value.tags.filter((tag) => !themeNames.has(tag));
});

/** 详情页顶部展示的关键配置标签。 */
const configTags = computed(() => {
  if (!showcase.value) {
    return [];
  }

  return [
    { label: '页数', value: showcase.value.pageCount ? `${showcase.value.pageCount} 页` : '未标注' },
    { label: '尺寸', value: formatSize(showcase.value) },
    { label: '基准字号', value: showcase.value.baseFontSize || '未标注' },
    { label: '主题', value: formatThemes(showcase.value) },
    { label: '更新时间', value: formatDate(showcase.value.updatedAt) },
  ];
});

const styleSpecTitleId = computed(() => `${props.slug}-style-spec-title`);
const styleSpecToggleId = computed(() => `${props.slug}-style-spec-toggle`);
const styleSpecCopyText = computed(() => {
  if (styleSpecCopyState.value === 'copied') {
    return '已复制';
  }

  if (styleSpecCopyState.value === 'failed') {
    return '复制失败';
  }

  return '复制文本';
});

watch(() => props.slug, () => {
  activeSlideIndex.value = 0;
  isPresentationOpen.value = false;
  resetStyleSpecCopyState();
});

onUnmounted(resetStyleSpecCopyState);

/** 切换当前截图；越界输入会被忽略，避免模板数据异常导致报错。 */
function selectSlide(index: number): void {
  if (!showcase.value || index < 0 || index >= showcase.value.slides.length) {
    return;
  }

  activeSlideIndex.value = index;
}

/** 打开沉浸式放大查看视图，用于查看当前截图细节。 */
async function openImageViewer(): Promise<void> {
  if (!activeSlide.value) {
    return;
  }

  isPresentationOpen.value = true;
  await nextTick();
  presentationDialog.value?.focus();
}

/** 关闭放大查看视图。 */
async function closeImageViewer(): Promise<void> {
  if (document.fullscreenElement === presentationDialog.value) {
    await document.exitFullscreen().catch(() => undefined);
  }

  isPresentationOpen.value = false;
}

/** 复制样式规范原文，优先使用 Clipboard API，失败时回退到临时文本域。 */
async function copyStyleSpec(): Promise<void> {
  const text = showcase.value?.styleSpecMarkdown;
  if (!text) {
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      copyTextWithTextarea(text);
    }

    setStyleSpecCopyState('copied');
  } catch {
    setStyleSpecCopyState('failed');
  }
}

/** 在旧浏览器中通过隐藏文本域完成复制，避免 Clipboard API 缺失时功能不可用。 */
function copyTextWithTextarea(text: string): void {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Copy command failed.');
  }
}

/** 更新复制按钮的短暂反馈状态。 */
function setStyleSpecCopyState(state: 'copied' | 'failed'): void {
  styleSpecCopyState.value = state;
  window.clearTimeout(styleSpecCopyTimer);
  styleSpecCopyTimer = window.setTimeout(resetStyleSpecCopyState, 1800);
}

/** 重置复制按钮文案，供路由切换和反馈超时复用。 */
function resetStyleSpecCopyState(): void {
  styleSpecCopyState.value = 'idle';
  window.clearTimeout(styleSpecCopyTimer);
  styleSpecCopyTimer = undefined;
}

/** 放映时切换到上一页，到第一张后循环到最后一张。 */
function showPreviousSlide(): void {
  if (!showcase.value || showcase.value.slides.length === 0) {
    return;
  }

  activeSlideIndex.value = (activeSlideIndex.value - 1 + showcase.value.slides.length) % showcase.value.slides.length;
}

/** 放映时切换到下一页，到最后一张后循环到第一张。 */
function showNextSlide(): void {
  if (!showcase.value || showcase.value.slides.length === 0) {
    return;
  }

  activeSlideIndex.value = (activeSlideIndex.value + 1) % showcase.value.slides.length;
}

/** 格式化成果简介，缺失时给出详情页可读的兜底文案。 */
function formatDetailSummary(value: string): string {
  return value || '该成果由 Web-Presentation 项目模板包生成，包含可复用页面、主题配置、截图资源和下载产物。';
}

/** 格式化项目页面尺寸和宽高比。 */
function formatSize(item: ShowcaseDetail): string {
  if (item.pageWidth && item.pageHeight) {
    const sizeText = `${item.pageWidth} x ${item.pageHeight}`;
    return item.aspectRatio ? `${sizeText} / ${item.aspectRatio}` : sizeText;
  }
  return '未标注';
}

/** 格式化主题名称列表。 */
function formatThemes(item: ShowcaseDetail): string {
  return item.themeNames.length > 0 ? item.themeNames.join('、') : '未标注';
}

/** 将 ISO 时间转换为适合配置面板展示的中文日期。 */
function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未标注';
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/** 生成截图宽高比 CSS 变量，优先使用截图尺寸，缺省时回退项目尺寸。 */
function slideRatioStyle(slide: ShowcaseSlide): Record<string, string> {
  const width = normalizePositiveNumber(slide.width) || normalizePositiveNumber(showcase.value?.pageWidth);
  const height = normalizePositiveNumber(slide.height) || normalizePositiveNumber(showcase.value?.pageHeight);

  if (!width || !height) {
    return {};
  }

  return {
    '--showcase-slide-ratio': `${formatCssNumber(width)} / ${formatCssNumber(height)}`,
  };
}

/** 将输入规范化为正数，用于宽高比计算。 */
function normalizePositiveNumber(value: number | null | undefined): number | null {
  return Number.isFinite(value) && Number(value) > 0 ? Number(value) : null;
}

/** 格式化 CSS 数值，避免生成无意义的小数尾巴。 */
function formatCssNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
