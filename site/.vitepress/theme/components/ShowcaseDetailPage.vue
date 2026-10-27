<!-- 文件功能：渲染单个案例详情页，包括封面、项目资料、实时预览以及下载、导出引导入口。 -->
<template>
  <main class="site-page showcase-detail-page" :aria-label="showcase ? `${showcase.title} 详情` : '案例详情'">
    <a class="showcase-back-link" :href="siteUrl('/showcases.html')" aria-label="返回案例列表">
      <span aria-hidden="true">←</span>
      返回案例列表
    </a>

    <section v-if="showcase" class="showcase-detail-content">
      <section class="showcase-detail-hero" aria-label="案例概览">
        <div class="showcase-detail-copy">
          <h1>{{ showcase.title }}</h1>
          <p class="showcase-detail-summary">{{ formatDetailSummary(showcase.summary) }}</p>
          <div class="showcase-actions">
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
            <button
              v-if="showcase.previewAvailable"
              type="button"
              class="showcase-action"
              @click="openExportGuide"
            >
              导出 PPTX
            </button>
            <button
              v-if="showcase.styleSpecMarkdown"
              type="button"
              class="showcase-action"
              @click="openStyleSpec"
            >
              样式规范
            </button>
          </div>
        </div>

        <aside class="showcase-detail-cover-panel" aria-label="案例封面">
          <img v-if="showcase.coverAvailable" :src="siteUrl(showcase.coverPath)" :alt="`${showcase.title} 封面`">
          <div v-else class="showcase-cover-empty">暂无主图</div>
        </aside>
      </section>

      <section class="showcase-config-panel" aria-label="项目资料">
        <div class="showcase-section-heading">
          <p class="home-eyebrow">Profile</p>
          <h2>项目资料</h2>
        </div>
        <dl class="showcase-profile">
          <div class="showcase-profile-item">
            <dt>分类</dt>
            <dd>
              <a v-if="showcase.category" class="showcase-profile-chip" :href="categoryFilterUrl(showcase.category)">
                {{ showcase.category }}
              </a>
              <span v-else class="showcase-profile-muted">未分类</span>
            </dd>
          </div>
          <div class="showcase-profile-item">
            <dt>标签</dt>
            <dd>
              <a
                v-for="tag in showcase.tags"
                :key="tag"
                class="showcase-profile-chip"
                :href="tagFilterUrl(tag)"
              >
                {{ tag }}
              </a>
              <span v-if="showcase.tags.length === 0" class="showcase-profile-muted">未标注</span>
            </dd>
          </div>
          <div v-for="item in configItems" :key="item.label" class="showcase-profile-item">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="showcase.previewAvailable" id="showcase-preview" ref="previewSection" class="showcase-preview" aria-label="项目预览">
        <div class="showcase-preview-heading">
          <div>
            <p class="home-eyebrow">Live preview</p>
            <h2>项目预览</h2>
          </div>
          <div class="showcase-preview-actions">
            <button type="button" class="showcase-action" @click="reloadPreview">刷新</button>
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
        <div
          ref="previewStage"
          class="showcase-preview-stage"
          :class="{ 'is-highlight': previewHighlighted }"
          :style="previewStageStyle"
        >
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
      </section>

      <div
        v-if="isExportGuideOpen && showcase.previewAvailable"
        class="showcase-modal showcase-export-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="showcase-export-title"
      >
        <div class="showcase-modal-backdrop" role="presentation" @click="closeExportGuide"></div>
        <section class="showcase-modal-panel showcase-export-panel">
          <div class="showcase-modal-header">
            <div>
              <p class="home-eyebrow">Export</p>
              <h2 id="showcase-export-title">导出 PPTX</h2>
            </div>
            <div class="showcase-modal-actions">
              <button type="button" class="showcase-modal-close" @click="closeExportGuide">关闭</button>
            </div>
          </div>
          <div class="showcase-export-body">
            <div class="showcase-export-copy">
              <p class="showcase-export-lead">
                PPTX 由预览页的运行时现场导出，本站只负责展示。按下面三步就能拿到可编辑的 PPTX 文件。
              </p>
              <ol class="showcase-export-steps">
                <li>
                  <span class="showcase-export-step-index">1</span>
                  <div>
                    <strong>打开在线预览</strong>
                    <p>点下方按钮，在新窗口打开这个案例的运行页面。</p>
                  </div>
                </li>
                <li>
                  <span class="showcase-export-step-index">2</span>
                  <div>
                    <strong>点右上角「导出」</strong>
                    <p>预览页右上角竖排工具条里，带下箭头的文件图标就是导出。</p>
                  </div>
                </li>
                <li>
                  <span class="showcase-export-step-index">3</span>
                  <div>
                    <strong>格式选「HTML转PPTX」</strong>
                    <p>范围选「所有页面」，点「开始导出」即可下载可编辑 PPTX。</p>
                  </div>
                </li>
              </ol>
              <div class="showcase-export-actions">
                <a
                  class="showcase-action showcase-action-primary"
                  :href="siteUrl(showcase.previewPath)"
                  target="_blank"
                  rel="noreferrer"
                  @click="closeExportGuide"
                >
                  打开预览页导出
                </a>
                <button type="button" class="showcase-action" @click="scrollToPreview">在下方预览里操作</button>
              </div>
            </div>
            <figure class="showcase-export-figure">
              <img
                :src="siteUrl('/assets/export-guide.png')"
                alt="预览页右上角工具栏示意，第三个「导出」按钮已用箭头标出"
                loading="lazy"
              >
              <figcaption>预览页右上角：带下箭头的文件图标就是「导出」</figcaption>
            </figure>
          </div>
        </section>
      </div>

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
const isExportGuideOpen = ref(false);
const styleSpecCopyState = ref<'idle' | 'copied' | 'failed'>('idle');
const previewStage = ref<HTMLElement | null>(null);
const previewSection = ref<HTMLElement | null>(null);
const previewFrame = ref<HTMLIFrameElement | null>(null);
const previewScale = ref(1);
const previewReady = ref(false);
const previewHighlighted = ref(false);
let styleSpecCopyTimer: ReturnType<typeof window.setTimeout> | undefined;
let previewHighlightTimer: ReturnType<typeof window.setTimeout> | undefined;
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

/** 项目资料里的版式指标；分类与标签在模板中单独渲染为可筛选的胶囊。 */
const configItems = computed(() => {
  if (!showcase.value) {
    return [];
  }

  return [
    { label: '页数', value: showcase.value.pageCount ? `${showcase.value.pageCount} 页` : '未标注' },
    { label: '画幅', value: formatSize(showcase.value) },
    { label: '基准字号', value: showcase.value.baseFontSize || '未标注' },
    { label: '主题', value: formatThemes(showcase.value) },
  ];
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
  isExportGuideOpen.value = false;
  clearPreviewHighlight();
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
  clearPreviewHighlight();
  previewObserver?.disconnect();
  previewObserver = undefined;
  window.removeEventListener('resize', observePreviewStage);
  window.removeEventListener('keydown', handleWindowKeydown);
});

/** 弹窗打开时按 Esc 关闭，保持与常规对话框一致的键盘习惯。 */
function handleWindowKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') {
    return;
  }
  if (isExportGuideOpen.value) {
    closeExportGuide();
    return;
  }
  if (isStyleSpecOpen.value) {
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

/** 打开导出引导弹窗，说明 PPTX 需要在预览页里导出。 */
function openExportGuide(): void {
  isExportGuideOpen.value = true;
}

/** 关闭导出引导弹窗。 */
function closeExportGuide(): void {
  isExportGuideOpen.value = false;
}

/** 关闭弹窗并滚动到实时预览，同时短暂高亮预览区域作为指引。 */
async function scrollToPreview(): Promise<void> {
  closeExportGuide();
  await nextTick();

  const section = previewSection.value;
  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  previewHighlighted.value = true;
  window.clearTimeout(previewHighlightTimer);
  previewHighlightTimer = window.setTimeout(clearPreviewHighlight, 2000);
}

/** 取消预览高亮态。 */
function clearPreviewHighlight(): void {
  previewHighlighted.value = false;
  window.clearTimeout(previewHighlightTimer);
  previewHighlightTimer = undefined;
}

/** 重新加载 iframe，便于查看最新构建产物。 */
function reloadPreview(): void {
  if (!previewFrame.value) {
    return;
  }
  previewFrame.value.src = previewFrame.value.src;
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
    const sizeText = `${item.pageWidth} × ${item.pageHeight}`;
    return item.aspectRatio ? `${sizeText} / ${item.aspectRatio}` : sizeText;
  }
  return '未标注';
}

/** 格式化主题名称列表。 */
function formatThemes(item: ShowcaseDetail): string {
  return item.themeNames.length > 0 ? item.themeNames.join('、') : '未标注';
}

/** 生成分类筛选链接，便于从详情页回到同类案例。 */
function categoryFilterUrl(category: string): string {
  return withBase(`/showcases.html?category=${encodeURIComponent(category)}`);
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
