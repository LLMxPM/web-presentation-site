<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'

const proofs = [
  { no: '01', text: 'flash 级模型可跑' },
  { no: '02', text: '组件·主题·资源复用' },
  { no: '03', text: '上下文由平台注入' },
]

const audience = ['个人创作者', '小团队', '频繁做汇报的打工人']
</script>

<template>
  <DefaultContainer>
    <main class="paper-bg relative flex h-full w-full flex-col overflow-hidden px-[64px] pb-[44px] pt-[48px] font-body text-primary">
      <!-- 氛围装饰层 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute right-6 top-6 size-[150px] rounded-full border-[3px] border-accent3/60" />
        <div class="absolute right-24 top-24 size-[64px] rounded-full border-[3px] border-accent4/50" />
        <div class="absolute bottom-[300px] left-8 size-[110px] rotate-45 rounded-[26px] border-[3px] border-accent1/30" />
        <Icon name="icon-sparkle" color="#C1B763" class="float-a absolute left-[468px] top-[128px] size-12" />
        <Icon name="icon-sparkle" color="#88A778" class="float-b absolute bottom-[320px] right-[76px] size-9" />
      </div>

      <!-- 顶部系列栏 -->
      <header class="rise relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-4 rounded-full border-[3px] border-primary bg-background px-6 py-2 shadow-hard-sm">
          <Icon name="icon-sparkle" color="#26382E" class="size-7" />
          <span class="text-lg font-extrabold tracking-[0.2em]">AI 效率指南</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold tracking-[0.3em] text-secondary">VOL.01</span>
          <span class="rounded-full bg-primary px-5 py-2 text-lg font-black tracking-widest text-invert">01/05</span>
        </div>
      </header>

      <!-- 低价账单贴纸：本篇记忆点 -->
      <div class="rise-1 relative z-10 mt-9 flex items-center gap-6 self-start">
        <div class="tilt-l float-a flex items-center gap-5 rounded-[26px] border-[3px] border-primary bg-accent4 px-7 py-4 shadow-hard">
          <Icon name="icon-tag" color="#FAF7EC" class="size-12" />
          <div class="leading-none">
            <p class="whitespace-nowrap text-base font-bold tracking-[0.3em] text-invert/85">实测账单</p>
            <p class="mt-3 whitespace-nowrap text-4xl font-black leading-none tracking-tight text-invert">10 页 &lt; ¥1</p>
          </div>
        </div>
        <div class="tilt-r flex items-center rounded-full border-[3px] border-primary bg-accent3 px-6 py-3 shadow-hard-sm">
          <span class="whitespace-nowrap text-xl font-black tracking-wide">低成本 ≠ 低质量</span>
        </div>
      </div>

      <!-- 主标题 -->
      <h1 class="rise-2 relative z-10 mt-9 font-heading text-[100px] font-black leading-[1.1] tracking-tight">
        AI 做演示，<br />不一定要<br />
        <span class="hl-gold">高成本</span>大模型
      </h1>

      <p class="rise-3 relative z-10 mt-6 text-xl font-medium leading-snug text-secondary">
        模型要求低、上下文由平台接管——小团队也能把 AI 放进日常创作流程
      </p>

      <!-- 三条判断线索 -->
      <div class="rise-4 relative z-10 mt-6 flex items-center gap-4">
        <template v-for="(p, i) in proofs" :key="p.no">
          <div class="flex items-center gap-2.5 whitespace-nowrap">
            <span class="font-code text-lg font-black text-accent4">{{ p.no }}</span>
            <span class="text-base font-bold">{{ p.text }}</span>
          </div>
          <span v-if="i < proofs.length - 1" class="h-6 w-[3px] rounded-full bg-primary/25" />
        </template>
      </div>

      <div class="relative z-10 min-h-0 flex-1" />

      <!-- 适合谁看 -->
      <section class="rise-5 relative z-10 flex items-center gap-6 rounded-[30px] border-[3px] border-primary bg-background-invert px-8 py-6 shadow-hard">
        <div class="flex size-[72px] shrink-0 items-center justify-center rounded-full border-[3px] border-invert/30 bg-accent3">
          <Icon name="icon-hat" color="#26382E" class="size-10" />
        </div>
        <div class="min-w-0">
          <p class="whitespace-nowrap text-base font-bold tracking-[0.3em] text-accent3">这篇适合谁看</p>
          <div class="mt-2.5 flex items-center gap-3">
            <span
              v-for="a in audience"
              :key="a"
              class="whitespace-nowrap rounded-full border-2 border-invert/35 px-4 py-1.5 text-base font-bold text-invert transition-colors duration-300 hover:border-accent3 hover:text-accent3"
            >{{ a }}</span>
          </div>
        </div>
      </section>

      <!-- 底部系列栏 -->
      <footer class="rise-5 relative z-10 mt-7 flex items-center justify-between border-t-[3px] border-primary/20 pt-4">
        <span class="text-base font-bold tracking-[0.22em] text-secondary">@web-presentation</span>
        <span class="flex items-center gap-2 text-base font-bold text-primary">
          左滑看完全篇
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
.hl-gold {
  background: linear-gradient(180deg, transparent 55%, var(--tw-color-accent3) 55%, var(--tw-color-accent3) 92%, transparent 92%);
  padding: 0 0.08em;
  box-decoration-break: clone;
}
.shadow-hard { box-shadow: 10px 10px 0 0 var(--tw-color-text-primary); }
.shadow-hard-sm { box-shadow: 6px 6px 0 0 var(--tw-color-text-primary); }
.tilt-l { transform: rotate(-3deg); }
.tilt-r { transform: rotate(2deg); }
@keyframes floaty {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}
.float-a { animation: floaty 5s ease-in-out infinite; }
.float-b { animation: floaty 6.5s ease-in-out 0.8s infinite; }
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
.rise-5 { animation-delay: 0.62s; }
</style>