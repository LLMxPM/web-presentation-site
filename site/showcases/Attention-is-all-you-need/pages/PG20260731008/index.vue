<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
import AssetMermaid from '@runtime-kit/public/components/assets/AssetMermaid.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="训练设置：warmup、dropout 与 label smoothing 缺一不可"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex flex-col gap-5 px-10 py-4">
      <div class="flex gap-8">
        <div class="flex-1 grid grid-cols-2 gap-4">
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="text-lg font-bold text-primary">数据</p>
            <p class="mt-1 text-base leading-snug text-secondary">WMT14 EN-DE 约 450 万句对（BPE 词表 37K）；EN-FR 约 3600 万句（word-piece 32K）</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="text-lg font-bold text-primary">硬件与时长</p>
            <p class="mt-1 text-base leading-snug text-secondary">8× NVIDIA P100；base 100K steps / 约 12h；big 300K steps / 约 3.5 天</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="text-lg font-bold text-primary">优化器</p>
            <p class="mt-1 text-base leading-snug text-secondary">Adam，β₁=0.9，β₂=0.98，ε=1e-9</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="text-lg font-bold text-primary">正则化</p>
            <p class="mt-1 text-base leading-snug text-secondary">residual dropout · embedding / positional dropout · label smoothing</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <p class="text-lg font-bold text-primary">推理</p>
            <p class="mt-1 text-base leading-snug text-secondary">checkpoint averaging · beam search · length penalty</p>
          </div>
          <div class="rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-5 py-3">
            <p class="text-lg font-bold text-primary">讲述重点</p>
            <p class="mt-1 text-base leading-snug text-secondary">贡献不只靠架构，还包括当时关键的 training recipe：warmup、label smoothing、dropout、checkpoint averaging</p>
          </div>
        </div>
        <div class="w-[34%] flex flex-col justify-center gap-2">
          <p class="text-lg font-bold text-primary">学习率调度</p>
          <AssetFormula name="04_training_schedule" display-mode class="w-full h-[170px] rounded-lg border border-border bg-transparent p-0 text-primary overflow-hidden" />
          <p class="text-base leading-snug text-secondary">warmup 4000 steps，先线性升高，再按 step 的平方根倒数衰减</p>
        </div>
      </div>
      <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
        <p class="mb-2 text-lg font-bold text-primary">训练与推理流水线</p>
        <AssetMermaid name="05_training_and_inference_pipeline" class="w-full h-[90px] overflow-hidden" />
      </div>
    </div>
  </AcademicContentPage>
</template>
