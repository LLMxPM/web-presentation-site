<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import ThreeLineTable from '@workspace-components/CMP20260608005/v/6'

const cols3 = [
  { key: 'group', title: '组别', width: '80px', align: 'center' },
  { key: 'variant', title: '变化点', width: '150px', align: 'left' },
  { key: 'setting', title: '关键设置', width: '400px', align: 'left' },
  { key: 'ppl', title: 'Dev PPL', width: '100px', align: 'center' },
  { key: 'bleu', title: 'Dev BLEU', width: '100px', align: 'center' },
  { key: 'params', title: '参数量', width: '100px', align: 'center' },
]

const rows3 = [
  { group: 'base', variant: '基准模型', setting: 'N=6, d_model=512, d_ff=2048, h=8, d_k=d_v=64, P_drop=0.1, eps_ls=0.1, 100K steps', ppl: '4.92', bleu: '25.8', params: '65M' },
  { group: 'A', variant: '单头注意力', setting: 'h=1, d_k=d_v=512', ppl: '5.29', bleu: '24.9', params: '—' },
  { group: 'A', variant: '较少头数', setting: 'h=4, d_k=d_v=128', ppl: '5.00', bleu: '25.5', params: '—' },
  { group: 'A', variant: '较多头数', setting: 'h=16, d_k=d_v=32', ppl: '4.91', bleu: '25.8', params: '—' },
  { group: 'A', variant: '过多头数', setting: 'h=32, d_k=d_v=16', ppl: '5.01', bleu: '25.4', params: '—' },
  { group: 'C', variant: '更浅模型', setting: 'N=2', ppl: '6.11', bleu: '23.7', params: '36M' },
  { group: 'C', variant: '更深模型', setting: 'N=8', ppl: '4.88', bleu: '25.5', params: '80M' },
  { group: 'C', variant: '更宽模型', setting: 'd_model=1024', ppl: '4.66', bleu: '26.0', params: '168M' },
  { group: 'D', variant: '无 dropout', setting: 'P_drop=0.0', ppl: '5.77', bleu: '24.6', params: '—' },
  { group: 'D', variant: '更高 dropout', setting: 'P_drop=0.2', ppl: '4.95', bleu: '25.5', params: '—' },
  { group: 'E', variant: '学习式位置编码', setting: 'learned positional embedding', ppl: '4.92', bleu: '25.7', params: '—' },
  { group: 'big', variant: '大模型', setting: 'N=6, d_model=1024, d_ff=4096, h=16, P_drop=0.3, 300K steps', ppl: '4.33', bleu: '26.4', params: '213M' },
]

const cols4 = [
  { key: 'parser', title: 'Parser', width: '300px', align: 'left' },
  { key: 'training', title: 'Training', width: '220px', align: 'left' },
  { key: 'f1', title: 'WSJ 23 F1', width: '130px', align: 'center' },
]

const rows4 = [
  { parser: 'Vinyals & Kaiser et al. (2014)', training: 'WSJ only, discriminative', f1: '88.3' },
  { parser: 'Dyer et al. (2016)', training: 'WSJ only, discriminative', f1: '91.7' },
  { parser: 'Transformer (4 layers)', training: 'WSJ only, discriminative', f1: '91.3' },
  { parser: 'McClosky et al. (2006)', training: 'semi-supervised', f1: '92.1' },
  { parser: 'Vinyals & Kaiser et al. (2014)', training: 'semi-supervised', f1: '92.1' },
  { parser: 'Transformer (4 layers)', training: 'semi-supervised', f1: '92.7' },
  { parser: 'Luong et al. (2015)', training: 'multi-task', f1: '93.0' },
  { parser: 'Dyer et al. (2016)', training: 'generative', f1: '93.3' },
]
</script>

<template>
  <AcademicContentPage
    title="消融与泛化：头数、深度与位置编码的选择"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-6 px-10 py-3">
      <div class="w-[62%] flex flex-col gap-3">
        <ThreeLineTable
          :columns="cols3"
          :rows="rows3"
          caption="论文 Table 3：模型变体与消融（Dev PPL / Dev BLEU）"
          fontSize="sm"
          width="100%"
        />
        <div class="rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-5 py-3">
          <p class="text-base leading-snug text-secondary"><span class="font-bold text-primary">消融结论：</span>单头性能下降；头数过多也下降；更大模型通常更好；dropout 对防过拟合重要；learned 与 sinusoidal 位置编码结果接近。</p>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-3">
        <ThreeLineTable
          :columns="cols4"
          :rows="rows4"
          caption="论文 Table 4：English Constituency Parsing（WSJ 23 F1）"
          fontSize="sm"
          width="100%"
          height="330px"
        />
        <div class="rounded-lg border border-border-subtle bg-background-subtle px-5 py-3">
          <p class="text-base leading-snug text-secondary"><span class="font-bold text-primary">泛化：</span>4 层 Transformer 在 WSJ-only 达 91.3，semi-supervised 达 92.7，与强 parser 有竞争力。</p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
