<script setup lang="ts">
import AcademicContentPage from '@workspace-components/CMP20260630003/v/1'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <AcademicContentPage
    title="总结、局限与讨论"
    :show-logo="true"
    :show-page-number="true"
    footer-text="Transformer 论文精读 · Slide 10"
  >
    <div class="h-full w-full flex gap-6 px-8 pt-2">
      <!-- 左侧：结论 + 影响 + 局限 -->
      <div class="flex-[1.1] flex flex-col justify-center space-y-3">
        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">🎯 核心结论</h3>
          <p class="text-lg text-secondary leading-relaxed">
            序列建模<strong class="text-primary">不一定必须依赖循环或卷积</strong>。Attention 可以独立支撑强大的 encoder-decoder 架构，以更低顺序依赖、更短信息路径实现更好质量。
          </p>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">🌐 深远影响</h3>
          <div class="flex flex-wrap gap-2 text-base">
            <span class="bg-accent1 text-white rounded-full px-4 py-1 font-bold">BERT</span>
            <span class="bg-accent2 text-white rounded-full px-4 py-1 font-bold">GPT</span>
            <span class="bg-accent3 text-white rounded-full px-4 py-1 font-bold">T5</span>
            <span class="bg-accent1 text-white rounded-full px-4 py-1 font-bold">ViT</span>
            <span class="bg-accent2 text-white rounded-full px-4 py-1 font-bold">LLaMA</span>
            <span class="bg-accent3 text-white rounded-full px-4 py-1 font-bold">DALL·E</span>
            <span class="bg-accent1 text-white rounded-full px-4 py-1 font-bold">Whisper</span>
            <span class="bg-accent2 text-white rounded-full px-4 py-1 font-bold">CLIP</span>
          </div>
          <p class="text-base text-secondary mt-2">Transformer 成为后续几乎所有大模型的基础组件。</p>
        </div>

        <div class="bg-background-subtle rounded-lg p-4 border border-border-subtle">
          <h3 class="text-2xl font-heading font-bold text-primary mb-2">⚠️ 局限</h3>
          <div class="space-y-1.5 text-base text-secondary">
            <p>• Self-attention 对长度<strong class="text-accent1">二次复杂度 O(n²)</strong></p>
            <p>• 原始位置编码对超长上下文、流式推理不天然友好</p>
            <p>• 全局 attention 在长序列上内存和计算压力大</p>
          </div>
        </div>

        <div class="bg-accent1/10 rounded-lg p-4 border border-accent1/30">
          <h3 class="text-xl font-heading font-bold text-primary mb-2">🔬 现代改进三大轴线</h3>
          <div class="grid grid-cols-3 gap-3 text-center text-sm">
            <div class="bg-white rounded p-2">
              <p class="font-bold text-accent1">注意力效率</p>
              <p class="text-secondary">FlashAttention、稀疏注意力</p>
            </div>
            <div class="bg-white rounded p-2">
              <p class="font-bold text-accent2">位置建模</p>
              <p class="text-secondary">RoPE、ALiBi</p>
            </div>
            <div class="bg-white rounded p-2">
              <p class="font-bold text-accent3">训练规模化</p>
              <p class="text-secondary">Pre-norm、混合精度</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：讨论问题 + 可视化 -->
      <div class="flex-[0.9] flex flex-col justify-center gap-4">
        <div class="bg-white rounded-lg p-4 border-2 border-accent2/40">
          <h3 class="text-xl font-heading font-bold text-accent2 mb-3">💬 建议讨论问题</h3>
          <div class="space-y-2.5 text-base text-secondary">
            <div class="flex items-start gap-2">
              <span class="text-accent2 font-bold shrink-0">①</span>
              <span>如果序列很长，self-attention 的<strong class="text-primary">优势和代价如何变化</strong>？</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-accent2 font-bold shrink-0">②</span>
              <span>多头 attention 学到的「不同关系」是否<strong class="text-primary">一定可解释</strong>？</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-accent2 font-bold shrink-0">③</span>
              <span>原始 encoder-decoder 结构与现在 <strong class="text-primary">decoder-only LLM</strong> 的关键差异？</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="text-accent2 font-bold shrink-0">④</span>
              <span>哪些结论属于<strong class="text-primary">架构创新</strong>，哪些依赖训练 recipe 和硬件并行？</span>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col min-h-0">
          <AssetImage
            name="10_appendix_attention_sentence_structure_head_a"
            alt="句子结构注意力可视化"
            fit="contain"
            position="center"
            class="w-full flex-1 rounded-lg border border-border p-2 bg-transparent overflow-hidden"
          />
          <p class="text-xs text-secondary mt-1 text-center">附录图：不同注意力头捕捉的句子结构（论文原图）</p>
        </div>
      </div>
    </div>
  </AcademicContentPage>
</template>
