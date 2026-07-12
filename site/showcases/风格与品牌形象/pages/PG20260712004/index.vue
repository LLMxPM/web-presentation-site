<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue';
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue';
</script>

<template>
  <DefaultContainer>
    <div class="h-full w-full flex flex-col bg-background px-[72px] pt-[56px] pb-[48px]">
      <!-- 标签行 -->
      <div class="mb-[16px]">
        <span class="inline-block px-[24px] py-[8px] rounded-full bg-accent4/10 text-accent4-700 text-base font-semibold tracking-wide">
          关键区别
        </span>
      </div>

      <!-- 标题区 -->
      <h2 class="text-primary text-5xl font-bold leading-tight mb-[8px]">
        不是"套模板"，<br />而是"自定义品牌约束"
      </h2>
      <p class="text-secondary text-xl mb-[36px]">
        两条路线，完全不同的创作逻辑
      </p>

      <!-- 两栏对比 -->
      <div class="grid grid-cols-2 gap-[24px] flex-1">
        <!-- 左侧：传统套模板 -->
        <div class="rounded-3xl border-2 border-border bg-background-subtle p-[32px] flex flex-col">
          <div class="w-[48px] h-[48px] rounded-xl bg-accent4/15 flex items-center justify-center mb-[16px]">
            <Icon name="icon-clipboard" class="size-[28px]" color="primary" />
          </div>
          <h3 class="text-primary text-2xl font-bold mb-[16px]">传统"套模板"</h3>
          <ul class="space-y-[12px] text-secondary text-lg leading-relaxed">
            <li class="flex items-start gap-[8px]">
              <span class="text-accent4 flex-shrink-0 mt-[4px]">✕</span>
              <span>在固定版式里替换标题、正文和图片</span>
            </li>
            <li class="flex items-start gap-[8px]">
              <span class="text-accent4 flex-shrink-0 mt-[4px]">✕</span>
              <span>容易千篇一律，缺乏品牌辨识度</span>
            </li>
            <li class="flex items-start gap-[8px]">
              <span class="text-accent4 flex-shrink-0 mt-[4px]">✕</span>
              <span>想表达品牌调性需要大量手工调整</span>
            </li>
            <li class="flex items-start gap-[8px]">
              <span class="text-accent4 flex-shrink-0 mt-[4px]">✕</span>
              <span>风格依赖单次提示词，无法持续积累</span>
            </li>
          </ul>
        </div>

        <!-- 右侧：web-presentation -->
        <div class="rounded-3xl border-2 border-accent2/30 bg-accent2/5 p-[32px] flex flex-col">
          <div class="w-[48px] h-[48px] rounded-xl bg-accent2/20 flex items-center justify-center mb-[16px]">
            <Icon name="icon-sparkle" class="size-[28px]" color="primary" />
          </div>
          <h3 class="text-primary text-2xl font-bold mb-[16px]">品牌约束驱动</h3>
          <ul class="space-y-[12px] text-secondary text-lg leading-relaxed">
            <li class="flex items-start gap-[8px]">
              <span class="text-accent2 flex-shrink-0 mt-[4px]">✓</span>
              <span>品牌色、字体、Logo 作为平台资产统一维护</span>
            </li>
            <li class="flex items-start gap-[8px]">
              <span class="text-accent2 flex-shrink-0 mt-[4px]">✓</span>
              <span>封面、数据页、章节页各有表达但服从同一规则</span>
            </li>
            <li class="flex items-start gap-[8px]">
              <span class="text-accent2 flex-shrink-0 mt-[4px]">✓</span>
              <span>高频页面沉淀为组件，多页复用保持一致</span>
            </li>
            <li class="flex items-start gap-[8px]">
              <span class="text-accent2 flex-shrink-0 mt-[4px]">✓</span>
              <span>品牌资产随团队需求演进，不依赖单次提示词</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部金句 -->
      <div class="mt-[32px] py-[20px] px-[32px] rounded-2xl bg-background-invert/5 border border-border">
        <p class="text-primary text-xl font-semibold text-center">
          把约束交给团队自定义，让 AI 在规则内生成，而不是从通用模板里抽一套。
        </p>
      </div>
    </div>
  </DefaultContainer>
</template>
