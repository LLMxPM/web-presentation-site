<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Transformer 总体结构：Encoder-Decoder 与 N=6 的重复块"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-10 px-10 py-4">
      <div class="w-[400px] flex flex-col justify-center">
        <AssetImage
          name="01_paper_figure_1_transformer_architecture"
          alt="论文 Figure 1：Transformer 架构"
          fit="contain"
          class="w-full h-[600px] rounded-lg border border-border bg-transparent p-0"
        />
        <p class="mt-3 text-center text-base text-secondary">论文 Figure 1：Transformer 架构</p>
      </div>
      <div class="flex-1 flex flex-col justify-center gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">Encoder · N=6</p>
            <p class="mt-1 text-lg leading-snug text-secondary">把输入序列映射为连续表征；每层含 multi-head self-attention 与 position-wise FFN</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">Decoder · N=6</p>
            <p class="mt-1 text-lg leading-snug text-secondary">自回归生成输出序列；每层多一个 encoder-decoder attention，self-attention 加 mask 防窥未来</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">每个子层</p>
            <p class="mt-1 text-lg leading-snug text-secondary">residual connection + layer normalization，支撑深层稳定训练</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">两类重复块</p>
            <p class="mt-1 text-lg leading-snug text-secondary">attention 全局混合 token 信息；FFN 做逐位置非线性变换</p>
          </div>
        </div>
        <div class="flex items-center gap-4 rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-6 py-4">
          <span class="h-8 w-1.5 shrink-0 rounded-full bg-accent4-600" />
          <p class="text-lg leading-snug text-secondary"><span class="font-bold text-primary">讲述重点：</span>把 Transformer 看成重复堆叠的 block——attention 负责 token 间通信，FFN 负责逐位置变换。</p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
