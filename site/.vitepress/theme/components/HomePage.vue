<!-- 文件功能：渲染 Web-Presentation 站点首页，依次呈现产品定位、演示视频、真实案例、核心能力、架构与上手入口。 -->
<template>
  <main class="site-page home-page" aria-label="Web-Presentation 首页">
    <section class="home-hero" aria-label="平台宣传">
      <img class="home-hero-bg" :src="siteUrl('/assets/image.png')" alt="">
      <div class="home-hero-copy">
        <p class="home-eyebrow">Web-Presentation</p>
        <h1>可复用资产、精细调整的 AI 演示文稿平台</h1>
        <p class="home-hero-tagline">
          把资源、组件、主题沉淀成资产，让 AI 稳定产出 PPT 与图文页面
        </p>
        <div class="home-hero-actions" aria-label="首页操作">
          <a class="home-hero-action home-hero-action-primary" :href="siteUrl('/docs/user/demo-guide.html')">在线 Demo</a>
          <a class="home-hero-action" :href="siteUrl('/showcases.html')">查看案例</a>
          <a class="home-hero-action" :href="githubUrl" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div class="home-hero-badges" aria-label="平台亮点">
          <span>私有化部署</span>
          <span>CLI 支持</span>
          <span>可编辑 PPTX</span>
        </div>
      </div>
    </section>

    <section class="home-section home-demo-section" aria-labelledby="home-demo-title">
      <div class="home-section-heading">
        <p class="home-eyebrow">Platform Demo</p>
        <h2 id="home-demo-title">一段话，5 页可编辑 PPT</h2>
        <p>真实录屏 · 单份成本不到 1 元</p>
      </div>
      <div class="home-demo-player">
        <video
          controls
          playsinline
          preload="metadata"
          :poster="siteUrl('/assets/平台演示-封面.jpg')"
        >
          <source :src="siteUrl('/assets/平台演示.mp4')" type="video/mp4">
          您的浏览器暂不支持视频播放，请
          <a :href="siteUrl('/assets/平台演示.mp4')">下载平台演示视频</a>后观看。
        </video>
      </div>
    </section>

    <section class="home-section home-showcase-section" aria-label="精选案例">
      <div class="home-section-heading home-section-heading-inline">
        <div>
          <p class="home-eyebrow">Showcases</p>
          <h2>平台真实案例</h2>
          <p>全部由平台生成，可直接在线预览</p>
        </div>
        <a class="home-section-link" :href="siteUrl('/showcases.html')">查看全部案例</a>
      </div>
      <div v-if="featuredShowcases.length > 0" class="home-showcase-grid">
        <ShowcaseCard v-for="showcase in featuredShowcases" :key="showcase.slug" :showcase="showcase" />
      </div>
      <div v-else class="showcase-empty">
        <h3>还没有可展示的案例</h3>
        <p>运行 <code>pnpm run manage:showcases</code> 打开本地管理页，导入模板包后即可生成案例卡片。</p>
      </div>
    </section>

    <section class="home-section" aria-label="核心能力">
      <div class="home-section-heading">
        <p class="home-eyebrow">Core capabilities</p>
        <h2>不是生成一份 PPT，而是沉淀一套创作系统</h2>
        <div class="home-scenario-chips" aria-label="适用场景">
          <span class="home-scenario-label">适用场景</span>
          <span v-for="scenario in scenarioLabels" :key="scenario">{{ scenario }}</span>
        </div>
      </div>
      <div class="home-capability-grid">
        <article v-for="capability in capabilities" :key="capability.title" class="home-capability">
          <span>{{ capability.label }}</span>
          <h3>{{ capability.title }}</h3>
          <p>{{ capability.summary }}</p>
          <ul>
            <li v-for="item in capability.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="home-section" aria-labelledby="home-arch-title">
      <div class="home-section-heading">
        <p class="home-eyebrow">Architecture</p>
        <h2 id="home-arch-title">Editor、Backend、Runtime、Renderer 四层协作</h2>
        <p>创作入口走 Backend，预览走 Runtime，截图与诊断走 Renderer</p>
      </div>
      <figure class="home-arch-figure">
        <button
          type="button"
          class="home-arch-frame"
          aria-label="放大查看平台架构图"
          @click="openArchPreview"
        >
          <img
            :src="archImage"
            alt="web-presentation 平台架构图：Editor、wp CLI 与 Backend、Runtime、Renderer 的协作关系"
            width="1600"
            height="900"
            loading="lazy"
          >
        </button>
        <figcaption>
          点击看大图 ·
          <a :href="siteUrl('/docs/developer/architecture/overview.html')">架构文档</a>
        </figcaption>
      </figure>
    </section>

    <section class="home-section" aria-label="创作链路">
      <div class="home-section-heading">
        <p class="home-eyebrow">Workflow</p>
        <h2>从资产到模板，四步闭环</h2>
      </div>
      <div class="home-flow-grid">
        <article v-for="step in flowSteps" :key="step.index" class="home-flow-step">
          <span>{{ step.index }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.summary }}</p>
        </article>
      </div>
    </section>

    <section class="home-developer-section" aria-labelledby="home-start-title">
      <div class="home-developer-head">
        <div class="home-developer-copy">
          <p class="home-eyebrow">Get started</p>
          <h2 id="home-start-title">一条命令私有化部署</h2>
          <p>单容器起服务，首次启动自动生成管理员密码</p>
        </div>
        <div class="home-runtime-strip" aria-label="部署与接入方式">
          <span v-for="item in startChips" :key="item">{{ item }}</span>
        </div>
      </div>

      <div class="home-deploy-box">
        <pre class="home-deploy-code"><code>{{ deployCommand }}</code></pre>
        <button type="button" class="home-deploy-copy" aria-live="polite" @click="copyDeployCommand">
          {{ deployCopyText }}
        </button>
      </div>

      <div class="home-developer-links">
        <a
          v-for="link in resourceLinks"
          :key="link.title"
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noreferrer' : undefined"
        >
          <span class="home-developer-link-copy">
            <strong>{{ link.title }}</strong>
            <span>{{ link.summary }}</span>
          </span>
          <span class="home-developer-link-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <ClientOnly>
      <Teleport to="body">
        <div v-if="isArchPreviewOpen" class="home-arch-modal" role="dialog" aria-modal="true" aria-label="平台架构图大图">
          <div class="home-arch-modal-backdrop" role="presentation" @click="closeArchPreview"></div>
          <img :src="archImage" alt="web-presentation 平台架构图">
          <button type="button" class="home-arch-modal-close" @click="closeArchPreview">关闭</button>
        </div>
      </Teleport>
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { withBase } from 'vitepress';
import { showcaseSummaries, sourceMeta } from '../../../.generated/showcase-summaries';
import ShowcaseCard from './ShowcaseCard.vue';

const showcasedCount = 3;
const githubUrl = `https://github.com/${sourceMeta.sourceRepo}`;
const archImage = withBase('/assets/platform-architecture.svg');

/** 私有化部署命令：与源仓 README 的 SQLite Lite 单容器说明保持一致。 */
const deployCommand = [
  'docker run -d \\',
  '  --name web-presentation \\',
  '  --restart unless-stopped \\',
  '  -p 8080:80 \\',
  '  -v web-presentation-lite-data:/app/backend/data \\',
  '  llmxpm/web-presentation:sqlite-lite',
].join('\n');

const scenarioLabels = ['PPT 创作', '专题报告', '图文卡片', '团队资产管理'];

const capabilities = [
  {
    label: 'AI',
    title: 'AI 原生创作',
    summary: '上下文里写作，自动检查版式',
    items: ['组件、页面批量生成', '布局自检：超高 / 换行 / 堆叠', '可视化微调：文本 / 参数 / 样式'],
  },
  {
    label: 'Assets',
    title: '资产复用',
    summary: '资源、组件、主题统一沉淀',
    items: ['资源库与组件库', '主题、字体、样式库', '模板包导入与复用'],
  },
  {
    label: 'Runtime',
    title: '预览与诊断',
    summary: 'Runtime 实时预览，Renderer 查布局',
    items: ['独立域 iframe 预览', '组件预览与截图预览', 'Playwright 截图诊断'],
  },
  {
    label: 'Delivery',
    title: '可编辑交付',
    summary: '导出可编辑 PPTX、PDF 与静态包',
    items: ['可编辑 PPTX / PDF', '构建产物 zip 下载', '旁白与 cue 音频'],
  },
];

const flowSteps = [
  { index: '01', title: '组织资产', summary: '资源、组件、主题、字体先入库' },
  { index: '02', title: 'AI 协作生成', summary: '上下文注入，按页生成与改写' },
  { index: '03', title: '预览与诊断', summary: 'Runtime 预览，Renderer 诊断' },
  { index: '04', title: '交付与复用', summary: '导出 PPTX 或静态包，沉淀模板' },
];

const startChips = ['SQLite Lite 单容器', '分服务部署', 'wp CLI / MCP 接入'];

const resourceLinks = [
  { title: '用户文档', summary: '平台概念、常用工作流与交付方式', href: withBase('/docs/user/'), external: false },
  { title: '部署指南', summary: 'SQLite Lite 单容器与分服务部署', href: withBase('/docs/deployment/lite/'), external: false },
  { title: 'GitHub', summary: '源码、License 与更新记录', href: githubUrl, external: true },
];

const isArchPreviewOpen = ref(false);
const deployCopyState = ref<'idle' | 'copied' | 'failed'>('idle');
let deployCopyTimer: ReturnType<typeof window.setTimeout> | undefined;

/** 部署命令复制按钮的文案状态。 */
const deployCopyText = computed(() => {
  if (deployCopyState.value === 'copied') {
    return '已复制';
  }
  if (deployCopyState.value === 'failed') {
    return '复制失败';
  }
  return '复制命令';
});

/** 首页精选案例优先取 featured，缺省时按生成脚本排序取前三个。 */
const featuredShowcases = computed(() => {
  const featured = showcaseSummaries.filter((showcase) => showcase.featured);
  return (featured.length > 0 ? featured : showcaseSummaries).slice(0, showcasedCount);
});

/** 打开架构图大图，避免首页缩放后看不清细节文字。 */
function openArchPreview(): void {
  isArchPreviewOpen.value = true;
  document.body.style.overflow = 'hidden';
}

/** 关闭架构图大图并恢复页面滚动。 */
function closeArchPreview(): void {
  isArchPreviewOpen.value = false;
  document.body.style.overflow = '';
}

/** 复制部署命令，优先使用 Clipboard API，失败时回退到临时文本域。 */
async function copyDeployCommand(): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(deployCommand);
    } else {
      copyTextWithTextarea(deployCommand);
    }
    setDeployCopyState('copied');
  } catch {
    setDeployCopyState('failed');
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
function setDeployCopyState(state: 'copied' | 'failed'): void {
  deployCopyState.value = state;
  window.clearTimeout(deployCopyTimer);
  deployCopyTimer = window.setTimeout(() => {
    deployCopyState.value = 'idle';
    deployCopyTimer = undefined;
  }, 1800);
}

/** 大图打开时支持 Esc 关闭。 */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isArchPreviewOpen.value) {
    closeArchPreview();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.clearTimeout(deployCopyTimer);
  deployCopyTimer = undefined;
  document.body.style.overflow = '';
});

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
