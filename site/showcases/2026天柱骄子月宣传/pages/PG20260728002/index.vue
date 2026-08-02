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
            <span class="text-3xl font-black tracking-wider text-accent3-400">03</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-600">天柱骄子月 · 入园指南</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">两种方式入园</h1>
          </div>
        </header>

        <!-- 奇观横幅 -->
        <figure class="group relative mt-6">
          <AssetImage
            name="天柱山日出云海"
            alt="天柱山日出云海"
            fit="cover"
            position="center"
            class="h-[220px] w-full overflow-hidden rounded-2xl border border-border bg-background-subtle"
          />
          <figcaption class="absolute bottom-4 left-4 rounded-lg bg-background-invert/75 px-4 py-2 text-base font-semibold tracking-[0.2em] text-invert transition-colors duration-200 group-hover:bg-background-invert/90">
            天柱山奇观 · 日出云海
          </figcaption>
        </figure>

        <!-- 方式一：线上预约 -->
        <section class="mt-6 rounded-2xl bg-primary px-7 py-4 shadow-[0_14px_34px_rgba(13,40,106,0.3)]">
          <div class="flex items-center gap-4">
            <span class="shrink-0 rounded-full bg-accent3-400 px-4 py-1 text-base font-black tracking-[0.15em] text-primary">优先推荐</span>
            <h2 class="text-3xl font-extrabold tracking-wide text-invert">方式一 · 线上预约</h2>
          </div>
          <ol class="mt-4 space-y-2.5">
            <li class="flex gap-4">
              <span class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-accent3-400 text-xl font-black text-primary transition-transform duration-200 hover:scale-110">1</span>
              <p class="text-lg leading-snug text-white/85">微信 / 支付宝搜索「天柱山旅游官方平台」小程序</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-accent3-400 text-xl font-black text-primary transition-transform duration-200 hover:scale-110">2</span>
              <p class="text-lg leading-snug text-white/85">门票预订通道 → 选择爬山入口 → 选「天柱骄子月」0元票 → 填写姓名、身份证号提交</p>
            </li>
            <li class="flex gap-4">
              <span class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-accent3-400 text-xl font-black text-primary transition-transform duration-200 hover:scale-110">3</span>
              <p class="text-lg leading-snug text-white/85">购票成功即预约成功，预约日带证件核验入园</p>
            </li>
          </ol>
        </section>

        <!-- 方式二：现场登记 -->
        <section class="mt-5 rounded-2xl border-2 border-border-subtle bg-background-subtle px-7 py-4 transition-colors duration-200 hover:border-accent3-600/50">
          <div class="flex items-center gap-4">
            <span class="shrink-0 rounded-full border-2 border-accent3-600 px-4 py-1 text-base font-black tracking-[0.15em] text-accent3-600">临时出游适配</span>
            <h2 class="text-3xl font-extrabold tracking-wide">方式二 · 现场登记</h2>
          </div>
          <p class="mt-3 text-lg leading-snug text-secondary">
            未提前线上预约的游客，前往天柱山游客中心各人工窗口，出示本人身份证及相关优惠证件，现场办理免费入园。
          </p>
        </section>

        <!-- 温馨提醒 -->
        <aside class="mt-5 rounded-r-2xl border-l-8 border-accent3-600 bg-accent3-600/10 px-6 py-3 transition-colors duration-200 hover:bg-accent3-600/15">
          <p class="text-xl font-semibold leading-snug text-primary">
            温馨提醒：暑期为客流高峰，建议提前线上购票预约
          </p>
        </aside>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">05 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>