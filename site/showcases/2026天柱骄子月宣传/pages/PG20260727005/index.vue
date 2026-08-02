<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-primary">
      <!-- 竖排山水水印 -->
      <span class="pointer-events-none absolute -right-6 bottom-[150px] text-[230px] font-black leading-none text-primary/[0.04] [writing-mode:vertical-rl]">山川</span>

      <div class="relative z-10 flex flex-1 flex-col px-[72px] pt-[56px]">
        <!-- 页眉 -->
        <header class="flex items-start gap-6">
          <div class="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_10px_28px_rgba(13,40,106,0.28)]">
            <span class="text-3xl font-black tracking-wider text-accent3-400">01</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-600">天柱骄子月 · 免票范围</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">两大核心景区全免</h1>
          </div>
        </header>

        <p class="mt-4 text-xl font-medium tracking-wide text-secondary">
          活动期间门票全免 · 纯粹福利 · 不设门槛
        </p>

        <!-- 景区卡片 -->
        <section class="mt-6 space-y-4">
          <div class="flex items-center gap-6 rounded-2xl border border-border-subtle bg-background-subtle px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <span class="shrink-0 text-5xl font-black text-accent3-600/70">壹</span>
            <div class="min-w-0 flex-1">
              <h2 class="text-3xl font-extrabold">天柱山主峰景区</h2>
              <p class="mt-1 text-xl leading-relaxed text-secondary">登临千米奇峰，俯瞰群山辽阔</p>
            </div>
            <span class="shrink-0 rounded-full bg-primary px-4 py-1.5 text-base font-bold tracking-[0.2em] text-invert">免票</span>
          </div>
          <div class="flex items-center gap-6 rounded-2xl border border-border-subtle bg-background-subtle px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <span class="shrink-0 text-5xl font-black text-accent3-600/70">贰</span>
            <div class="min-w-0 flex-1">
              <h2 class="text-3xl font-extrabold">山谷流泉文化园</h2>
              <p class="mt-1 text-xl leading-relaxed text-secondary">漫步千年文脉，触摸人文底蕴</p>
            </div>
            <span class="shrink-0 rounded-full bg-primary px-4 py-1.5 text-base font-bold tracking-[0.2em] text-invert">免票</span>
          </div>
        </section>

        <!-- 实景图 -->
        <figure class="group relative mt-6">
          <AssetImage
            name="山谷流泉文化园实景"
            alt="山谷流泉文化园实景"
            fit="cover"
            position="center"
            class="h-[280px] w-full overflow-hidden rounded-2xl border border-border bg-background-subtle"
          />
          <figcaption class="absolute bottom-4 left-4 rounded-lg bg-background-invert/75 px-4 py-2 text-base font-semibold tracking-[0.2em] text-invert transition-colors duration-200 group-hover:bg-background-invert/90">
            山谷流泉文化园 · 千年文脉实景
          </figcaption>
        </figure>

        <!-- 温馨提示 -->
        <aside class="mt-6 rounded-r-2xl border-l-8 border-accent3-600 bg-accent3-600/10 px-6 py-4 transition-colors duration-200 hover:bg-accent3-600/15">
          <p class="text-xl font-black tracking-[0.2em] text-accent3-600">温馨提示</p>
          <p class="mt-1 text-lg leading-relaxed text-primary">景区交通、索道等二次消费项目需自理，建议提前规划出游路线。</p>
        </aside>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">02 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>
