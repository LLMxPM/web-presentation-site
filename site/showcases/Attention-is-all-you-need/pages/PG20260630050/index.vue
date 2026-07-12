<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260630003/v/1'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="为什么 Self-Attention 有效？"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 7"
  >
    <div class="h-full w-full flex gap-6 px-8 pt-2">
      <!-- 左侧：长距离依赖可视化 -->
      <div class="w-[580px] shrink-0 flex flex-col">
        <AssetImage
          name="07_appendix_attention_long_distance_dependencies"
          alt="Attention 长距离依赖可视化"
          fit="contain"
          position="center"
          class="w-full flex-1 rounded-lg border border-border p-2 bg-transparent overflow-hidden"
        />
        <p class="text-sm text-secondary mt-1 text-center">附录图：不同注意力头捕捉的长距离依赖（论文原图）</p>
      </div>

      <!-- 右侧：分析 -->
      <div class="flex-1 flex flex-col justify-center space-y-4">
        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">三个评价维度（回顾 Table 1）</h3>
          <div class="space-y-2 text-lg text-secondary">
            <div class="flex items-center gap-3 bg-white rounded p-3">
              <span class="text-accent1 font-bold text-2xl w-24 text-center">O(1)</span>
              <span><strong class="text-primary">最少顺序操作数</strong> — 全并行，无时间步依赖</span>
            </div>
            <div class="flex items-center gap-3 bg-white rounded p-3">
              <span class="text-accent2 font-bold text-2xl w-24 text-center">O(1)</span>
              <span><strong class="text-primary">最大路径长度</strong> — 任意两个 token 直接交互</span>
            </div>
            <div class="flex items-center gap-3 bg-white rounded p-3">
              <span class="text-accent3 font-bold text-2xl w-24 text-center">O(n²d)</span>
              <span><strong class="text-primary">单层复杂度</strong> — 包含 n² 项，是主要代价</span>
            </div>
          </div>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">与 RNN/CNN 的量化对比</h3>
          <div class="grid grid-cols-3 gap-3 text-center text-base">
            <div class="bg-white rounded p-3">
              <p class="font-heading font-bold text-primary text-lg">Self-Attention</p>
              <p class="text-accent2 font-bold text-xl my-1">O(1) / O(1)</p>
              <p class="text-xs text-secondary">顺序操作 / 路径长度</p>
            </div>
            <div class="bg-white rounded p-3">
              <p class="font-heading font-bold text-primary text-lg">RNN</p>
              <p class="text-accent1 font-bold text-xl my-1">O(n) / O(n)</p>
              <p class="text-xs text-secondary">顺序操作 / 路径长度</p>
            </div>
            <div class="bg-white rounded p-3">
              <p class="font-heading font-bold text-primary text-lg">CNN</p>
              <p class="text-accent3 font-bold text-xl my-1">O(1) / O(logₖn)</p>
              <p class="text-xs text-secondary">顺序操作 / 路径长度</p>
            </div>
          </div>
        </div>

        <div class="bg-accent1/10 rounded-lg p-4 border border-accent1/30">
          <h3 class="text-xl font-heading font-bold text-primary mb-2">代价与后续发展</h3>
          <p class="text-base text-secondary leading-relaxed">
            Self-attention 的 O(n²) 代价在长上下文时成为瓶颈。后续 <strong class="text-accent1">Longformer、Performer、FlashAttention、稀疏注意力</strong>等工作，都围绕 O(n²) 代价展开工程和算法改进。
          </p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
