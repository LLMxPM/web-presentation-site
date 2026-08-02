<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Multi-Head Attention：在不同子空间并行关注"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-10 px-10 py-4">
      <div class="w-[360px] flex flex-col justify-center">
        <AssetImage
          name="03_paper_figure_2b_multi_head_attention"
          alt="论文 Figure 2 (b)：Multi-Head Attention"
          fit="contain"
          class="w-full h-[540px] rounded-lg border border-border bg-transparent p-0"
        />
        <p class="mt-3 text-center text-base text-secondary">论文 Figure 2 (b)</p>
      </div>
      <div class="flex-1 flex flex-col justify-center gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">单头的局限</p>
            <p class="mt-1 text-lg leading-snug text-secondary">不同关系被平均到同一空间，表达能力受限</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">多头的收益</p>
            <p class="mt-1 text-lg leading-snug text-secondary">在不同子空间、不同位置关系上并行关注</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">论文 base 设置</p>
            <p class="mt-1 text-lg leading-snug text-secondary">h=8，d_model=512，每头 d_k=d_v=64</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">三种使用方式</p>
            <p class="mt-1 text-lg leading-snug text-secondary">encoder self-attn · decoder masked self-attn · encoder-decoder cross-attn</p>
          </div>
        </div>
        <AssetFormula
          name="02_multi_head_attention"
          display-mode
          class="w-full h-[150px] rounded-lg border border-border bg-transparent p-0 text-primary overflow-hidden"
        />
        <div class="flex items-center gap-4 rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-6 py-3">
          <span class="h-8 w-1.5 shrink-0 rounded-full bg-accent4-600" />
          <p class="text-lg leading-snug text-secondary"><span class="font-bold text-primary">讨论提示：</span>Table 3 显示单头比最佳设置低约 0.9 BLEU，头数过多也变差——"头数 × 每头维度"需要平衡；多头总计算量与单头全维度接近。</p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
