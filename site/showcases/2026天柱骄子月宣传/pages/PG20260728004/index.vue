<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-primary">
      <!-- 竖排水印 -->
      <span class="pointer-events-none absolute -right-6 bottom-[150px] text-[230px] font-black leading-none text-primary/[0.04] [writing-mode:vertical-rl]">畅行</span>

      <div class="relative z-10 flex flex-1 flex-col px-[72px] pt-[56px]">
        <!-- 页眉 -->
        <header class="flex items-start gap-6">
          <div class="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_10px_28px_rgba(13,40,106,0.28)]">
            <span class="text-3xl font-black tracking-wider text-accent3-400">04</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-600">天柱骄子月 · 交通出行</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">直通车与普速</h1>
          </div>
        </header>

        <!-- 官方旅游直通车 -->
        <section class="mt-6 rounded-2xl bg-primary px-7 py-3 shadow-[0_14px_34px_rgba(13,40,106,0.3)]">
          <div class="flex items-center gap-4">
            <span class="shrink-0 rounded-full bg-accent3-400 px-4 py-1 text-base font-black tracking-[0.15em] text-primary">官方接驳</span>
            <h2 class="text-3xl font-extrabold tracking-wide text-invert">旅游直通车</h2>
          </div>
          <div class="mt-4 space-y-2.5">
            <div class="flex items-baseline gap-4">
              <span class="w-24 shrink-0 text-base font-bold tracking-[0.2em] text-accent3-300">上车点</span>
              <p class="text-lg leading-snug text-white/90">潜山站出站左转20米 · 天柱山旅游集散中心</p>
            </div>
            <div class="flex items-baseline gap-4">
              <span class="w-24 shrink-0 text-base font-bold tracking-[0.2em] text-accent3-300">票价</span>
              <p class="text-lg leading-snug text-white/90">10元/人</p>
            </div>
            <div class="flex items-baseline gap-4">
              <span class="w-24 shrink-0 text-base font-bold tracking-[0.2em] text-accent3-300">终点</span>
              <p class="text-lg leading-snug text-white/90">天柱山茶庄游客中心（景区主入口）</p>
            </div>
          </div>
        </section>

        <!-- 普速列车 -->
        <section class="mt-4 rounded-2xl border-2 border-border-subtle bg-background-subtle px-7 py-3 transition-colors duration-200 hover:border-accent3-600/50">
          <div class="flex items-center gap-4">
            <span class="shrink-0 rounded-full border-2 border-accent3-600 px-4 py-1 text-base font-black tracking-[0.1em] text-accent3-600">天柱山站 · 合肥方向</span>
            <h2 class="text-3xl font-extrabold tracking-wide">普速列车直达</h2>
          </div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-4">
              <span class="w-[104px] shrink-0 rounded-lg border border-primary/25 bg-primary/10 py-1 text-center font-code text-lg font-bold leading-none text-primary">K611</span>
              <p class="text-lg leading-none text-secondary">02:42 → 05:27</p>
              <span class="ml-auto whitespace-nowrap text-base font-semibold text-accent3-600">2小时45分</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="w-[104px] shrink-0 rounded-lg border border-primary/25 bg-primary/10 py-1 text-center font-code text-lg font-bold leading-none text-primary">K8451</span>
              <p class="text-lg leading-none text-secondary">11:49 → 14:45</p>
              <span class="ml-auto whitespace-nowrap text-base font-semibold text-accent3-600">2小时56分</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="w-[104px] shrink-0 rounded-lg border border-primary/25 bg-primary/10 py-1 text-center font-code text-lg font-bold leading-none text-primary">T221</span>
              <p class="text-lg leading-none text-secondary">18:50 → 21:37</p>
              <span class="ml-auto whitespace-nowrap text-base font-semibold text-accent3-600">2小时47分</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="w-[104px] shrink-0 rounded-lg border border-primary/25 bg-primary/10 py-1 text-center font-code text-lg font-bold leading-none text-primary">K1071</span>
              <p class="text-lg leading-none text-secondary">13:08 → 15:42</p>
              <span class="ml-auto whitespace-nowrap text-base font-semibold text-accent3-600">2小时34分</span>
            </div>
          </div>
          <p class="mt-2.5 text-base leading-relaxed text-secondary/85">南京、上海、杭州方向乘坐普速列车，推荐合肥站中转。</p>
        </section>

        <!-- 温馨服务 -->
        <aside class="mt-4 rounded-r-2xl border-l-8 border-accent3-600 bg-accent3-600/10 px-7 py-3 transition-colors duration-200 hover:bg-accent3-600/15">
          <h2 class="text-2xl font-black tracking-[0.15em] text-accent3-600">温馨服务</h2>
          <div class="mt-3 space-y-2 text-lg leading-snug text-primary">
            <p>12306 官方网站 / APP 可预约车站重点旅客服务</p>
            <p>潜山站服务台：<span class="font-code font-bold">0556-5165410</span></p>
            <p>潜山站「宜行」雷锋服务站 · 为您的旅途排忧解难</p>
          </div>
        </aside>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">07 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>