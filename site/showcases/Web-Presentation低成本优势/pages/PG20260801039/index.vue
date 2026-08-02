<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'

const caps = [
  { icon: 'icon-doc', text: '资源' },
  { icon: 'icon-blocks', text: '组件' },
  { icon: 'icon-palette', text: '主题' },
  { icon: 'icon-ruler', text: '样式' },
  { icon: 'icon-clipboard', text: '上下文注入' },
  { icon: 'icon-puzzle', text: '工具契约' },
]

const mechanisms = [
  { when: 'AI 知道项目、页面、资源边界', then: '不从零构造全部信息' },
  { when: '常用结构已经沉淀成组件', then: '选择、调用、调整' },
  { when: '主题和样式已经明确', then: '不必反复猜测风格' },
]
</script>

<template>
  <DefaultContainer>
    <main class="paper-bg relative flex h-full w-full flex-col overflow-hidden px-[64px] pb-[44px] pt-[48px] font-body text-primary">
      <!-- 氛围装饰层 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute right-6 top-6 size-[150px] rounded-full border-[3px] border-accent2/50" />
        <div class="absolute bottom-[300px] right-10 size-[90px] rotate-45 rounded-[22px] border-[3px] border-accent3/50" />
        <Icon name="icon-sparkle" color="#C1B763" class="float-a absolute left-[40px] top-[210px] size-10" />
      </div>

      <!-- 顶部系列栏 -->
      <header class="rise relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-4 rounded-full border-[3px] border-primary bg-background px-6 py-2 shadow-hard-sm">
          <Icon name="icon-sparkle" color="#26382E" class="size-7" />
          <span class="text-lg font-extrabold tracking-[0.2em]">AI 效率指南</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold tracking-[0.3em] text-secondary">VOL.01</span>
          <span class="rounded-full bg-primary px-5 py-2 text-lg font-black tracking-widest text-invert">03/05</span>
        </div>
      </header>

      <!-- 标题 -->
      <h1 class="rise-1 relative z-10 mt-7 font-heading text-[54px] font-black leading-[1.12] tracking-tight">
        不是把复杂度压给模型，<br />是把任务<span class="hl-gold">拆清楚</span>
      </h1>
      <p class="rise-1 relative z-10 mt-3 text-lg font-medium text-secondary">
        平台支持自定义模型——README 产品说明里的实测结论
      </p>

      <!-- 模型档位实测 -->
      <section class="rise-2 relative z-10 mt-5 rounded-[26px] border-[3px] border-primary bg-background px-8 py-3 shadow-hard-sm">
        <div class="flex items-center justify-between">
          <span class="whitespace-nowrap text-base font-black tracking-[0.25em]">模型档位实测</span>
          <span class="whitespace-nowrap text-base font-medium text-secondary">deepseek 系列 · 可自定义</span>
        </div>
        <div class="mt-2.5 flex flex-col gap-2">
          <div class="flex items-center gap-4">
            <span class="whitespace-nowrap rounded-full border-2 border-primary/25 bg-background-subtle px-5 py-0.5 font-code text-base font-bold">deepseek-V4-flash 级</span>
            <span class="text-xl font-black text-accent4">→</span>
            <span class="whitespace-nowrap rounded-full bg-accent1 px-5 py-0.5 text-base font-bold text-invert">跑得动 · 可用效果</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="whitespace-nowrap rounded-full border-2 border-primary/25 bg-background-subtle px-5 py-0.5 font-code text-base font-bold">deepseek-V4-pro 级</span>
            <span class="text-xl font-black text-accent4">→</span>
            <span class="whitespace-nowrap rounded-full bg-accent3 px-5 py-0.5 text-base font-bold text-primary">跑得不错 · 不错效果</span>
          </div>
        </div>
      </section>

      <!-- 平台能力 -->
      <section class="rise-3 relative z-10 mt-5">
        <div class="flex items-center gap-3">
          <Icon name="icon-blocks" color="#4F775A" class="size-7" />
          <span class="whitespace-nowrap text-xl font-black">平台把复杂度接住了</span>
          <span class="whitespace-nowrap text-base font-medium text-secondary">创作任务被拆成清楚的上下文</span>
        </div>
        <div class="mt-2.5 grid grid-cols-3 gap-2.5">
          <div
            v-for="c in caps"
            :key="c.text"
            class="flex items-center gap-3 rounded-2xl border-2 border-primary/25 bg-background px-4 py-1.5 transition-colors duration-300 hover:border-accent1 hover:bg-accent1/10"
          >
            <Icon :name="c.icon" color="#4F775A" class="size-7 shrink-0" />
            <span class="whitespace-nowrap text-base font-bold">{{ c.text }}</span>
          </div>
        </div>
      </section>

      <!-- 三个「当…就…」 -->
      <section class="rise-4 relative z-10 mt-4 flex flex-col gap-2">
        <div
          v-for="(m, i) in mechanisms"
          :key="m.when"
          class="flex items-center gap-4 rounded-2xl border-2 border-dashed border-primary/35 bg-background/70 px-6 py-2"
        >
          <span class="font-code text-base font-black text-accent4">{{ i + 1 }}</span>
          <span class="whitespace-nowrap text-base font-bold">当 {{ m.when }}</span>
          <span class="text-lg font-black text-accent4">→</span>
          <span class="whitespace-nowrap text-base font-black text-accent1">{{ m.then }}</span>
        </div>
      </section>

      <div class="relative z-10 min-h-0 flex-1" />

      <!-- 本页结论 -->
      <section class="rise-5 relative z-10 flex items-center gap-6 rounded-[26px] border-[3px] border-primary bg-background-invert px-8 py-4 shadow-hard">
        <div class="flex size-[68px] shrink-0 items-center justify-center rounded-full border-[3px] border-invert/30 bg-accent3">
          <Icon name="icon-sparkle" color="#26382E" class="size-9" />
        </div>
        <p class="text-lg font-bold leading-normal text-invert">
          减少无效生成和返工，降低对超大模型的依赖。
        </p>
      </section>

      <!-- 底部系列栏 -->
      <footer class="rise-5 relative z-10 mt-5 flex items-center justify-between border-t-[3px] border-primary/20 pt-3">
        <span class="text-base font-bold tracking-[0.22em] text-secondary">@web-presentation</span>
        <span class="flex items-center gap-2 text-base font-bold text-primary">
          下一页：实测成本
          <Icon name="icon-tag" color="#26382E" class="size-6" />
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
.hl-gold {
  background: linear-gradient(180deg, transparent 55%, var(--tw-color-accent3) 55%, var(--tw-color-accent3) 92%, transparent 92%);
  padding: 0 0.08em;
  box-decoration-break: clone;
}
.shadow-hard { box-shadow: 10px 10px 0 0 var(--tw-color-text-primary); }
.shadow-hard-sm { box-shadow: 6px 6px 0 0 var(--tw-color-text-primary); }
@keyframes floaty {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}
.float-a { animation: floaty 5.5s ease-in-out infinite; }
@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
.rise, .rise-1, .rise-2, .rise-3, .rise-4, .rise-5 {
  animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rise-1 { animation-delay: 0.12s; }
.rise-2 { animation-delay: 0.24s; }
.rise-3 { animation-delay: 0.36s; }
.rise-4 { animation-delay: 0.48s; }
.rise-5 { animation-delay: 0.6s; }
</style>