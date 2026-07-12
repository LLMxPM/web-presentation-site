<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260630003/v/1'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="位置编码与位置前馈网络"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 6"
  >
    <div class="h-full w-full flex gap-6 px-8 pt-2">
      <!-- 左侧：FFN 图 + 公式 -->
      <div class="w-[460px] shrink-0 flex flex-col gap-4">
        <div class="flex-1 flex flex-col min-h-0">
          <AssetImage
            name="05_source_component_positionwise_ffn"
            alt="Position-wise Feed-Forward Network"
            fit="contain"
            position="center"
            class="w-full flex-1 rounded-lg border border-border p-2 bg-transparent overflow-hidden"
          />
          <p class="text-sm text-secondary mt-1 text-center">Position-wise FFN 组件（论文源码图）</p>
        </div>
        <div class="shrink-0">
          <AssetFormula
            name="03_transformer_block_components"
            :display-mode="true"
            fit="contain"
            class="w-full h-[340px] rounded-lg border border-border p-3 bg-background-subtle text-primary overflow-hidden"
          />
        </div>
      </div>

      <!-- 右侧：解释 -->
      <div class="flex-1 flex flex-col justify-center space-y-4">
        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">为什么需要位置编码？</h3>
          <p class="text-lg text-secondary leading-relaxed">
            没有 RNN/CNN → 模型<strong class="text-primary">需要显式注入位置信息</strong>。论文使用正弦/余弦位置编码，与 token embedding 直接相加。
          </p>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">正弦位置编码的优势</h3>
          <div class="space-y-2 text-lg text-secondary">
            <p>✅ 可能<strong class="text-accent2">外推</strong>到训练中未见过的更长序列</p>
            <p>✅ 相对位置偏移可由<strong class="text-primary">线性变换</strong>表示</p>
            <p>✅ 偶数维用 sin，奇数维用 cos；波长从 2π 到 10000·2π</p>
          </div>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">Position-wise FFN</h3>
          <p class="text-lg text-secondary leading-relaxed mb-3">
            对<strong class="text-primary">每个位置独立</strong>应用同一组参数：<code class="font-code text-accent1">Linear → ReLU → Linear</code>，把每个 token 的通道维度做非线性变换。d_ff = 2048（base）。
          </p>
          <div class="bg-white rounded p-3 text-center">
            <p class="text-base text-secondary">Embedding 层与 pre-softmax 线性层<strong class="text-primary">共享权重</strong>，embedding 乘以 √d_model</p>
          </div>
        </div>

        <div class="bg-accent2/10 rounded-lg p-3 border border-accent2/30">
          <p class="text-base text-primary leading-relaxed">
            🔑 协作逻辑：<strong class="text-accent2">Attention</strong> 做「token 间通信」→ <strong class="text-accent2">FFN</strong> 做「每个 token 内部特征变换」→ <strong class="text-accent2">位置编码</strong> 补回顺序信息。
          </p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
