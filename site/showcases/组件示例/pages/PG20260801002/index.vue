<script setup lang="ts">
import ContentSlide from '@workspace-components/CMP20260605006/v/2'
import AssetChart from '@runtime-kit/public/components/assets/AssetChart.v1.vue'
</script>

<template>
  <ContentSlide
    title="ECharts 图表渲染示例"
    subtitle="使用 AssetChart 渲染工作空间 ECharts option JSON 资源"
    footer="Web Presentation · 资源渲染示例"
    :show-logo="true"
    :show-page-number="true"
  >
    <div class="flex h-full w-full gap-8">
      <!-- 左侧说明 -->
      <aside class="flex w-[400px] shrink-0 flex-col gap-3">
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">资源信息</p>
          <h3 class="mb-1 text-2xl font-semibold text-primary font-heading">季度销售趋势</h3>
          <p class="text-lg text-secondary">ECharts option · render_type=chart</p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">渲染方式</p>
          <p class="text-xl leading-relaxed text-primary">
            Runtime 加载 option JSON，默认 canvas 渲染，可切换 svg。
          </p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">使用要点</p>
          <ul class="space-y-1.5 text-lg text-secondary">
            <li>· 柱状：月销售额（万元）</li>
            <li>· 折线：环比增长率（%）</li>
            <li>· 双 Y 轴，主色与强调色区分</li>
          </ul>
        </div>
      </aside>

      <!-- 右侧渲染区 -->
      <section class="flex min-h-0 flex-1 flex-col gap-3">
        <div class="flex-1 min-h-0 overflow-hidden rounded-xl border border-border bg-background p-3">
          <AssetChart name="季度销售趋势" class="h-full w-full" />
        </div>
        <p class="px-1 text-sm text-secondary">1 月 ~ 6 月销售额稳步增长，5 月环比增长达 21%</p>
      </section>
    </div>
  </ContentSlide>
</template>
