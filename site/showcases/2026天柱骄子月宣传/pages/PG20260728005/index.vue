<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-primary">
      <div class="relative z-10 flex flex-1 flex-col px-[72px] pt-[56px]">
        <!-- 页眉 -->
        <header class="flex items-start gap-6">
          <div class="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_10px_28px_rgba(13,40,106,0.28)]">
            <span class="text-3xl font-black tracking-wider text-accent3-400">05</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-600">天柱骄子月 · 奔赴天柱山</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">奔赴天柱山</h1>
          </div>
        </header>

        <p class="mt-4 text-xl font-semibold tracking-[0.15em] text-accent3-600">
          解锁夏日限定山野浪漫
        </p>

        <!-- 云海风光 -->
        <figure class="group relative mt-6">
          <AssetImage
            name="天柱山云海风光"
            alt="天柱山云海风光"
            fit="cover"
            position="center"
            class="h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-background-subtle"
          />
          <figcaption class="absolute bottom-4 left-4 rounded-lg bg-background-invert/75 px-4 py-2 text-base font-semibold tracking-[0.2em] text-invert transition-colors duration-200 group-hover:bg-background-invert/90">
            天柱山奇观 · 云海
          </figcaption>
        </figure>

        <!-- 云海之约 -->
        <section class="mt-6">
          <div class="flex items-center gap-3">
            <span class="h-[5px] w-8 shrink-0 bg-accent3-600"></span>
            <p class="shrink-0 text-base font-bold tracking-[0.3em] text-accent3-600">赴一场云海之约</p>
            <h2 class="text-3xl font-black">邂逅人间仙境</h2>
          </div>
          <p class="mt-2.5 text-xl leading-relaxed text-secondary">
            立于天池峰、漫步青龙背，看层层流云如瀑布般奔涌，穿梭于奇峰峻岭之间。云雾漫卷，山河辽阔，每一步都仿佛置身于缥缈仙境之中。
          </p>
        </section>

        <!-- 千年文脉 -->
        <section class="mt-6">
          <div class="flex items-center gap-3">
            <span class="h-[5px] w-8 shrink-0 bg-accent3-600"></span>
            <p class="shrink-0 text-base font-bold tracking-[0.3em] text-accent3-600">寻千年文脉</p>
            <h2 class="text-3xl font-black">品读山水诗韵</h2>
          </div>
          <p class="mt-2.5 text-xl leading-relaxed text-secondary">
            触摸山谷流泉千年石刻，品读王安石留下的笔墨沧桑；登临奇峰，读懂李白「奇峰出奇云」、白居易「天柱一峰擎日月」的意境。这座山，本身就是一部立体的文学史。
          </p>
        </section>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">08 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>