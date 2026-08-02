<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
import AssetMermaid from '@runtime-kit/public/components/assets/AssetMermaid.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="位置编码与 FFN：补回顺序、逐位置变换"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-8 px-10 py-4">
      <div class="w-[42%] flex flex-col justify-center gap-4">
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-3">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent2-600" />
          <div>
            <p class="text-lg font-bold text-primary">显式注入位置</p>
            <p class="mt-1 text-base leading-snug text-secondary">无 RNN/CNN，需正弦/余弦位置编码，与 token embedding 相加</p>
          </div>
        </div>
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-3">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent2-600" />
          <div>
            <p class="text-lg font-bold text-primary">正弦编码的优势</p>
            <p class="mt-1 text-base leading-snug text-secondary">可能外推到更长的未见序列；相对位置偏移可由线性变换表示</p>
          </div>
        </div>
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-3">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent4-600" />
          <div>
            <p class="text-lg font-bold text-primary">逐位置 FFN</p>
            <p class="mt-1 text-base leading-snug text-secondary">Linear → ReLU → Linear，同一组参数独立作用于每个位置</p>
          </div>
        </div>
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-3">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent4-600" />
          <div>
            <p class="text-lg font-bold text-primary">权重共享</p>
            <p class="mt-1 text-base leading-snug text-secondary">embedding 与 pre-softmax 线性层共享权重，embedding 乘以 √d_model</p>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-center gap-4">
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
          <p class="mb-2 text-lg font-bold text-primary">位置编码示意</p>
          <AssetMermaid name="04_positional_encoding" class="w-full h-[240px] overflow-hidden" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1 rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="mb-2 text-lg font-bold text-primary">Block 组件公式</p>
            <AssetFormula name="03_transformer_block_components" display-mode class="w-full h-[220px] overflow-hidden text-primary" />
          </div>
          <div class="w-[40%] rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="mb-2 text-lg font-bold text-primary">源码组件：Positionwise FFN</p>
            <AssetImage name="05_source_component_positionwise_ffn" alt="源码组件 Positionwise FFN" fit="contain" class="w-full h-[220px] rounded-lg bg-transparent p-0" />
          </div>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
