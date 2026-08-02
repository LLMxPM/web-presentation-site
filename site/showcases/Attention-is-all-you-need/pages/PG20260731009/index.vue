<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import ThreeLineTable from '@workspace-components/CMP20260608005/v/6'

const columns = [
  { key: 'model', title: '模型', width: '360px', align: 'left' },
  { key: 'ende', title: 'EN-DE BLEU', width: '240px', align: 'center' },
  { key: 'enfr', title: 'EN-FR BLEU', width: '240px', align: 'center' },
  { key: 'flops', title: '训练成本 FLOPs（论文列值）', width: '440px', align: 'center' },
]

const rows = [
  { model: 'ByteNet', ende: '23.75', enfr: '—', flops: '—' },
  { model: 'Deep-Att + PosUnk', ende: '—', enfr: '39.2', flops: '1.0e20' },
  { model: 'GNMT + RL', ende: '24.6', enfr: '39.92', flops: '2.3e19 / 1.4e20' },
  { model: 'ConvS2S', ende: '25.16', enfr: '40.46', flops: '9.6e18 / 1.5e20' },
  { model: 'MoE', ende: '26.03', enfr: '40.56', flops: '2.0e19 / 1.2e20' },
  { model: 'GNMT + RL Ensemble', ende: '26.30', enfr: '41.16', flops: '1.8e20 / 1.1e21' },
  { model: 'ConvS2S Ensemble', ende: '26.36', enfr: '41.29', flops: '7.7e19 / 1.2e21' },
  { model: 'Transformer base', ende: '27.3', enfr: '38.1', flops: '3.3e18' },
  { model: 'Transformer big', ende: '28.4', enfr: '41.8', flops: '2.3e19' },
]
</script>

<template>
  <AcademicContentPage
    title="实验结果：更低训练成本、更高 BLEU"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex flex-col gap-4 px-10 py-3">
      <div class="grid grid-cols-3 gap-5">
        <div class="rounded-lg border border-accent2-600/30 bg-accent2-600/10 px-6 py-3">
          <p class="text-4xl font-bold text-primary">28.4</p>
          <p class="mt-1 text-lg leading-snug text-secondary">EN-DE BLEU（Transformer big），超过当时已报道的最佳单模型与 ensemble</p>
        </div>
        <div class="rounded-lg border border-accent2-600/30 bg-accent2-600/10 px-6 py-3">
          <p class="text-4xl font-bold text-primary">41.8</p>
          <p class="mt-1 text-lg leading-snug text-secondary">EN-FR BLEU（arXiv v7 Table 2）</p>
        </div>
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-3">
          <p class="text-4xl font-bold text-primary">3.3e18</p>
          <p class="mt-1 text-lg leading-snug text-secondary">base 训练 FLOPs（big 为 2.3e19），明显低于许多对比系统</p>
        </div>
      </div>
      <ThreeLineTable
        :columns="columns"
        :rows="rows"
        caption="论文 Table 2（arXiv v7）：WMT 2014 机器翻译结果"
        fontSize="sm"
        width="100%"
        height="420px"
      />
      <div class="flex items-center gap-4 rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-6 py-3">
        <span class="h-8 w-1.5 shrink-0 rounded-full bg-accent4-600" />
        <p class="text-lg leading-snug text-secondary"><span class="font-bold text-primary">讲述重点：</span>不只报最高 BLEU——更并行、更低训练成本、质量不降反升。</p>
      </div>
    </div>
  </AcademicContentPage>
</template>
