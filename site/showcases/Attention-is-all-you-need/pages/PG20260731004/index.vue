<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260608004/v/7'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import AssetFormula from '@runtime-kit/public/components/assets/AssetFormula.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="Scaled Dot-Product Attention：按相似度加权汇总"
    footerText="Attention Is All You Need · Vaswani et al. · NIPS 2017"
  >
    <div class="h-full w-full flex gap-10 px-10 py-4">
      <div class="w-[320px] flex flex-col justify-center">
        <AssetImage
          name="02_paper_figure_2a_scaled_dot_product_attention"
          alt="论文 Figure 2 (a)：Scaled Dot-Product Attention"
          fit="contain"
          class="w-full h-[540px] rounded-lg border border-border bg-transparent p-0"
        />
        <p class="mt-3 text-center text-base text-secondary">论文 Figure 2 (a)</p>
      </div>
      <div class="flex-1 flex flex-col justify-center gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">输入与输出</p>
            <p class="mt-1 text-lg leading-snug text-secondary">输入 Query / Key / Value；输出是对 Value 的加权和</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">权重来源</p>
            <p class="mt-1 text-lg leading-snug text-secondary">由 QKᵀ 相似度经 √d_k 缩放后做 softmax 得到</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">为什么缩放</p>
            <p class="mt-1 text-lg leading-snug text-secondary">d_k 较大时点积方差变大，softmax 可能进入梯度很小的区域</p>
          </div>
          <div class="rounded-lg border border-border-subtle bg-background-subtle px-6 py-4">
            <p class="text-xl font-bold text-primary">Decoder 中的 mask</p>
            <p class="mt-1 text-lg leading-snug text-secondary">非法未来位置设为 -inf，保证自回归不泄漏</p>
          </div>
        </div>
        <AssetFormula
          name="01_scaled_dot_product_attention"
          display-mode
          class="w-full h-[180px] rounded-lg border border-border bg-transparent p-0 text-primary overflow-hidden"
        />
        <div class="flex items-center gap-4 rounded-lg border border-accent4-600/40 bg-accent4-600/10 px-6 py-3">
          <span class="h-8 w-1.5 shrink-0 rounded-full bg-accent4-600" />
          <p class="text-lg leading-snug text-secondary"><span class="font-bold text-primary">理解类比：</span>Query = 当前 token 想找什么；Key = 每个 token 的匹配索引；Value = 真正要汇总的内容</p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
