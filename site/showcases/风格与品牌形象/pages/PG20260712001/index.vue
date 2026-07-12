<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue';
import ThemeLogo from '@runtime-kit/public/components/primitives/ThemeLogo.v1.vue';
</script>

<template>
  <DefaultContainer>
    <div class="h-full w-full flex flex-col bg-background">
      <!-- 上部：深绿区域 -->
      <div class="relative w-full flex flex-col justify-center bg-background-invert px-[72px] pt-[80px] pb-[64px]" style="height: 820px;">
        <!-- 装饰色块 -->
        <div class="absolute top-[100px] right-[72px] w-[120px] h-[120px] rounded-full bg-accent1/20" />
        <div class="absolute bottom-[80px] right-[180px] w-[80px] h-[80px] rounded-full bg-accent3/25" />
        <div class="absolute top-[260px] left-[90px] w-[56px] h-[56px] rounded-full bg-accent4/30" />

        <!-- 标签 -->
        <div class="relative z-10 mb-[48px]">
          <span class="inline-block px-[28px] py-[10px] rounded-full border border-white/30 text-white text-base font-medium tracking-wider">
            品牌一致性
          </span>
        </div>

        <!-- 主标题 -->
        <h1 class="relative z-10 text-white text-5xl font-bold leading-tight mb-[32px]" style="max-width: 800px;">
          企业风格和品牌形象<br />不该靠反复提醒 AI<br />来维持
        </h1>

        <!-- 金句 -->
        <p class="relative z-10 text-white/70 text-2xl leading-relaxed" style="max-width: 880px;">
          把品牌约束沉淀为平台资产，<br />让 AI 在规则内创作，而不是在提示词里反复描述。
        </p>
      </div>

      <!-- 下部：米白区域 -->
      <div class="flex-1 flex flex-col justify-center px-[72px] py-[60px]">
        <p class="text-secondary text-2xl leading-relaxed mb-[36px]" style="max-width: 860px;">
          用 AI 做演示文稿时，风格不稳定是最常见的痛点——<br />第一页像科技发布会，第二页变咨询报告，第三页又像活动海报。
        </p>
        <div class="flex items-center gap-[16px]">
          <ThemeLogo :size="24" />
          <div class="flex flex-col gap-[4px]">
            <span class="text-secondary text-xl">web-presentation</span>
            <span class="text-secondary text-xl">品牌约束驱动的 AI 创作平台</span>
            <span class="text-secondary/50 text-base">GitHub 开源项目 · 可自由部署与二次开发</span>
          </div>
        </div>
      </div>
    </div>
  </DefaultContainer>
</template>
