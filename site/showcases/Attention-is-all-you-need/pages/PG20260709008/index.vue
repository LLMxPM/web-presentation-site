<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260709002/v/1'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="训练设置与工程细节"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 8"
  >
    <div class="h-full w-full flex gap-6 px-8 pt-2">
      <!-- 左侧：训练公式 -->
      <div class="w-[560px] shrink-0 flex flex-col gap-3">
        <div class="shrink-0">
          <AssetFormula
            name="04_training_schedule"
            :display-mode="true"
            fit="contain"
            class="w-full h-[400px] rounded-lg border border-border p-3 bg-background-subtle text-primary overflow-hidden"
          />
        </div>
        <div class="bg-accent2/10 rounded-lg p-3 border border-accent2/30">
          <p class="text-base text-primary leading-relaxed text-center">
            <Icon name="pin" class="size-5 inline-block align-middle" /> 论文贡献 <strong class="text-accent2">不只靠架构</strong>，还包括关键的训练 recipe：warmup、label smoothing、dropout、checkpoint averaging。
          </p>
        </div>
      </div>

      <!-- 右侧：细节卡片 -->
      <div class="flex-1 flex flex-col justify-center space-y-3">
        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-xl font-heading font-bold text-primary mb-2"><Icon name="bar-chart" class="size-5 inline-block align-middle" /> 数据规模</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="bg-white rounded p-2">
              <p class="font-bold text-accent1">WMT 2014 EN-DE</p>
              <p class="text-secondary">~450 万句对 · BPE 共享词表 ~37K</p>
            </div>
            <div class="bg-white rounded p-2">
              <p class="font-bold text-accent2">WMT 2014 EN-FR</p>
              <p class="text-secondary">~3600 万句 · word-piece ~32K</p>
            </div>
          </div>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-xl font-heading font-bold text-primary mb-2"><Icon name="monitor" class="size-5 inline-block align-middle" /> 硬件与训练时长</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="bg-white rounded p-2 text-center">
              <p class="font-bold text-accent1 text-lg">8 × P100</p>
              <p class="text-secondary">GPU</p>
            </div>
            <div class="bg-white rounded p-2 text-center">
              <p class="font-bold text-accent2 text-lg">12h / 3.5d</p>
              <p class="text-secondary">base / big</p>
            </div>
            <div class="bg-white rounded p-2 text-center">
              <p class="font-bold text-accent3 text-lg">100K / 300K</p>
              <p class="text-secondary">steps base / big</p>
            </div>
            <div class="bg-white rounded p-2 text-center">
              <p class="font-bold text-accent1 text-lg">Adam</p>
              <p class="text-secondary">β₁=0.9 β₂=0.98 ε=10⁻⁹</p>
            </div>
          </div>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-xl font-heading font-bold text-primary mb-2"><Icon name="shield" class="size-5 inline-block align-middle" /> 正则化策略</h3>
          <div class="space-y-1.5 text-base text-secondary">
            <p>• Residual Dropout（各子层、embedding、positional encoding）</p>
            <p>• Label Smoothing：ε_ls = <strong class="text-accent1">0.1</strong></p>
            <p>• 学习率 Warmup：<strong class="text-accent2">4000 steps</strong> 线性升高 → 平方根倒数衰减</p>
          </div>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-xl font-heading font-bold text-primary mb-2"><Icon name="search" class="size-5 inline-block align-middle" /> 推理策略</h3>
          <div class="space-y-1.5 text-base text-secondary">
            <p>• Checkpoint Averaging（最后 5-20 个 checkpoint 平均）</p>
            <p>• Beam Search（beam size = 4，α length penalty = 0.6）</p>
          </div>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
