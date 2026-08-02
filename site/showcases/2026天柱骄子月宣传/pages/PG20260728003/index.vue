<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-primary">
      <!-- 竖排水印 -->
      <span class="pointer-events-none absolute -right-6 bottom-[150px] text-[230px] font-black leading-none text-primary/[0.04] [writing-mode:vertical-rl]">驰骋</span>

      <div class="relative z-10 flex flex-1 flex-col px-[72px] pt-[56px]">
        <!-- 页眉 -->
        <header class="flex items-start gap-6">
          <div class="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_10px_28px_rgba(13,40,106,0.28)]">
            <span class="text-3xl font-black tracking-wider text-accent3-400">04</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-600">天柱骄子月 · 交通出行</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">高铁直达潜山站</h1>
          </div>
        </header>

        <!-- 潜山站夜景 -->
        <figure class="group relative mt-6">
          <AssetImage
            name="潜山站航拍夜景"
            alt="潜山站航拍夜景"
            fit="cover"
            position="center"
            class="h-[180px] w-full overflow-hidden rounded-2xl border border-border bg-background-subtle"
          />
          <figcaption class="absolute bottom-4 left-4 rounded-lg bg-background-invert/75 px-4 py-2 text-base font-semibold tracking-[0.2em] text-invert transition-colors duration-200 group-hover:bg-background-invert/90">
            潜山站 · 航拍夜景
          </figcaption>
        </figure>

        <!-- 四大方向车次 -->
        <section class="mt-6 space-y-3">
          <div class="rounded-2xl border border-border-subtle bg-background-subtle px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-extrabold">合肥方向</h2>
              <span class="rounded-full bg-primary px-4 py-1 text-base font-bold tracking-wider text-invert">全程约1小时</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2795</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2697</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G8393</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G8395</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G3083</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G8397</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2595</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2693</span>
            </div>
          </div>

          <div class="rounded-2xl border border-border-subtle bg-background-subtle px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-extrabold">上海方向</h2>
              <span class="rounded-full bg-primary px-4 py-1 text-base font-bold tracking-wider text-invert">约4小时30分</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G7080</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">D2216</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">D3090</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G3822</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G1464</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G7592</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2818</span>
            </div>
          </div>

          <div class="rounded-2xl border border-border-subtle bg-background-subtle px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-extrabold">南京方向</h2>
              <span class="rounded-full bg-primary px-4 py-1 text-base font-bold tracking-wider text-invert">全程约2小时</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2781</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G7081</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">D2217</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">D3091</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G3828</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G1465</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">D3193</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">D3187</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G7593</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G2819</span>
            </div>
          </div>

          <div class="rounded-2xl border border-border-subtle bg-background-subtle px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-extrabold">杭州方向</h2>
              <span class="rounded-full bg-primary px-4 py-1 text-base font-bold tracking-wider text-invert">全程约3小时</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G7436</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G1437</span>
              <span class="rounded-full border border-border-subtle bg-background px-3 py-0.5 font-code text-base leading-none text-secondary transition-colors duration-150 hover:border-primary hover:text-primary">G7592</span>
            </div>
          </div>
        </section>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">06 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>