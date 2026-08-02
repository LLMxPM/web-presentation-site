<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col overflow-hidden bg-background-invert font-body text-invert">
      <!-- 竖排水印 -->
      <span class="pointer-events-none absolute -right-5 top-[190px] text-[220px] font-black leading-none text-white/[0.05] [writing-mode:vertical-rl]">须知</span>
      <!-- 朱砂印章 -->
      <div class="absolute right-[76px] top-[248px] z-10 rotate-6 rounded-xl bg-accent6 px-4 py-3 shadow-[0_10px_30px_rgba(197,0,60,0.4)] transition-transform duration-300 hover:rotate-12">
        <p class="text-3xl font-black leading-tight tracking-[0.2em]">必读</p>
      </div>

      <div class="relative z-10 flex flex-1 flex-col px-[72px] pt-[56px]">
        <!-- 页眉 -->
        <header class="flex items-start gap-6">
          <div class="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10">
            <span class="text-3xl font-black tracking-wider text-accent3-300">02</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-300">天柱骄子月 · 重要须知</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">出行前请确认</h1>
          </div>
        </header>

        <p class="mt-4 text-xl font-medium tracking-wide text-white/70">
          以下三件事，关系到能否顺利入园
        </p>

        <!-- 三条须知 -->
        <section class="mt-6 space-y-4">
          <div class="flex gap-5 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 transition-colors duration-200 hover:border-white/35">
            <span class="w-14 shrink-0 pt-1 text-3xl font-black leading-none text-accent3-300">01</span>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">现场购买旅游意外险</h2>
              <p class="mt-2 text-lg leading-relaxed text-white/80">
                所有免票人群需在游客中心现场购买<span class="font-bold text-accent3-300">5元/人</span>旅游意外险。
              </p>
            </div>
          </div>

          <div class="flex gap-5 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 transition-colors duration-200 hover:border-white/35">
            <span class="w-14 shrink-0 pt-1 text-3xl font-black leading-none text-accent3-300">02</span>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">非全日制学历不参与</h2>
              <p class="mt-2 text-lg leading-relaxed text-white/80">
                非全日制、函授、自考、网络教育、成人高考等非全日制学历群体，<span class="font-bold text-accent3-300">不参与</span>本次免票活动。
              </p>
            </div>
          </div>

          <div class="flex gap-5 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 transition-colors duration-200 hover:border-white/35">
            <span class="w-14 shrink-0 pt-1 text-3xl font-black leading-none text-accent3-300">03</span>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">证件必须真实有效</h2>
              <p class="mt-2 text-lg leading-relaxed text-white/80">
                入园需携带本人真实有效证件，严禁转借、冒用、伪造证件，一经查实将取消入园资格并依法追责。
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-white/15 px-[72px] py-4 text-base tracking-[0.25em] text-white/55">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-white/80">04 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>