<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'

const titleChars = ['赤', '壁', '赋']
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full overflow-hidden bg-background-invert">
      <div aria-hidden="true" class="absolute inset-0 h-full w-full">
        <AssetImage name="chibi-cover-b8800ec0-1" fit="cover" class="h-full w-full" />
      </div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-[rgba(10,16,30,0.9)] via-[rgba(10,16,30,0.55)] to-[rgba(10,16,30,0.18)]"></div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-[rgba(10,16,30,0.72)] via-transparent to-[rgba(10,16,30,0.3)]"></div>
      <div class="relative z-10 flex h-full w-full flex-col px-[96px] py-[64px]">
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="h-[3px] w-[48px] bg-accent2"></span>
            <span class="text-[18px] tracking-[6px] text-invert">语文 · 古代诗文鉴赏</span>
          </div>
          <div class="flex items-center gap-4 text-[16px] tracking-[4px] text-accent2">
            <span>第三课时</span>
            <span class="h-[14px] w-px bg-accent2"></span>
            <span>文意深读 · 人生探讨</span>
          </div>
        </header>
        <main class="flex flex-1 items-center">
          <div class="flex items-center gap-14">
            <div class="flex flex-col items-center gap-5">
              <span v-for="c in titleChars" :key="c" class="font-heading text-[52px] leading-none text-invert">{{ c }}</span>
            </div>
            <div class="h-[240px] w-px bg-accent2"></div>
            <div class="flex flex-col">
              <p class="text-[22px] tracking-[10px] text-accent2">北宋 · 苏轼</p>
              <h1 class="mt-6 font-heading text-[124px] leading-[1.06] tracking-[12px] text-invert">赤壁赋</h1>
              <p class="mt-9 text-[26px] leading-relaxed tracking-[2px] text-invert">深入鉴赏课 —— 探讨苏轼的人生观与宇宙观</p>
              <p class="mt-3 text-[19px] tracking-[3px] text-invert">融情于景 · 善于取譬 · 景情理交融</p>
            </div>
          </div>
        </main>
        <footer class="flex items-end justify-between">
          <div class="flex items-center gap-5">
            <span class="flex h-[58px] w-[58px] items-center justify-center bg-accent3 font-heading text-[30px] text-invert">赋</span>
            <div class="flex flex-col gap-1">
              <span class="text-[17px] tracking-[2px] text-invert">元丰五年 · 月夜泛舟赤壁</span>
              <span class="text-[15px] tracking-[2px] text-accent2">贬谪黄州时期的旷达之作</span>
            </div>
          </div>
          <div class="flex items-center gap-3 text-[20px] tracking-[3px] text-accent2">
            <span>乐</span>
            <span class="h-px w-[40px] bg-accent2"></span>
            <span>悲</span>
            <span class="h-px w-[40px] bg-accent2"></span>
            <span>乐</span>
          </div>
        </footer>
      </div>
    </div>
  </DefaultContainer>
</template>