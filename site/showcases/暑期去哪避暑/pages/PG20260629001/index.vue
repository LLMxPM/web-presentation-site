<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <!-- 顶部文字区 -->
      <div class="flex-shrink-0 px-[72px] pt-[80px]">
        <!-- 标签行 -->
        <p class="text-accent3-600 text-xl font-semibold tracking-[0.25em] mb-4">盛夏如约，福利相伴！</p>

        <!-- 主标题 -->
        <h1 class="text-primary text-7xl font-extrabold leading-tight">2026年</h1>
        <h1 class="text-primary text-7xl font-extrabold leading-tight mt-1">「天柱骄子月」</h1>

        <!-- 副标题 -->
        <p class="text-primary text-4xl font-semibold mt-8 mb-8">全国师生免票活动正式开启</p>

        <!-- 日期高亮条 -->
        <div class="flex items-center gap-4 flex-wrap">
          <div class="bg-primary rounded-2xl px-7 py-4">
            <p class="text-invert text-2xl font-bold tracking-wide">6月9日 — 8月31日</p>
          </div>
          <span class="text-accent4-600 text-4xl font-extrabold">84天</span>
          <span class="text-primary/50 text-xl">超长福利期</span>
        </div>

        <!-- 引言 -->
        <p class="text-primary/45 text-lg mt-8 leading-relaxed max-w-[750px]">
          这是天柱山夏日的温柔馈赠，为全国师生送上的最诚挚的山海邀约。
        </p>
      </div>

      <!-- 底部图片区 -->
      <div class="flex-1 px-[72px] pt-10 pb-[72px] min-h-0">
        <AssetImage
          name="天柱山奇峰云海"
          alt="天柱山奇峰云海"
          fit="cover"
          class="w-full h-full rounded-[40px] border-0 bg-transparent overflow-hidden"
        />
      </div>
    </div>
  </DefaultContainer>
</template>
