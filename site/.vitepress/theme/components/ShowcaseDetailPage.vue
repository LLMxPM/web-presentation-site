<!-- 文件功能：渲染单个案例详情页，包括封面、项目资料、实时预览与下载入口。 -->
<template>
  <main class="site-page showcase-detail-page" :aria-label="showcase ? `${showcase.title} 详情` : '案例详情'">
    <a class="showcase-back-link" :href="siteUrl('/showcases.html')" aria-label="返回案例列表">
      <span aria-hidden="true">←</span>
      返回案例列表
    </a>

    <section v-if="showcase" class="showcase-detail-content">
      <section class="showcase-detail-hero" aria-label="案例概览">
        <div class="showcase-detail-copy">
          <p class="home-eyebrow">{{ showcase.category }}</p>
          <h1>{{ showcase.title }}</h1>
          <p class="showcase-detail-summary">{{ formatDetailSummary(showcase.summary) }}</p>
          <div v-if="showcase.tags.length > 0" class="showcase-tags showcase-detail-tags" aria-label="案例标签">
            <a
              v-for="tag in showcase.tags"
              :key="tag"
              :href="tagFilterUrl(tag)"
              class="showcase-tag-link"
            >
              {{ tag }}
            </a>
          </div>
          <div class="showcase-actions">
            <button
              v-if="showcase.styleSpecMarkdown"
              type="button"
              class="showcase-action"
              @click="openStyleSpec"
            >
              样式规范
            </button>
            <a
              v-if="showcase.previewAvailable"
              class="showcase-action showcase-action-primary"
              :href="siteUrl(showcase.previewPath)"
              target="_blank"
              rel="noreferrer"
            >
              在线预览
            </a>
            <a
              v-if="showcase.packageAvailable"
              class="showcase-action"
              :class="{ 'showcase-action-primary': !showcase.previewAvailable }"
              :href="siteUrl(showcase.packagePath)"
              :download="showcase.packageFileName"
            >
              下载模板
            </a>
          </div>
        </div>

        <aside class="showcase-detail-cover-panel" aria-label="案例封面">
          <img v-if="showcase.coverAvailable" :src="siteUrl(showcase.coverPath)" :alt="`${showcase.title} 封面`">
          <div v-else class="showcase-cover-empty">暂无主图</div>
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

      <section v-if="showcase.previewAvailable" class="showcase-preview" aria-label="实时预览">
        <div class="showcase-preview-heading">
          <div>
            <p class="home-eyebrow">Live preview</p>
            <h2>真实构建产物</h2>
          </div>
          <div class="showcase-preview-actions">
            <button type="button" class="showcase-action" @click="reloadPreview">刷新</button>
            <button type="button" class="showcase-action" @click="toggleFullscreen">全屏</button>
            <a
              class="showcase-action"
              :href="siteUrl(showcase.previewPath)"
              target="_blank"
              rel="noreferrer"
            >
              新窗口打开
            </a>
          </div>
        </div>
        <div ref="previewStage" class="showcase-preview-stage" :style="previewStageStyle">
          <iframe
            ref="previewFrame"
            class="showcase-preview-frame"
            :src="siteUrl(showcase.previewPath)"
            :title="`${showcase.title} 在线预览`"
            loading="lazy"
            :class="{ 'is-ready': previewReady }"
            :style="previewFrameStyle"
          ></iframe>
        </div>
        <p class="showcase-preview-hint">
          预览按 {{ showcase.pageWidth || 1920 }} × {{ showcase.pageHeight || 1080 }} 原尺寸渲染后等比缩放，交互与线上运行一致。
        </p>
      </section>

      <div v-if="isStyleSpecOpen && showcase.styleSpecMarkdown" class="showcase-modal" role="dialog" aria-modal="true">
        <div class="showcase-modal-backdrop" role="presentation" @click="closeStyleSpec"></div>
        <section class="showcase-modal-panel">
          <div class="showcase-modal-header">
            <h2>样式规范</h2>
            <div class="showcase-modal-actions">
              <button type="button" class="showcase-modal-copy" aria-live="polite" @click="copyStyleSpec">
                {{ styleSpecCopyText }}
              </button>
              <button type="button" class="showcase-modal-close" @click="closeStyleSpec">关闭</button>
            </div>
          </div>
          <pre class="showcase-style-spec"><code>{{ showcase.styleSpecMarkdown }}</code></pre>
        </section>
      </div>
    </section>

    <section v-else class="showcase-empty">
      <h3>未找到案例详情</h3>
      <p>当前路由引用的案例 slug 为 <code>{{ slug }}</code>，但生成数据中没有对应项目。</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import { showcases } from '../../../.generated/showcases-data';
import type { ShowcaseDetail } from '../../../.generated/showcases-data';

const props = defineProps<{
  slug: string;
}>();

const isStyleSpecOpen = ref(false);
const styleSpecCopyState = ref<'idle' | 'copied' | 'failed'>('idle');
const previewStage = ref<HTMLElement | null>(null);
const previewFrame = ref<HTMLIFrameElement | null>(null);
const previewScale = ref(1);
const previewReady = ref(false);
let styleSpecCopyTimer: ReturnType<typeof window.setTimeout> | undefined;
let previewObserver: ResizeObserver | undefined;

/** 根据路由占位页传入的 slug 查找案例详情数据。 */
const showcase = computed<ShowcaseDetail | undefined>(() => (
  showcases.find((item) => item.slug === props.slug)
));

/** 预览舞台按项目画幅锁定比例，避免高度随视口跳动。 */
const previewStageStyle = computed<Record<string, string>>(() => {
  const width = normalizePositiveNumber(showcase.value?.pageWidth) || 1920;
  const height = normalizePositiveNumber(showcase.value?.pageHeight) || 1080;
  return {
    '--showcase-preview-ratio': `${width} / ${height}`,
    '--showcase-preview-width': `${width}px`,
  };
});

/** iframe 保持原始像素尺寸，通过 transform 等比缩小，保证排版与线上一致。 */
const previewFrameStyle = computed<Record<string, string>>(() => {
  const width = normalizePositiveNumber(showcase.value?.pageWidth) || 1920;
  const height = normalizePositiveNumber(showcase.value?.pageHeight) || 1080;
  return {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${previewScale.value})`,
  };
});

/** 详情页顶部展示的关键配置标签。 */
const configTags = computed(() => {
  if (!showcase.value) {
    return [];
  }

  const items = [
    { label: '页数', value: showcase.value.pageCount ? `${showcase.value.pageCount} 页` : '未标注' },
    { label: '画幅', value: formatSize(showcase.value) },
    { label: '基准字号', value: showcase.value.baseFontSize || '未标注' },
    { label: '主题', value: formatThemes(showcase.value) },
    { label: '更新时间', value: formatDate(showcase.value.updatedAt) },
  ];

  if (showcase.value.hasComponents) {
    items.push({ label: '组件', value: '含自定义组件' });
  }
  if (showcase.value.backgroundTone) {
    items.push({ label: '底色', value: showcase.value.backgroundTone === 'light' ? '浅色为主' : '深色为主' });
  }

  return items;
});

const styleSpecCopyText = computed(() => {
  if (styleSpecCopyState.value === 'copied') {
    return '已复制';
  }
  if (styleSpecCopyState.value === 'failed') {
    return '复制失败';
  }
  return '复制';
});

watch(() => props.slug, async () => {
  resetStyleSpecCopyState();
  isStyleSpecOpen.value = false;
  await nextTick();
  observePreviewStage();
});

onMounted(() => {
  observePreviewStage();
  window.addEventListener('resize', observePreviewStage);
  window.addEventListener('keydown', handleWindowKeydown);
});

onUnmounted(() => {
  resetStyleSpecCopyState();
  previewObserver?.disconnect();
  previewObserver = undefined;
  window.removeEventListener('resize', observePreviewStage);
  window.removeEventListener('keydown', handleWindowKeydown);
});

/** 弹窗打开时按 Esc 关闭，保持与常规对话框一致的键盘习惯。 */
function handleWindowKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isStyleSpecOpen.value) {
    closeStyleSpec();
  }
}

/** 监听预览舞台尺寸，换算等比缩放系数。 */
function observePreviewStage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  previewObserver?.disconnect();
  const stage = previewStage.value;
  if (!stage) {
    previewScale.value = 1;
    return;
  }

  const pageWidth = normalizePositiveNumber(showcase.value?.pageWidth) || 1920;
  const update = (): void => {
    previewScale.value = Math.min(1, stage.clientWidth / pageWidth);
  };

  update();
  previewReady.value = true;
  previewObserver = new ResizeObserver(update);
  previewObserver.observe(stage);
}

/** 打开样式规范弹窗。 */
async function openStyleSpec(): Promise<void> {
  isStyleSpecOpen.value = true;
  await nextTick();
}

/** 关闭样式规范弹窗。 */
function closeStyleSpec(): void {
  isStyleSpecOpen.value = false;
}

/** 重新加载 iframe，便于查看最新构建产物。 */
function reloadPreview(): void {
  if (!previewFrame.value) {
    return;
  }
  previewFrame.value.src = previewFrame.value.src;
}

/** 在浏览器全屏模式下查看预览。 */
async function toggleFullscreen(): Promise<void> {
  const stage = previewStage.value;
  if (!stage) {
    return;
  }

  if (document.fullscreenElement === stage) {
    await document.exitFullscreen().catch(() => undefined);
    return;
  }
  await stage.requestFullscreen?.().catch(() => undefined);
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

/** 在旧浏览器中通过隐藏文本域完成复制。 */
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

/** 重置复制按钮文案。 */
function resetStyleSpecCopyState(): void {
  styleSpecCopyState.value = 'idle';
  window.clearTimeout(styleSpecCopyTimer);
  styleSpecCopyTimer = undefined;
}

/** 格式化案例简介，缺失时给出可读兜底文案。 */
function formatDetailSummary(value: string): string {
  return value || '该案例由 Web-Presentation 项目生成，包含完整项目配置、可复用模板包与构建产物。';
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

/** 将 ISO 时间转换为中文日期。 */
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

/** 生成带标签筛选参数的列表链接，便于从详情页回到同标签列表。 */
function tagFilterUrl(tag: string): string {
  return withBase(`/showcases.html?tags=${encodeURIComponent(tag)}`);
}

/** 将输入规范化为正数。 */
function normalizePositiveNumber(value: number | null | undefined): number | null {
  return Number.isFinite(value) && Number(value) > 0 ? Number(value) : null;
}

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
