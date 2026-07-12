<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260709002/v/1'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Transformer 总体结构"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 3"
  >
    <div class="h-full w-full flex gap-10 px-8 pt-4">
      <!-- 左侧：架构图 -->
      <div class="w-[480px] shrink-0 flex flex-col items-center">
        <AssetImage
          name="01_paper_figure_1_transformer_architecture"
          alt="Transformer 架构图"
          fit="contain"
          position="center"
          class="w-full flex-1 rounded-lg border border-border p-2 bg-transparent overflow-hidden"
        />
        <p class="text-base text-secondary mt-2">图 1：Transformer 模型架构（论文原图）</p>
      </div>

      <!-- 右侧：文字说明 -->
      <div class="flex-1 flex flex-col justify-center space-y-6">
        <div class="bg-background-subtle rounded-lg p-6 border border-border-subtle">
          <h3 class="text-3xl font-heading font-bold text-primary mb-4">Encoder-Decoder 框架</h3>
          <ul class="space-y-3 text-xl text-secondary leading-relaxed list-disc list-inside">
            <li>Encoder：N = <strong class="text-primary">6</strong> 层，每层含 multi-head self-attention + position-wise FFN</li>
            <li>Decoder：N = <strong class="text-primary">6</strong> 层，多一个 encoder-decoder attention</li>
            <li>Decoder self-attention 使用 <strong class="text-accent1">mask</strong> 避免看到未来 token</li>
          </ul>
        </div>

        <div class="bg-background-subtle rounded-lg p-6 border border-border-subtle">
          <h3 class="text-3xl font-heading font-bold text-primary mb-4">核心设计原则</h3>
          <ul class="space-y-3 text-xl text-secondary leading-relaxed list-disc list-inside">
            <li>每个子层外都有 <strong class="text-primary">residual connection + layer normalization</strong></li>
            <li>两个重复堆叠的 block：全局混合 token 信息的 attention + 逐位置非线性变换的 FFN</li>
            <li>Attention 做「token 间通信」，FFN 做「每个 token 内部特征变换」</li>
          </ul>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
