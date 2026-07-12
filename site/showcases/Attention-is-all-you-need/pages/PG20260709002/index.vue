<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260709002/v/1'
import ThreeLineTable from '@workspace-components/CMP20260709003/v/1'

const columns = [
  { key: 'layerType', title: '层类型', align: 'left' },
  { key: 'complexity', title: '单层复杂度', align: 'center' },
  { key: 'seqOps', title: '最少顺序操作数', align: 'center' },
  { key: 'maxPath', title: '最大路径长度', align: 'center' },
]

const rows = [
  { layerType: 'Self-Attention', complexity: 'O(n² · d)', seqOps: 'O(1)', maxPath: 'O(1)' },
  { layerType: 'Recurrent', complexity: 'O(n · d²)', seqOps: 'O(n)', maxPath: 'O(n)' },
  { layerType: 'Convolutional', complexity: 'O(k · n · d²)', seqOps: 'O(1)', maxPath: 'O(logₖ(n))' },
  { layerType: 'Self-Attention (restricted)', complexity: 'O(r · n · d)', seqOps: 'O(1)', maxPath: 'O(n/r)' },
]
</script>

<template>
  <AcademicContentPage
    title="为什么要摆脱 RNN/CNN？"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 2"
  >
    <div class="h-full w-full flex flex-col justify-start px-8 pt-6">
      <!-- 问题陈述 -->
      <div class="mb-8 space-y-4">
        <div class="flex items-start gap-4">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent1 text-white text-xl font-bold shrink-0 mt-0.5">1</span>
          <div>
            <h3 class="text-3xl font-heading font-bold text-primary mb-2">RNN 的问题</h3>
            <p class="text-xl text-secondary leading-relaxed">按时间步递推，训练样本内部<strong class="text-primary">难以并行</strong>，长序列时吞吐受限。顺序操作数 O(n)，梯度需沿时间反向传播。</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent2 text-white text-xl font-bold shrink-0 mt-0.5">2</span>
          <div>
            <h3 class="text-3xl font-heading font-bold text-primary mb-2">CNN 的问题</h3>
            <p class="text-xl text-secondary leading-relaxed">可以并行计算，但<strong class="text-primary">远距离位置交互需要堆叠多层</strong>或扩大感受野。最大路径长度为 O(logₖ(n))。</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent3 text-white text-xl font-bold shrink-0 mt-0.5">3</span>
          <div>
            <h3 class="text-3xl font-heading font-bold text-primary mb-2">Transformer 的答案</h3>
            <p class="text-xl text-secondary leading-relaxed">每层 self-attention 让<strong class="text-primary">所有位置直接交互</strong>，最大路径长度为常数级 O(1)，任意两个 token 之间的信息路径最短。</p>
          </div>
        </div>
      </div>

      <!-- 复杂度对比表 -->
      <div class="flex-1 min-h-0">
        <ThreeLineTable
          :columns="columns"
          :rows="rows"
          caption="表 1：不同层类型的复杂度对比（论文 Table 1）"
          font-size="xl"
          width="100%"
          height="100%"
        />
      </div>

      <!-- 变量说明 -->
      <div class="mt-4 flex gap-6 text-base text-secondary">
        <span><code class="text-accent1 font-code">n</code>：序列长度</span>
        <span><code class="text-accent1 font-code">d</code>：表示维度</span>
        <span><code class="text-accent1 font-code">k</code>：卷积核大小</span>
        <span><code class="text-accent1 font-code">r</code>：局部邻域大小</span>
      </div>
    </div>
  </AcademicContentPage>
</template>
