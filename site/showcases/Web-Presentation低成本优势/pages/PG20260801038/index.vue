<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'

const pains = [
  { no: '01', icon: 'icon-hat', title: '模型要强', tag: '单价高', desc: '非顶配大模型不用', bubble: 'bg-accent4 text-invert', circle: 'bg-accent4' },
  { no: '02', icon: 'icon-doc', title: '提示词要长', tag: '消耗大', desc: '每页从零写需求背景', bubble: 'bg-accent5 text-invert', circle: 'bg-accent5' },
  { no: '03', icon: 'icon-loop', title: '多轮修改', tag: '反复烧钱', desc: '改一轮就烧一轮钱', bubble: 'bg-accent3 text-primary', circle: 'bg-accent3' },
  { no: '04', icon: 'icon-chart', title: '十几页就失控', tag: '费用失控', desc: '一套汇报账单不敢看', bubble: 'bg-accent1 text-invert', circle: 'bg-accent1' },
]
</script>

<template>
  <DefaultContainer>
    <main class="paper-bg relative flex h-full w-full flex-col overflow-hidden px-[64px] pb-[44px] pt-[48px] font-body text-primary">
      <!-- 氛围装饰层 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute right-6 top-6 size-[150px] rounded-full border-[3px] border-accent4/40" />
        <div class="absolute bottom-[330px] left-8 size-[96px] rotate-12 rounded-[24px] border-[3px] border-accent3/50" />
        <Icon name="icon-sparkle" color="#88A778" class="float-a absolute right-[90px] top-[240px] size-10" />
      </div>

      <!-- 顶部系列栏 -->
      <header class="rise relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-4 rounded-full border-[3px] border-primary bg-background px-6 py-2 shadow-hard-sm">
          <Icon name="icon-sparkle" color="#26382E" class="size-7" />
          <span class="text-lg font-extrabold tracking-[0.2em]">AI 效率指南</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold tracking-[0.3em] text-secondary">VOL.01</span>
          <span class="rounded-full bg-primary px-5 py-2 text-lg font-black tracking-widest text-invert">02/05</span>
        </div>
      </header>

      <!-- 标题 -->
      <h1 class="rise-1 relative z-10 mt-9 font-heading text-[64px] font-black leading-[1.1] tracking-tight">
        为什么你觉得 AI 做 PPT
        <span class="relative inline-block">
          <span class="circle-bg absolute inset-[-10px_-16px] rounded-[28px] bg-accent4/90" />
          <span class="relative text-invert">贵？</span>
        </span>
      </h1>
      <p class="rise-1 relative z-10 mt-4 text-lg font-medium text-secondary">
        不是模型用不起，是「每次从零开始」把成本叠起来了
      </p>

      <!-- 四张痛点卡片 -->
      <div class="rise-2 relative z-10 mt-8 grid grid-cols-2 gap-x-6 gap-y-9">
        <div
          v-for="p in pains"
          :key="p.no"
          class="relative rounded-[26px] border-[3px] border-primary bg-background px-6 py-5 shadow-hard-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hard"
        >
          <div :class="['absolute -right-4 -top-7 flex size-[72px] items-center justify-center rounded-full border-[3px] border-primary shadow-hard-sm', p.circle]">
            <Icon :name="p.icon" color="#FAF7EC" class="size-9" />
          </div>
          <div class="flex items-center gap-4 pr-16">
            <span class="font-code text-lg font-black text-secondary/70">{{ p.no }}</span>
            <span :class="['whitespace-nowrap rounded-full px-4 py-1 text-base font-bold', p.bubble]">{{ p.tag }}</span>
          </div>
          <h3 class="mt-3 whitespace-nowrap text-3xl font-black tracking-tight">{{ p.title }}</h3>
          <p class="mt-2 whitespace-nowrap text-lg font-medium text-secondary">{{ p.desc }}</p>
        </div>
      </div>

      <div class="relative z-10 min-h-0 flex-1" />

      <!-- 本页结论 -->
      <section class="rise-3 relative z-10 flex items-center gap-6 rounded-[26px] border-[3px] border-primary bg-background-invert px-8 py-5 shadow-hard">
        <div class="flex size-[68px] shrink-0 items-center justify-center rounded-full border-[3px] border-invert/30 bg-accent4">
          <Icon name="icon-loop" color="#FAF7EC" class="size-9" />
        </div>
        <p class="text-lg font-bold leading-snug text-invert">
          如果每次尝试都像一次高成本生产，AI 就很难真正进入日常创作流程。
        </p>
      </section>

      <!-- 底部系列栏 -->
      <footer class="rise-3 relative z-10 mt-7 flex items-center justify-between border-t-[3px] border-primary/20 pt-4">
        <span class="text-base font-bold tracking-[0.22em] text-secondary">@web-presentation</span>
        <span class="flex items-center gap-2 text-base font-bold text-primary">
          下一页：怎么把成本打下来
          <Icon name="icon-loop" color="#26382E" class="size-6" />
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
.circle-bg { transform: rotate(-3deg); }
@keyframes floaty {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}
.float-a { animation: floaty 5.5s ease-in-out infinite; }
@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
.rise, .rise-1, .rise-2, .rise-3 {
  animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rise-1 { animation-delay: 0.12s; }
.rise-2 { animation-delay: 0.26s; }
.rise-3 { animation-delay: 0.42s; }
</style>