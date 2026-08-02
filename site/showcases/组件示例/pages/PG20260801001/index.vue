<script setup lang="ts">
import ContentSlide from '@workspace-components/CMP20260605006/v/2'
import AssetDrawio from '@runtime-kit/public/components/assets/AssetDrawio.v1.vue'
</script>

<template>
  <ContentSlide
    title="Draw.io 图表渲染示例"
    subtitle="使用 AssetDrawio 渲染工作空间 Draw.io XML 图表资源"
    footer="Web Presentation · 资源渲染示例"
    :show-logo="true"
    :show-page-number="true"
  >
    <div class="flex h-full w-full gap-8">
      <!-- 左侧说明 -->
      <aside class="flex w-[400px] shrink-0 flex-col gap-3">
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">资源信息</p>
          <h3 class="mb-1 text-2xl font-semibold text-primary font-heading">sample</h3>
          <p class="text-lg text-secondary">Draw.io 流程图 · render_type=drawio</p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">渲染方式</p>
          <p class="text-xl leading-relaxed text-primary">
            Runtime 浏览器端解析 XML，图表自动缩放适配容器。
          </p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">使用要点</p>
          <ul class="space-y-1.5 text-lg text-secondary">
            <li>· name 与 content 二选一</li>
            <li>· 容器需用 class 声明明确宽高</li>
            <li>· 适合架构图、流程图、思维导图</li>
          </ul>
        </div>
      </aside>

      <!-- 右侧渲染区 -->
      <section class="flex min-h-0 flex-1 flex-col gap-3">
        <div class="flex-1 min-h-0 overflow-hidden rounded-xl border border-border bg-background p-3">
          <AssetDrawio name="sample" class="h-full w-full" />
        </div>
        <p class="px-1 text-sm text-secondary">示例流程：开始 → 处理数据 → 判断条件 → 执行操作 → 结束</p>
      </section>
    </div>
  </ContentSlide>
</template>
