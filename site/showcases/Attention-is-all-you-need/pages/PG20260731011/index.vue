<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
</script>

<template>
  <AcademicContentPage
    title="总结、局限与讨论问题"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-8 px-10 py-4">
      <div class="flex-1 flex flex-col justify-center gap-4">
        <div class="rounded-lg border border-accent2-600/30 bg-accent2-600/10 px-6 py-4">
          <p class="text-xl font-bold text-primary">核心结论</p>
          <p class="mt-1 text-lg leading-snug text-secondary">序列建模不必依赖循环或卷积——attention 可以独立支撑强大的 encoder-decoder 架构。</p>
        </div>
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <p class="text-xl font-bold text-primary">影响</p>
          <p class="mt-1 text-lg leading-snug text-secondary">Transformer 成为 BERT、GPT、T5、Vision Transformer 等模型的基础组件。</p>
        </div>
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <p class="text-xl font-bold text-primary">局限</p>
          <p class="mt-1 text-lg leading-snug text-secondary">原始 self-attention 对长度呈二次复杂度；位置编码与全局 attention 对超长上下文、流式推理并不天然友好。</p>
        </div>
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <p class="text-xl font-bold text-primary">对今天的启发</p>
          <p class="mt-1 text-lg leading-snug text-secondary">现代大模型的许多改动仍围绕三条轴线：注意力效率、位置建模、训练稳定性与规模化。</p>
        </div>
      </div>
      <div class="w-[46%] flex flex-col justify-center gap-4">
        <p class="text-2xl font-bold text-primary">讨论问题</p>
        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-start gap-3 rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <span class="mt-1 text-lg font-bold text-accent4-600">Q1</span>
            <p class="text-lg leading-snug text-secondary">序列很长时，self-attention 的优势和代价如何变化？</p>
          </div>
          <div class="flex items-start gap-3 rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <span class="mt-1 text-lg font-bold text-accent4-600">Q2</span>
            <p class="text-lg leading-snug text-secondary">多头 attention 学到的"不同关系"是否一定可解释？</p>
          </div>
          <div class="flex items-start gap-3 rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <span class="mt-1 text-lg font-bold text-accent4-600">Q3</span>
            <p class="text-lg leading-snug text-secondary">原始 encoder-decoder 结构与 decoder-only LLM 的关键差异是什么？</p>
          </div>
          <div class="flex items-start gap-3 rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
            <span class="mt-1 text-lg font-bold text-accent4-600">Q4</span>
            <p class="text-lg leading-snug text-secondary">哪些结论属于架构创新，哪些依赖训练 recipe 与硬件并行？</p>
          </div>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
