<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260630003/v/1'
import ThreeLineTable from '@workspace-components/CMP20260630002/v/1'

const mtColumns = [
  { key: 'model', title: '模型', width: '260px', align: 'left' },
  { key: 'enDe', title: 'EN-DE BLEU', width: '160px', align: 'center' },
  { key: 'enFr', title: 'EN-FR BLEU', width: '160px', align: 'center' },
  { key: 'flops', title: '训练 FLOPs', width: '180px', align: 'center' },
]

const mtRows = [
  { model: 'ByteNet', enDe: '23.75', enFr: '—', flops: '—' },
  { model: 'GNMT + RL', enDe: '24.6', enFr: '39.92', flops: '2.3×10¹⁹ / 1.4×10²⁰' },
  { model: 'ConvS2S', enDe: '25.16', enFr: '40.46', flops: '9.6×10¹⁸ / 1.5×10²⁰' },
  { model: 'MoE', enDe: '26.03', enFr: '40.56', flops: '2.0×10¹⁹ / 1.2×10²⁰' },
  { model: 'Transformer base', enDe: '27.3', enFr: '38.1', flops: '3.3×10¹⁸' },
  { model: 'Transformer big', enDe: '28.4', enFr: '41.8', flops: '2.3×10¹⁹' },
]

const ablColumns = [
  { key: 'group', title: '组', width: '60px', align: 'center' },
  { key: 'variant', title: '变化点', width: '200px', align: 'left' },
  { key: 'setting', title: '关键设置', width: '280px', align: 'left' },
  { key: 'ppl', title: 'Dev PPL', width: '100px', align: 'center' },
  { key: 'bleu', title: 'Dev BLEU', width: '100px', align: 'center' },
]

const ablRows = [
  { group: 'base', variant: '基准模型', setting: 'N=6, d_model=512, h=8, drop=0.1', ppl: '4.92', bleu: '25.8' },
  { group: 'A', variant: '单头 (h=1)', setting: 'd_k=d_v=512', ppl: '5.29', bleu: '24.9 ↓' },
  { group: 'A', variant: '较少头 (h=4)', setting: 'd_k=d_v=128', ppl: '5.00', bleu: '25.5' },
  { group: 'A', variant: '过多头 (h=32)', setting: 'd_k=d_v=16', ppl: '5.01', bleu: '25.4' },
  { group: 'C', variant: '更深 (N=8)', setting: 'depth↑', ppl: '4.88', bleu: '25.5' },
  { group: 'C', variant: '更宽 (d=1024)', setting: 'd_model=1024', ppl: '4.66', bleu: '26.0' },
  { group: 'D', variant: '无 dropout', setting: 'P_drop=0.0', ppl: '5.77', bleu: '24.6 ↓' },
  { group: 'E', variant: '学习式位置编码', setting: 'learned PE', ppl: '4.92', bleu: '25.7 ≈' },
  { group: 'big', variant: '大模型', setting: 'd=1024, h=16, drop=0.3', ppl: '4.33', bleu: '26.4' },
]
</script>

<template>
  <AcademicContentPage
    title="实验结果与消融分析"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 9"
  >
    <div class="h-full w-full flex gap-5 px-6 pt-1">
      <!-- 左侧：MT 结果 -->
      <div class="flex-1 flex flex-col gap-3 min-w-0">
        <div class="flex-1 min-h-0">
          <ThreeLineTable
            :columns="mtColumns"
            :rows="mtRows"
            caption="表 2：机器翻译结果（WMT 2014 EN-DE / EN-FR）"
            font-size="base"
            width="100%"
            height="100%"
          />
        </div>
        <div class="shrink-0 bg-accent1/10 rounded-lg p-3 border border-accent1/30">
          <p class="text-sm text-primary leading-relaxed">
            🏆 <strong class="text-accent1">Transformer big</strong>：EN-DE 28.4 BLEU（超过所有已报道模型）；EN-FR 41.8 BLEU。训练成本（FLOPs）<strong class="text-accent2">显著低于</strong>对比系统。
          </p>
        </div>
      </div>

      <!-- 右侧：消融 -->
      <div class="flex-1 flex flex-col gap-3 min-w-0">
        <div class="flex-1 min-h-0">
          <ThreeLineTable
            :columns="ablColumns"
            :rows="ablRows"
            caption="表 3：模型变体消融（论文 Table 3）"
            font-size="base"
            width="100%"
            height="100%"
          />
        </div>
        <div class="shrink-0 bg-accent2/10 rounded-lg p-3 border border-accent2/30">
          <p class="text-sm text-primary leading-relaxed">
            📋 <strong class="text-accent2">消融结论</strong>：单头 ↓0.9 BLEU；过多头也变差；更大模型更好；dropout 防过拟合关键；learned PE ≈ sinusoidal PE。4 层 Transformer 在 WSJ parsing 达 F1 91.3（discriminative）/ 92.7（semi-supervised）。
          </p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
