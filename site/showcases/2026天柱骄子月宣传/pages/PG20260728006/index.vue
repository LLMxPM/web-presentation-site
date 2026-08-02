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

        <!-- 蓬莱峰天梯 -->
        <figure class="group relative mt-6">
          <AssetImage
            name="蓬莱峰天梯"
            alt="蓬莱峰天梯"
            fit="cover"
            position="center"
            class="h-[300px] w-full overflow-hidden rounded-2xl border border-border bg-background-subtle"
          />
          <figcaption class="absolute bottom-4 left-4 rounded-lg bg-background-invert/75 px-4 py-2 text-base font-semibold tracking-[0.2em] text-invert transition-colors duration-200 group-hover:bg-background-invert/90">
            蓬莱峰 · 通天之路
          </figcaption>
        </figure>

        <!-- 登峰 -->
        <section class="mt-5">
          <div class="flex items-center gap-3">
            <span class="h-[5px] w-8 shrink-0 bg-accent3-600"></span>
            <p class="shrink-0 text-base font-bold tracking-[0.3em] text-accent3-600">登通天蓬莱峰</p>
            <h2 class="text-3xl font-black">邂逅山河壮阔</h2>
          </div>
          <p class="mt-2.5 text-xl leading-relaxed text-secondary">
            石阶蜿蜒，直插云霄。亿万年峰丛经冰川剥蚀、流水切割，造就通天彻地的奇观——这是天柱山给你的真实震撼。
          </p>
        </section>

        <!-- 清凉 -->
        <section class="mt-5">
          <div class="flex items-center gap-3">
            <span class="h-[5px] w-8 shrink-0 bg-accent3-600"></span>
            <p class="shrink-0 text-base font-bold tracking-[0.3em] text-accent3-600">躲夏日酷暑</p>
            <h2 class="text-3xl font-black">独享18℃清凉</h2>
          </div>
          <p class="mt-2.5 text-xl leading-relaxed text-secondary">
            坐拥97%森林覆盖率，夏季均温恒定18℃–22℃。山林蔽日，溪涧潺潺，沉浸式吸氧纳凉，解锁夏日天然空调秘境。
          </p>
        </section>

        <!-- 收官邀约 -->
        <section class="mt-6 rounded-2xl bg-primary px-8 py-4 shadow-[0_14px_34px_rgba(13,40,106,0.3)]">
          <p class="text-lg font-bold tracking-[0.08em] text-accent3-300">6月9日 — 8月31日 · 84天师生免票期</p>
          <p class="mt-1 text-3xl font-black tracking-wide text-invert">我们在天柱山，等你来赴约</p>
        </section>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">09 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>