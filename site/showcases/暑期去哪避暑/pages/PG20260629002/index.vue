<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <!-- 顶部区域：编号 + 标题 + 卡片 -->
      <div class="flex-shrink-0 px-[72px] pt-[80px]">
        <!-- 编号 -->
        <p class="text-accent3-600 text-4xl font-extrabold tracking-wider mb-2">01</p>
        <!-- 标题 -->
        <h2 class="text-primary text-5xl font-bold mb-8">免票范围</h2>

        <!-- 说明文字 -->
        <p class="text-primary/60 text-xl mb-8 leading-relaxed">
          活动期间，天柱山两大核心景区门票全免，纯粹福利，不设门槛：
        </p>

        <!-- 景区卡片 1 -->
        <div class="bg-background-subtle rounded-2xl px-8 py-6 mb-5 border border-border/50">
          <h3 class="text-primary text-3xl font-bold mb-2">⛰ 天柱山主峰景区</h3>
          <p class="text-primary/55 text-xl leading-relaxed">登临千米奇峰，俯瞰群山辽阔。</p>
        </div>

        <!-- 景区卡片 2 -->
        <div class="bg-background-subtle rounded-2xl px-8 py-6 mb-8 border border-border/50">
          <h3 class="text-primary text-3xl font-bold mb-2">🏛 山谷流泉文化园</h3>
          <p class="text-primary/55 text-xl leading-relaxed">漫步千年文脉，触摸古今人文底蕴。</p>
        </div>

        <!-- 温馨提示 -->
        <div class="flex items-start gap-3 bg-accent3-600/8 rounded-2xl px-7 py-5 mb-8">
          <span class="text-accent3-600 text-xl font-bold whitespace-nowrap mt-0.5">温馨提示</span>
          <p class="text-primary/55 text-lg leading-relaxed">
            景区交通、索道等二次消费项目需自理，建议大家提前规划出游路线，轻松畅游山野。
          </p>
        </div>
      </div>

      <!-- 底部图片 -->
      <div class="flex-1 px-[72px] pb-[72px] min-h-0">
        <AssetImage
          name="山谷流泉文化园实景"
          alt="山谷流泉文化园实景"
          fit="cover"
          class="w-full h-full rounded-[40px] border-0 bg-transparent overflow-hidden"
        />
      </div>
    </div>
  </DefaultContainer>
</template>
