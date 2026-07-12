<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260630003/v/1'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Scaled Dot-Product Attention"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 4"
  >
    <div class="h-full w-full flex gap-6 px-8 pt-2">
      <!-- 左侧：原图 + 公式 -->
      <div class="w-[480px] shrink-0 flex flex-col gap-4">
        <div class="flex-1 flex flex-col min-h-0">
          <AssetImage
            name="02_paper_figure_2a_scaled_dot_product_attention"
            alt="Scaled Dot-Product Attention"
            fit="contain"
            position="center"
            class="w-full flex-1 rounded-lg border border-border p-2 bg-transparent overflow-hidden"
          />
          <p class="text-sm text-secondary mt-1 text-center">图 2a：Scaled Dot-Product Attention（论文原图）</p>
        </div>
        <div class="shrink-0">
          <AssetFormula
            name="01_scaled_dot_product_attention"
            :display-mode="true"
            fit="contain"
            class="w-full h-[280px] rounded-lg border border-border p-3 bg-background-subtle text-primary overflow-hidden"
          />
        </div>
      </div>

      <!-- 右侧：解释 -->
      <div class="flex-1 flex flex-col justify-center space-y-4">
        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">核心公式</h3>
          <p class="text-lg text-secondary leading-relaxed">
            输入为 <strong class="text-primary">Query、Key、Value</strong>；输出是对 Value 的加权和。权重来自 QKᵀ 的相似度，经 <code class="text-accent1 font-code">√dₖ</code> 缩放后做 softmax。
          </p>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">为什么要缩放？</h3>
          <p class="text-lg text-secondary leading-relaxed mb-2">
            当 dₖ 较大时，点积方差变大 → softmax 可能进入<strong class="text-accent3">梯度很小的区域</strong>。
          </p>
          <p class="text-sm text-secondary font-code bg-white rounded px-3 py-1.5">
            Var(q · k) = dₖ，其中 q, k 独立且均值 0、方差 1
          </p>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">直观理解</h3>
          <div class="space-y-1.5 text-lg text-secondary">
            <p>🔍 <strong class="text-primary">Query</strong>：当前 token「想找什么信息」</p>
            <p>🔑 <strong class="text-primary">Key</strong>：每个 token「能被匹配的索引」</p>
            <p>📦 <strong class="text-primary">Value</strong>：真正要汇总的内容</p>
          </div>
        </div>

        <div class="bg-accent1/10 rounded-lg p-3 border border-accent1/30">
          <p class="text-base text-primary leading-relaxed">
            ⚠️ Decoder 中通过 mask 把非法未来位置设为 <code class="font-code text-accent1">-∞</code>，保证自回归生成。
          </p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
