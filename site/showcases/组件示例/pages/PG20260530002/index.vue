<script setup lang="ts">
import ContentSlide from '@workspace-components/CMP20260605006/v/2'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
</script>

<template>
  <ContentSlide
    title="公式渲染示例"
    subtitle="使用 AssetFormula 渲染工作空间 LaTeX 公式资源"
    footer="Web Presentation · 资源渲染示例"
    :show-logo="true"
    :show-page-number="true"
  >
    <div class="flex h-full w-full gap-8">
      <!-- 左侧说明 -->
      <aside class="flex w-[400px] shrink-0 flex-col gap-3">
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">资源信息</p>
          <h3 class="mb-1 text-2xl font-semibold text-primary font-heading">麦克斯韦方程组</h3>
          <p class="text-lg text-secondary">LaTeX · render_type=formula</p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">渲染方式</p>
          <p class="text-xl leading-relaxed text-primary">
            Runtime 加载 LaTeX 文本，浏览器端渲染，块级公式 display-mode 展示。
          </p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">使用要点</p>
          <ul class="space-y-1.5 text-lg text-secondary">
            <li>· 高斯电场定律：∇·E = ρ/ε₀</li>
            <li>· 高斯磁场定律：∇·B = 0</li>
            <li>· 法拉第定律：∇×E = −∂B/∂t</li>
            <li>· 安培-麦克斯韦定律：∇×B = μ₀J + μ₀ε₀∂E/∂t</li>
          </ul>
        </div>
      </aside>

      <!-- 右侧渲染区 -->
      <section class="flex min-h-0 flex-1 flex-col gap-3">
        <div class="min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-background p-6">
          <AssetFormula name="麦克斯韦方程组" display-mode class="h-full w-full bg-transparent text-primary text-3xl" />
        </div>
        <p class="px-1 text-sm text-secondary">四个方程分别对应高斯电场定律、高斯磁场定律、法拉第电磁感应定律与安培-麦克斯韦定律</p>
      </section>
    </div>
  </ContentSlide>
</template>
