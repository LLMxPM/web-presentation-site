<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'

const modelJobs = ['理解结构', '生成代码', '改写内容', '调用组件', '调整样式']
const platformJobs = ['资产管理', '权限边界', '预览调试', '构建发布']
</script>

<template>
  <DefaultContainer>
    <main class="paper-bg relative flex h-full w-full flex-col overflow-hidden px-[64px] pb-[44px] pt-[48px] font-body text-primary">
      <!-- 氛围装饰层 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute right-6 top-6 size-[150px] rounded-full border-[3px] border-accent1/40" />
        <div class="absolute bottom-[240px] right-10 size-[88px] rotate-45 rounded-[22px] border-[3px] border-accent3/50" />
        <Icon name="icon-sparkle" color="#C1B763" class="float-a absolute left-[50px] top-[200px] size-10" />
      </div>

      <!-- 顶部系列栏 -->
      <header class="rise relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-4 rounded-full border-[3px] border-primary bg-background px-6 py-2 shadow-hard-sm">
          <Icon name="icon-sparkle" color="#26382E" class="size-7" />
          <span class="text-lg font-extrabold tracking-[0.2em]">AI 效率指南</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold tracking-[0.3em] text-secondary">VOL.01</span>
          <span class="rounded-full bg-primary px-5 py-2 text-lg font-black tracking-widest text-invert">05/05</span>
        </div>
      </header>

      <!-- 标题 -->
      <h1 class="rise-1 relative z-10 mt-7 font-heading text-[64px] font-black leading-[1.1] tracking-tight">
        低成本 <span class="text-accent4">≠</span> 低质量
      </h1>
      <p class="rise-1 relative z-10 mt-3 text-lg font-medium text-secondary">
        关键是分工——让模型做擅长的事，其余交给平台
      </p>

      <!-- 分工双栏 -->
      <section class="rise-2 relative z-10 mt-6 grid grid-cols-2 gap-6">
        <!-- 模型做 -->
        <div class="rounded-[26px] border-[3px] border-primary bg-accent1 px-7 py-5 text-invert shadow-hard-sm">
          <span class="inline-block whitespace-nowrap rounded-full border-2 border-invert/35 bg-invert/15 px-4 py-1 text-base font-bold">擅长的事</span>
          <h3 class="mt-2.5 flex items-center gap-3.5 text-2xl font-black">
            <Icon name="icon-sparkle" color="#FAF7EC" class="size-8" />
            模型做
          </h3>
          <ul class="mt-3.5 flex flex-col gap-2">
            <li v-for="j in modelJobs" :key="j" class="flex items-center gap-3.5">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-invert/20 text-base font-black">✓</span>
              <span class="whitespace-nowrap text-lg font-bold">{{ j }}</span>
            </li>
          </ul>
        </div>

        <!-- 平台管 -->
        <div class="rounded-[26px] border-[3px] border-primary bg-background-invert px-7 py-5 text-invert shadow-hard-sm">
          <span class="inline-block whitespace-nowrap rounded-full border-2 border-invert/35 bg-invert/15 px-4 py-1 text-base font-bold">稳稳接住</span>
          <h3 class="mt-2.5 flex items-center gap-3.5 text-2xl font-black">
            <Icon name="icon-clipboard" color="#FAF7EC" class="size-8" />
            平台管
          </h3>
          <ul class="mt-3.5 flex flex-col gap-2">
            <li v-for="j in platformJobs" :key="j" class="flex items-center gap-3.5">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-invert/20 text-base font-black">✓</span>
              <span class="whitespace-nowrap text-lg font-bold">{{ j }}</span>
            </li>
          </ul>
          <p class="mt-3 text-base font-medium text-invert/70">预览和构建，不占创作预算</p>
        </div>

        <!-- 中央贴纸 -->
        <div class="tilt-badge absolute left-1/2 top-1/2 z-10 flex size-[116px] items-center justify-center rounded-full border-[3px] border-primary bg-accent3 text-center text-lg font-black leading-tight shadow-hard-sm">
          各司<br />其职
        </div>
      </section>

      <!-- 最终结论 -->
      <section class="rise-3 relative z-10 mt-6 flex items-center gap-5 rounded-[26px] border-[3px] border-primary bg-accent3 px-8 py-4 shadow-hard">
        <Icon name="icon-sparkle" color="#26382E" class="size-9 shrink-0" />
        <p class="text-lg font-black leading-normal">
          web-presentation 围绕这个分工设计，让 AI 演示创作进入可持续使用阶段。
        </p>
      </section>

      <!-- 完结标记 -->
      <section class="rise-4 relative z-10 mt-5 flex flex-col items-center gap-2">
        <div class="flex items-center gap-4">
          <span class="h-[3px] w-16 rounded-full bg-primary/30" />
          <span class="whitespace-nowrap text-lg font-black tracking-[0.3em]">全篇完</span>
          <span class="h-[3px] w-16 rounded-full bg-primary/30" />
        </div>
        <p class="whitespace-nowrap text-base font-medium text-secondary">收藏这套卡片，下次做演示直接照着来</p>
      </section>

      <!-- 底部系列栏 -->
      <footer class="rise-4 relative z-10 mt-4 flex items-center justify-between border-t-[3px] border-primary/20 pt-3">
        <span class="text-base font-bold tracking-[0.22em] text-secondary">@web-presentation</span>
        <span class="flex items-center gap-2 text-base font-bold text-primary">
          关注我，下期见
          <Icon name="icon-sparkle" color="#26382E" class="size-6" />
        </span>
      </footer>
    </main>
  </DefaultContainer>
</template>

<style scoped>
.paper-bg {
  background-color: var(--tw-color-bg-default);
  background-image: radial-gradient(color-mix(in srgb, var(--tw-color-text-primary) 11%, transparent) 1.6px, transparent 1.6px);
  background-size: 30px 30px;
}
.shadow-hard { box-shadow: 10px 10px 0 0 var(--tw-color-text-primary); }
.shadow-hard-sm { box-shadow: 6px 6px 0 0 var(--tw-color-text-primary); }
.tilt-badge {
  transform: translate(-50%, -50%) rotate(-8deg);
}
@keyframes floaty {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}
.float-a { animation: floaty 5.5s ease-in-out infinite; }
@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
.rise, .rise-1, .rise-2, .rise-3, .rise-4 {
  animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rise-1 { animation-delay: 0.12s; }
.rise-2 { animation-delay: 0.24s; }
.rise-3 { animation-delay: 0.4s; }
.rise-4 { animation-delay: 0.52s; }
</style>