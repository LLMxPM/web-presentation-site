<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col overflow-hidden bg-background font-body text-primary">
      <!-- 竖排水印 -->
      <span class="pointer-events-none absolute -right-6 bottom-[150px] text-[230px] font-black leading-none text-primary/[0.04] [writing-mode:vertical-rl]">骄子</span>

      <div class="relative z-10 flex flex-1 flex-col px-[72px] pt-[56px]">
        <!-- 页眉 -->
        <header class="flex items-start gap-6">
          <div class="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_10px_28px_rgba(13,40,106,0.28)]">
            <span class="text-3xl font-black tracking-wider text-accent3-400">02</span>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-base font-bold tracking-[0.4em] text-accent3-600">天柱骄子月 · 免票人群</p>
            <h1 class="mt-2 text-5xl font-black leading-tight">谁可以免票？</h1>
          </div>
        </header>

        <p class="mt-4 text-xl font-medium tracking-wide text-secondary">
          以下四类人群，带齐对应证件即可免票入园
        </p>

        <!-- 四类人群 -->
        <section class="mt-6 space-y-3">
          <div class="flex items-center gap-5 rounded-2xl border border-border-subtle bg-background-subtle px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-accent3-400">一</div>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">18周岁及以下未成年人</h2>
              <p class="mt-2 text-lg leading-relaxed text-secondary">
                核验材料：<span class="font-bold text-primary">本人有效实体身份证</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-5 rounded-2xl border border-border-subtle bg-background-subtle px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-accent3-400">二</div>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">全日制在校生</h2>
              <p class="mt-2 text-lg leading-relaxed text-secondary">
                核验材料：<span class="font-bold text-primary">身份证 + 学生证</span>（或学信网验证报告）
              </p>
              <p class="mt-1.5 text-base tracking-wide text-secondary/80">覆盖全日制本科、高职、专科、研究生</p>
            </div>
          </div>

          <div class="flex items-center gap-5 rounded-2xl border border-border-subtle bg-background-subtle px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-accent3-400">三</div>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">2026年应届中、高考考生</h2>
              <p class="mt-2 text-lg leading-relaxed text-secondary">
                核验材料：<span class="font-bold text-primary">本人身份证 + 准考证</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-5 rounded-2xl border border-border-subtle bg-background-subtle px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,40,106,0.14)]">
            <div class="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-accent3-400">四</div>
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-extrabold leading-snug">全国在职教师</h2>
              <p class="mt-2 text-lg leading-relaxed text-secondary">
                核验材料：<span class="font-bold text-primary">本人身份证 + 教师资格证</span>
              </p>
            </div>
          </div>
        </section>

        <!-- 翻页提示 -->
        <aside class="mt-6 flex items-center gap-4 rounded-2xl border border-accent3-600/40 bg-accent3-600/10 px-6 py-3 transition-colors duration-200 hover:bg-accent3-600/15">
          <span class="shrink-0 text-2xl font-black text-accent3-600">⚠</span>
          <p class="text-xl font-semibold tracking-wide text-primary">出发前必看下一页「重要须知」</p>
        </aside>
      </div>

      <!-- 页脚 -->
      <footer class="relative z-10 flex items-center justify-between border-t border-border px-[72px] py-4 text-base tracking-[0.25em] text-secondary">
        <span>2026 天柱骄子月 · 全国师生免票</span>
        <span class="font-bold text-primary">03 / 09</span>
      </footer>
    </main>
  </DefaultContainer>
</template>
