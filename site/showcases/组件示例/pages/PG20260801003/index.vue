<script setup lang="ts">
import ContentSlide from '@workspace-components/CMP20260605006/v/2'
import AssetMermaid from '@runtime-kit/public/components/assets/AssetMermaid.v1.vue'
</script>

<template>
  <ContentSlide
    title="Mermaid 流程图渲染示例"
    subtitle="使用 AssetMermaid 渲染工作空间 Mermaid 文本图表资源"
    footer="Web Presentation · 资源渲染示例"
    :show-logo="true"
    :show-page-number="true"
  >
    <div class="flex h-full w-full gap-8">
      <!-- 左侧说明 -->
      <aside class="flex w-[400px] shrink-0 flex-col gap-3">
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">资源信息</p>
          <h3 class="mb-1 text-2xl font-semibold text-primary font-heading">订单处理流程</h3>
          <p class="text-lg text-secondary">Mermaid 文本图表 · render_type=mermaid</p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">渲染方式</p>
          <p class="text-xl leading-relaxed text-primary">
            浏览器端渲染 flowchart，支持分支判断与循环。
          </p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">使用要点</p>
          <ul class="space-y-1.5 text-lg text-secondary">
            <li>· 支持 default / dark / forest 主题</li>
            <li>· 语法错误时展示失败状态</li>
            <li>· 适合流程、时序、甘特图</li>
          </ul>
        </div>
      </aside>

      <!-- 右侧渲染区 -->
      <section class="flex min-h-0 flex-1 flex-col gap-3">
        <div class="flex-1 min-h-0 overflow-hidden rounded-xl border border-border bg-background p-3">
          <AssetMermaid name="订单处理流程" class="h-full w-full" />
        </div>
        <p class="px-1 text-sm text-secondary">库存校验分支 + 支付失败重试，覆盖订单处理全链路</p>
      </section>
    </div>
  </ContentSlide>
</template>
