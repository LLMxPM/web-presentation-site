<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260709002/v/1'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Multi-Head Attention：为什么要多头？"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 5"
  >
    <div class="h-full w-full flex gap-6 px-8 pt-2">
      <!-- 左侧：原图 + 公式 -->
      <div class="w-[460px] shrink-0 flex flex-col gap-4">
        <div class="flex-1 flex flex-col min-h-0">
          <AssetImage
            name="03_paper_figure_2b_multi_head_attention"
            alt="Multi-Head Attention"
            fit="contain"
            position="center"
            class="w-full flex-1 rounded-lg border border-border p-2 bg-transparent overflow-hidden"
          />
          <p class="text-sm text-secondary mt-1 text-center">图 2b：Multi-Head Attention（论文原图）</p>
        </div>
        <div class="shrink-0">
          <AssetFormula
            name="02_multi_head_attention"
            :display-mode="true"
            fit="contain"
            class="w-full h-[260px] rounded-lg border border-border p-3 bg-background-subtle text-primary overflow-hidden"
          />
        </div>
      </div>

      <!-- 右侧：解释 -->
      <div class="flex-1 flex flex-col justify-center space-y-4">
        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">为什么需要多头？</h3>
          <p class="text-lg text-secondary leading-relaxed">
            单头 attention 会把不同关系平均到<strong class="text-primary">一个空间</strong>中。多头让模型在<strong class="text-accent2">不同子空间、不同位置关系</strong>上并行关注，捕捉更丰富的依赖模式。
          </p>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">Base 模型配置</h3>
          <div class="grid grid-cols-2 gap-3 text-lg">
            <div class="bg-white rounded p-3 text-center">
              <span class="text-accent1 font-bold text-3xl">8</span>
              <p class="text-sm text-secondary mt-1">头数 h</p>
            </div>
            <div class="bg-white rounded p-3 text-center">
              <span class="text-accent1 font-bold text-3xl">512</span>
              <p class="text-sm text-secondary mt-1">d_model</p>
            </div>
            <div class="bg-white rounded p-3 text-center">
              <span class="text-accent1 font-bold text-3xl">64</span>
              <p class="text-sm text-secondary mt-1">每头 d_k = d_v</p>
            </div>
            <div class="bg-white rounded p-3 text-center">
              <span class="text-accent2 font-bold text-lg">≈ 单头全维度</span>
              <p class="text-sm text-secondary mt-1">总计算量</p>
            </div>
          </div>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">三种使用方式</h3>
          <div class="space-y-1.5 text-lg text-secondary">
            <p>❶ Encoder <strong class="text-primary">self-attention</strong>（所有位置两两交互）</p>
            <p>❷ Decoder <strong class="text-primary">masked self-attention</strong>（只看过去）</p>
            <p>❸ <strong class="text-accent2">Encoder-Decoder cross-attention</strong>（Query 来自 decoder，Key/Value 来自 encoder）</p>
          </div>
        </div>

        <div class="bg-accent1/10 rounded-lg p-3 border border-accent1/30">
          <p class="text-base text-primary leading-relaxed">
            <Icon name="bar-chart" class="size-5 inline-block align-middle" /> 消融实验：单头比最佳设置低约 <strong class="text-accent1">0.9 BLEU</strong>；过多头也会变差——头数与每头维度需要平衡。
          </p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
