<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import { useAssetBackground } from '@runtime-kit/public/composables/assets/useAssetBackground.v1'

const heroBg = useAssetBackground('天柱山奇峰云海')
</script>

<template>
  <DefaultContainer>
    <main class="relative h-full w-full overflow-hidden bg-background-invert font-body text-invert">
      <!-- 全屏背景图 -->
      <div class="absolute inset-0 h-full w-full bg-cover bg-center" :style="heroBg"></div>
      <!-- 顶部压暗 -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background-invert/75 to-transparent"></div>
      <!-- 底部海军蓝渐变，承载文字 -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-[860px] bg-gradient-to-t from-background-invert via-background-invert/85 to-transparent"></div>
      <!-- 漂移云雾氛围层 -->
      <div class="cloud-drift pointer-events-none absolute left-[-140px] top-[300px] h-[170px] w-[430px] rounded-full bg-white/10 blur-3xl"></div>
      <div class="cloud-drift-slow pointer-events-none absolute right-[-160px] top-[540px] h-[140px] w-[380px] rounded-full bg-white/10 blur-3xl"></div>

      <!-- 竖排系列名 -->
      <span class="absolute right-[64px] top-[176px] z-10 rounded-md border border-white/30 px-3 py-5 text-lg font-semibold tracking-[0.45em] text-white/85 [writing-mode:vertical-rl]">
        天柱骄子月
      </span>

      <!-- 内容层 -->
      <div class="relative z-10 flex h-full w-full flex-col px-[72px] pb-[56px] pt-[64px]">
        <header class="flex items-center justify-between">
          <span class="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-lg tracking-[0.2em] text-white/90">
            <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-accent3-400"></span>
            福利公告 · 夏日限定
          </span>
          <span class="whitespace-nowrap text-base tracking-[0.3em] text-white/70">TIANZHU · 2026</span>
        </header>

        <div class="flex-1"></div>

        <!-- 主标题区 -->
        <section>
          <p class="mb-5 text-2xl font-medium tracking-[0.22em] text-white/85">盛夏如约 · 福利相伴</p>
          <p class="mb-2 text-2xl font-bold tracking-[0.5em] text-accent3-400">2026</p>
          <div class="flex items-end gap-7">
            <h1 class="text-[132px] font-black leading-[1.05] tracking-tight">天柱骄子月</h1>
            <div class="mb-5 rotate-6 rounded-xl bg-accent6 px-5 py-4 shadow-[0_12px_36px_rgba(197,0,60,0.45)] transition-transform duration-300 hover:rotate-12">
              <p class="text-4xl font-black leading-tight tracking-[0.15em]">免票</p>
            </div>
          </div>
          <p class="mt-6 text-4xl font-bold tracking-[0.06em]">全国师生免票活动正式开启</p>
          <p class="mt-5 text-xl leading-relaxed tracking-[0.1em] text-white/75">
            这是天柱山夏日的温柔馈赠，为全国师生送上的最诚挚的山海邀约
          </p>
        </section>

        <!-- 日期信息卡 -->
        <section class="mt-8 grid grid-cols-[1.5fr_1fr] gap-5">
          <div class="flex flex-col justify-between rounded-2xl border border-white/25 bg-white/10 px-8 py-5 transition-colors duration-300 hover:border-white/50">
            <p class="text-base tracking-[0.35em] text-white/70">活动时间</p>
            <p class="mt-2 text-[40px] font-black leading-tight tracking-wide">6月9日 — 8月31日</p>
          </div>
          <div class="flex flex-col justify-between rounded-2xl border border-accent3-400/60 bg-accent3-400/15 px-8 py-5 transition-colors duration-300 hover:border-accent3-300">
            <p class="text-base tracking-[0.3em] text-accent3-300">超长福利期</p>
            <p class="mt-2 text-[40px] font-black leading-tight tracking-wide text-accent3-300">整整84天</p>
          </div>
        </section>

        <!-- 页脚 -->
        <footer class="mt-8 flex items-center justify-between border-t border-white/20 pt-5 text-base tracking-[0.3em] text-white/60">
          <span>天柱山 · 盛夏山海邀约</span>
          <span class="font-semibold text-white/75">左滑查看免票详情 →</span>
        </footer>
      </div>
    </main>
  </DefaultContainer>
</template>

<style scoped>
@keyframes cloud-drift {
  0% { transform: translateX(0); }
  50% { transform: translateX(150px); }
  100% { transform: translateX(0); }
}
.cloud-drift { animation: cloud-drift 16s ease-in-out infinite; }
.cloud-drift-slow { animation: cloud-drift 26s ease-in-out infinite reverse; }
</style>
