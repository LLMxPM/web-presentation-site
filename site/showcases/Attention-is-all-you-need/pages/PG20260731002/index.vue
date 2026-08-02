<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import ThreeLineTable from '@workspace-components/CMP20260608005/v/6'

const columns = [
  { key: 'layer', title: 'Layer Type', width: '230px', align: 'left' },
  { key: 'complexity', title: '单层复杂度', width: '150px', align: 'center' },
  { key: 'sequential', title: '顺序操作数', width: '170px', align: 'center' },
  { key: 'path', title: '路径长度', width: '150px', align: 'center' },
]

const rows = [
  { layer: 'Self-Attention', complexity: 'O(n²·d)', sequential: 'O(1)', path: 'O(1)' },
  { layer: 'Recurrent', complexity: 'O(n·d²)', sequential: 'O(n)', path: 'O(n)' },
  { layer: 'Convolutional', complexity: 'O(k·n·d²)', sequential: 'O(1)', path: 'O(logₖ n)' },
  { layer: 'Self-Attention (restricted)', complexity: 'O(r·n·d)', sequential: 'O(1)', path: 'O(n/r)' },
]
</script>

<template>
  <AcademicContentPage
    title="为什么必须摆脱 RNN/CNN：并行与远距离依赖"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-8 px-10 py-4">
      <div class="flex-1 flex flex-col justify-center gap-4">
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent2-600" />
          <div>
            <p class="text-xl font-bold text-primary">背景</p>
            <p class="mt-1 text-lg leading-snug text-secondary">主流序列转导模型多依赖 RNN/CNN 编码器-解码器，注意力通常只是附加模块。</p>
          </div>
        </div>
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent4-600" />
          <div>
            <p class="text-xl font-bold text-primary">RNN 的问题</p>
            <p class="mt-1 text-lg leading-snug text-secondary">按时间步递推，样本内难并行；顺序操作与最大路径长度都为 O(n)，长序列吞吐受限。</p>
          </div>
        </div>
        <div class="flex items-start gap-4 rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent4-600" />
          <div>
            <p class="text-xl font-bold text-primary">CNN 的问题</p>
            <p class="mt-1 text-lg leading-snug text-secondary">可以并行，但远距离位置交互需要堆叠多层或扩大感受野（路径 O(logₖ n)）。</p>
          </div>
        </div>
        <div class="flex items-start gap-4 rounded-lg border border-accent2-600/30 bg-accent2-600/10 px-6 py-4">
          <span class="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent2-600" />
          <div>
            <p class="text-xl font-bold text-primary">Transformer 的答案</p>
            <p class="mt-1 text-lg leading-snug text-secondary">每层 self-attention 让所有位置直接交互，最大路径长度降为常数级 O(1)。</p>
          </div>
        </div>
      </div>
      <div class="w-[46%] flex flex-col justify-center gap-3">
        <ThreeLineTable
          :columns="columns"
          :rows="rows"
          caption="论文 Table 1：不同层类型的复杂度对比"
          fontSize="lg"
          width="100%"
        />
        <p class="text-base leading-snug text-secondary">变量说明：n 序列长度 · d 表示维度 · k 卷积核大小 · r 局部邻域大小</p>
        <p class="text-base leading-snug text-secondary">可讲问题：短序列 MT 中通常 n &lt; d_model，self-attention 的 O(n²·d) 可接受；长序列是后续研究的主要瓶颈。</p>
      </div>
    </div>
  </AcademicContentPage>
</template>
