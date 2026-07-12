<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue';
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue';
</script>

<template>
  <DefaultContainer>
    <div class="h-full w-full flex flex-col bg-background px-[72px] pt-[72px] pb-[72px]">
      <!-- 标签行 -->
      <div class="mb-[28px]">
        <span class="inline-block px-[24px] py-[8px] rounded-full bg-accent1/10 text-accent1-700 text-base font-semibold tracking-wide">
          真实痛点
        </span>
      </div>

      <!-- 标题区 -->
      <h2 class="text-primary text-5xl font-bold leading-tight mb-[16px]" style="max-width: 900px;">
        三个最常见的<br />风格翻车现场
      </h2>
      <p class="text-secondary text-xl mb-[52px]">
        即使提示词写满品牌要求，AI 也可能在多次修改中逐渐偏离
      </p>

      <!-- 痛点卡片 1 -->
      <div class="flex gap-[28px] mb-[32px] p-[40px] rounded-3xl bg-background border border-border" style="min-height: 180px;">
        <div class="flex-shrink-0 w-[72px] h-[72px] rounded-2xl bg-accent4/15 flex items-center justify-center">
          <Icon name="icon-mask" class="size-[40px]" color="primary" />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-primary text-3xl font-bold mb-[10px]">风格漂移</h3>
          <p class="text-secondary text-xl leading-relaxed">
            第一页像科技发布会，第二页变咨询报告，第三页又成了活动海报。多轮对话中，AI 会悄悄忘记最初的品牌设定。
          </p>
        </div>
      </div>

      <!-- 痛点卡片 2 -->
      <div class="flex gap-[28px] mb-[32px] p-[40px] rounded-3xl bg-background border border-border" style="min-height: 180px;">
        <div class="flex-shrink-0 w-[72px] h-[72px] rounded-2xl bg-accent2/15 flex items-center justify-center">
          <Icon name="icon-loop" class="size-[40px]" color="primary" />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-primary text-3xl font-bold mb-[10px]">反复返工</h3>
          <p class="text-secondary text-xl leading-relaxed">
            某页颜色不对、Logo 位置偏移、字体不一致……每次都要重新描述规则，人工返工成本远超"AI 提效"的想象。
          </p>
        </div>
      </div>

      <!-- 痛点卡片 3 -->
      <div class="flex gap-[28px] p-[40px] rounded-3xl bg-background border border-border" style="min-height: 180px;">
        <div class="flex-shrink-0 w-[72px] h-[72px] rounded-2xl bg-accent5/15 flex items-center justify-center">
          <Icon name="icon-puzzle" class="size-[40px]" color="primary" />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-primary text-3xl font-bold mb-[10px]">品牌形象断裂</h3>
          <p class="text-secondary text-xl leading-relaxed">
            产品发布、季度汇报、客户提案……同一组织的输出物看起来像来自不同公司。品牌资产无法积累，每次都是"从零开始"。
          </p>
        </div>
      </div>
    </div>
  </DefaultContainer>
</template>
