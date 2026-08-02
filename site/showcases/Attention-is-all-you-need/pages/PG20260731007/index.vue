<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Self-Attention 为什么有效：路径长度降为 O(1)"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-8 px-10 py-4">
      <div class="flex-1 flex flex-col justify-center gap-3">
        <AssetImage
          name="07_appendix_attention_long_distance_dependencies"
          alt="论文附录：长距离依赖的注意力可视化"
          fit="contain"
          class="w-full h-[500px] rounded-lg border border-border bg-transparent p-0"
        />
        <p class="text-center text-base text-secondary">论文附录 Figure 3：长距离依赖的 attention 可视化</p>
      </div>
      <div class="w-[44%] flex flex-col justify-center gap-4">
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <p class="text-xl font-bold text-primary">三个评价维度</p>
          <p class="mt-1 text-lg leading-snug text-secondary">单层复杂度 · 最少顺序操作数 · 最大路径长度</p>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-lg border border-accent2-600/30 bg-accent2-600/10 px-4 py-3">
            <p class="text-base font-bold text-primary">Self-Attn</p>
            <p class="mt-1 text-base leading-snug text-secondary">顺序 O(1)<br />路径 O(1)</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-4 py-3">
            <p class="text-base font-bold text-primary">RNN</p>
            <p class="mt-1 text-base leading-snug text-secondary">顺序 O(n)<br />路径 O(n)</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-4 py-3">
            <p class="text-base font-bold text-primary">CNN</p>
            <p class="mt-1 text-base leading-snug text-secondary">可并行<br />远距离需多层</p>
          </div>
        </div>
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <p class="text-xl font-bold text-primary">代价</p>
          <p class="mt-1 text-lg leading-snug text-secondary">单层复杂度含 O(n²·d)，长上下文会显著增加内存与计算</p>
        </div>
        <div class="flex items-center gap-4 rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-6 py-3">
          <span class="h-8 w-1.5 shrink-0 rounded-full bg-accent4-600" />
          <p class="text-lg leading-snug text-secondary"><span class="font-bold text-primary">讨论提示：</span>Longformer、Performer、FlashAttention、稀疏注意力等，可看成围绕 O(n²) 代价展开的工程与算法改进。</p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
