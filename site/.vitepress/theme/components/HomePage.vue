<!-- 文件功能：渲染 Web-Presentation 站点首页的产品介绍和精选案例。 -->
<template>
  <main class="site-page home-page" aria-label="Web-Presentation 首页">
    <section class="home-hero" aria-label="平台宣传">
      <img class="home-hero-bg" :src="siteUrl('/assets/image.png')" alt="">
      <div class="home-hero-copy">
        <p class="home-eyebrow">Web-Presentation</p>
        <h1>可复用资产、精细调整的AI演示文稿平台</h1>
        <p class="home-hero-tagline">
          面向 PPT、图文卡片、专题报告页和数据解读页的 AI 演示文稿创作平台。把页面、组件、资源、主题和样式沉淀为可复用资产，用更稳定的方式持续产出演示内容。
        </p>
        <div class="home-hero-actions" aria-label="首页操作">
          <a class="home-hero-action home-hero-action-primary" :href="siteUrl('/docs/user/demo-guide.html')">在线 Demo</a>
          <a class="home-hero-action" :href="siteUrl('/showcases.html')">查看案例</a>
          <a class="home-hero-action" :href="githubUrl" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div class="home-hero-badges" aria-label="平台亮点">
          <span>私有化部署</span>
          <span>多模型支持</span>
          <span>可编辑PPTX</span>
        </div>
      </div>
    </section>

    <section class="home-section" aria-label="核心卖点">
      <div class="home-section-heading">
        <p class="home-eyebrow">Why Web-Presentation</p>
        <h2>不是一次性生成一份 PPT，而是沉淀一套可复用的创作系统</h2>
        <p>围绕长期项目和团队资产管理设计，让 AI 参与内容生成、版式调整、资源引用和多页一致性维护。</p>
      </div>
      <div class="home-value-grid">
        <article v-for="prop in valueProps" :key="prop.title" class="home-value-card">
          <span>{{ prop.label }}</span>
          <h3>{{ prop.title }}</h3>
          <p>{{ prop.summary }}</p>
        </article>
      </div>
    </section>

    <section class="home-section" aria-label="适用场景">
      <div class="home-section-heading">
        <p class="home-eyebrow">Use cases</p>
        <h2>适合需要长期生产和维护演示资产的团队</h2>
      </div>
      <div class="home-scenario-grid">
        <article v-for="scenario in scenarios" :key="scenario.title" class="home-scenario">
          <h3>{{ scenario.title }}</h3>
          <p>{{ scenario.summary }}</p>
        </article>
      </div>
    </section>

    <section class="home-product-band" aria-label="平台能力总览">
      <div class="home-product-copy">
        <p class="home-eyebrow">Capability Map</p>
        <h2>围绕 AI 创作、资产复用和 Runtime 验证形成完整工作台</h2>
        <p>平台把演示内容拆成可管理对象：Editor 负责创作体验，Backend 负责权限和 AI 上下文，Runtime 负责页面渲染、资源渲染、预览验证和 PPTX 导出，基础设施负责私有化运行。</p>
        <div class="home-runtime-strip" aria-label="Runtime 重点能力">
          <span v-for="item in runtimeHighlights" :key="item">{{ item }}</span>
        </div>
      </div>
      <img :src="siteUrl('/assets/platform-architecture.png')" alt="Web-Presentation 平台架构图">
    </section>

    <section class="home-section" aria-label="平台能力">
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

    <section class="home-section home-showcase-section" aria-label="精选案例">
      <div class="home-section-heading home-section-heading-inline">
        <div>
          <p class="home-eyebrow">Showcases</p>
          <h2>平台真实案例</h2>
        </div>
        <a class="home-section-link" :href="siteUrl('/showcases.html')">查看全部案例</a>
      </div>
      <div v-if="featuredShowcases.length > 0" class="home-showcase-grid">
        <ShowcaseCard v-for="showcase in featuredShowcases" :key="showcase.slug" :showcase="showcase" />
      </div>
      <div v-else class="showcase-empty">
        <h3>还没有可展示的项目模板包</h3>
        <p>将 <code>.wptemplate.zip</code> 放入 <code>site/showcases/</code> 后，同步脚本会自动生成案例卡片、封面和下载链接。</p>
      </div>
    </section>

    <section class="home-section" aria-label="创作链路">
      <div class="home-section-heading">
        <p class="home-eyebrow">Workflow</p>
        <h2>从资产准备到项目模板复用，形成一条闭环创作链路</h2>
      </div>
      <div class="home-flow-grid">
        <article v-for="step in flowSteps" :key="step.index" class="home-flow-step">
          <span>{{ step.index }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.summary }}</p>
        </article>
      </div>
    </section>


  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { showcaseSummaries, sourceMeta } from '../../../.generated/showcase-summaries';
import ShowcaseCard from './ShowcaseCard.vue';

const showcasedCount = 3;
const githubUrl = `https://github.com/${sourceMeta.sourceRepo}`;

const valueProps = [
  { label: 'Style', title: '自定义风格', summary: '围绕 Logo、字体、配色、页面比例和样式规范建立团队自己的演示视觉。' },
  { label: 'Stable', title: '风格稳定', summary: '通过组件、主题和样式约束复用常见版式，减少每次从零调视觉的成本。' },
  { label: 'Model', title: '低模型要求', summary: 'Deepseek-V4-pro级别的模型即实现非常好的创作效果。' },
  { label: 'Cost', title: '低成本试错', summary: '用预览和截图快速验证效果，把精力放在内容结构、视觉表达和关键页打磨上。' },
  { label: 'Assets', title: '资产复用', summary: '组件、资源、主题、样式和字体沉淀到工作空间，跨项目复用同一套演示资产。' },
  { label: 'Preview', title: '快速预览', summary: 'Runtime 承接页面预览、组件预览和截图预览，让创作反馈更短、更可控。' },
];

const scenarios = [
  { title: 'PPT 创作', summary: '用于产品介绍、技术分享、项目汇报和演讲页面，让 AI 参与结构生成和版式调整。' },
  { title: '专题报告', summary: '把数据解读、行业分析、研究材料和结论组织成可演示、可维护的页面集合。' },
  { title: '图文卡片', summary: '复用品牌主题、封面图、长图片段和说明组件，稳定生产多尺寸图文内容。' },
  { title: '团队资产管理', summary: '把常用组件、资源、主题和样式统一维护，减少跨项目复制和重复设计。' },
];

const runtimeHighlights = [
  'PPTX 导出',
  '多类型资源渲染',
  '页面 / 组件预览',
  '截图预览',
];

const capabilities = [
  {
    label: 'AI',
    title: 'AI 协作创作',
    summary: '围绕当前项目、页面和空间注入上下文，让 AI 更聚焦具体创作任务。',
    items: ['组件、页面批量生成', '多层级样式约束', '单页面精细化调整'],
  },
  {
    label: 'Assets',
    title: '资产管理体系',
    summary: '把演示生产中反复使用的元素拆成可治理对象，支持长期沉淀和复用。',
    items: ['资源库与组件库', '主题、字体与样式库', '模板包导入与复用'],
  },
  {
    label: 'Runtime',
    title: 'Runtime 渲染导出',
    summary: '基于 Vue/Vite 渲染页面和组件，并支持 PPTX 导出与多类型资源渲染。',
    items: ['实时渲染组件与页面VUE SFC文件', '渲染图片、视频、DrawIO、Mermaid、ECharts和LaTeX 公式', '可按需求导出可编辑pptx'],
  },
  {
    label: 'Deploy',
    title: '私有化部署',
    summary: '支持多用户、工作空间隔离和自有环境运行，便于控制数据、模型凭证和访问边界。',
    items: ['多用户支持', '工作空间成员隔离', 'Docker Compose 快速部署'],
  },
];

const flowSteps = [
  { index: '01', title: '组织资产', summary: '沉淀工作空间资源、组件、主题、样式和字体，让项目从一开始就带着稳定风格。' },
  { index: '02', title: 'AI 协作生成', summary: '把项目、页面和资源上下文注入 Agent，让 AI 聚焦内容结构、版式调整和多页一致性。' },
  { index: '03', title: 'Runtime 验证', summary: '通过浏览器预览、截图预览和组件预览快速发现视觉问题，避免盲改源码。' },
  { index: '04', title: '项目模板复用', summary: '将页面、组件、资源、主题和字体沉淀为项目模板包，供团队复用和分发。' },
];

const developerLinks = [
  { title: 'GitHub 仓库', summary: '查看源码、License 和更新记录', href: githubUrl, external: true },
  { title: '文档中心', summary: '阅读用户文档和开发文档', href: siteUrl('/docs/') },
  { title: '部署指南', summary: '了解自有环境部署方式', href: siteUrl('/docs/developer/deployment-guide.html') },
];

/** 首页精选案例优先取 featured，缺省时按生成脚本排序取前三个。 */
const featuredShowcases = computed(() => {
  const featured = showcaseSummaries.filter((showcase) => showcase.featured);
  return (featured.length > 0 ? featured : showcaseSummaries).slice(0, showcasedCount);
});

/** 将站内 public 路径转换为带 VitePress base 的可访问 URL。 */
function siteUrl(path: string): string {
  return withBase(path);
}
</script>
