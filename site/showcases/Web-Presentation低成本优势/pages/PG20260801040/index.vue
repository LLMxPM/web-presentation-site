<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'

const rows = [
  { k: '项目', v: 'AI 演示 PPT' },
  { k: '数量', v: '10 页' },
  { k: '模型', v: 'flash 级即可' },
  { k: '多轮修改', v: '已包含' },
]

const scenes = ['频繁汇报', '报告页', '图文卡片', '专题内容']
</script>

<template>
  <DefaultContainer>
    <main class="paper-bg relative flex h-full w-full flex-col overflow-hidden px-[64px] pb-[44px] pt-[48px] font-body text-primary">
      <!-- 氛围装饰层 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute right-6 top-6 size-[150px] rounded-full border-[3px] border-accent3/60" />
        <div class="absolute bottom-[280px] left-8 size-[96px] rotate-45 rounded-[24px] border-[3px] border-accent4/40" />
        <Icon name="icon-sparkle" color="#C1B763" class="float-a absolute left-[60px] top-[190px] size-10" />
        <Icon name="icon-sparkle" color="#88A778" class="float-b absolute right-[70px] top-[330px] size-8" />
      </div>

      <!-- 顶部系列栏 -->
      <header class="rise relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-4 rounded-full border-[3px] border-primary bg-background px-6 py-2 shadow-hard-sm">
          <Icon name="icon-sparkle" color="#26382E" class="size-7" />
          <span class="text-lg font-extrabold tracking-[0.2em]">AI 效率指南</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold tracking-[0.3em] text-secondary">VOL.01</span>
          <span class="rounded-full bg-primary px-5 py-2 text-lg font-black tracking-widest text-invert">04/05</span>
        </div>
      </header>

      <!-- 标题 -->
      <div class="rise-1 relative z-10 mt-7 flex items-end gap-7">
        <h1 class="font-heading text-[64px] font-black leading-[1.1] tracking-tight">实测成本</h1>
        <div class="tilt-r mb-2 flex items-center gap-3 rounded-full border-[3px] border-primary bg-accent3 px-6 py-2 shadow-hard-sm">
          <Icon name="icon-doc" color="#26382E" class="size-7" />
          <span class="whitespace-nowrap text-lg font-black">真实账单 · 不夸张</span>
        </div>
      </div>
      <p class="rise-1 relative z-10 mt-3 text-lg font-medium text-secondary">
        把一套 10 页演示的账，摊开来算
      </p>

      <!-- 收据 -->
      <section class="rise-2 relative z-10 mt-6">
        <div class="relative mx-auto w-[600px]">
          <div class="receipt-body relative z-10 bg-[#FFFDF6] px-9 pb-4 pt-4 shadow-receipt">
            <div class="flex items-center justify-between font-code text-base text-secondary">
              <span class="whitespace-nowrap tracking-[0.22em]">WEB-PRESENTATION</span>
              <span class="whitespace-nowrap">NO.001</span>
            </div>
            <p class="mt-2 text-center text-xl font-black tracking-[0.3em]">AI 演示创作账单</p>
            <div class="mt-3 border-t-2 border-dashed border-primary/30" />
            <div class="mt-3 flex flex-col gap-1.5 font-code text-base">
              <div v-for="r in rows" :key="r.k" class="flex items-center justify-between">
                <span class="text-secondary">{{ r.k }}</span>
                <span class="font-bold">{{ r.v }}</span>
              </div>
            </div>
            <div class="mt-3 border-t-2 border-dashed border-primary/30" />
            <div class="mt-3 flex items-end justify-between">
              <div>
                <p class="text-xl font-black">合计</p>
                <p class="font-code text-base text-secondary">修改已包含在内</p>
              </div>
              <p class="whitespace-nowrap text-[64px] font-black leading-none tracking-tight">
                &lt; <span class="text-accent4">¥1</span>
              </p>
            </div>
            <div class="mt-4 flex flex-col items-center gap-1.5">
              <div class="barcode h-9 w-[300px]" />
              <span class="whitespace-nowrap font-code text-base tracking-[0.3em] text-secondary">PAID · 已入账</span>
            </div>
          </div>
          <div class="receipt-edge mx-auto h-[16px] w-[600px]" />

          <!-- 收据两侧贴纸 -->
          <div class="tilt-l float-a absolute left-[-150px] top-[110px] z-20 flex items-center gap-3 rounded-full border-[3px] border-primary bg-accent4 px-6 py-3 shadow-hard-sm">
            <Icon name="icon-tag" color="#FAF7EC" class="size-7" />
            <span class="whitespace-nowrap text-xl font-black text-invert">不到 1 元！</span>
          </div>
          <div class="tilt-r absolute right-[-160px] top-[300px] z-20 rounded-full border-[3px] border-primary bg-accent3 px-6 py-3 shadow-hard-sm">
            <span class="whitespace-nowrap text-lg font-black">≈ 0.1 元 / 页</span>
          </div>
        </div>
      </section>

      <div class="relative z-10 min-h-0 flex-1" />

      <!-- 适用场景 -->
      <section class="rise-3 relative z-10 flex items-center gap-4">
        <span class="whitespace-nowrap text-lg font-black">谁最该开心：</span>
        <div class="flex items-center gap-3">
          <span
            v-for="s in scenes"
            :key="s"
            class="whitespace-nowrap rounded-full border-2 border-primary/40 bg-background px-4 py-1.5 text-base font-bold transition-colors duration-300 hover:border-primary hover:bg-accent2/20"
          >{{ s }}</span>
        </div>
      </section>

      <!-- 本页结论 -->
      <section class="rise-4 relative z-10 mt-5 flex items-center gap-6 rounded-[26px] border-[3px] border-primary bg-background-invert px-8 py-3 shadow-hard">
        <div class="flex size-[60px] shrink-0 items-center justify-center rounded-full border-[3px] border-invert/30 bg-accent3">
          <Icon name="icon-tag" color="#26382E" class="size-8" />
        </div>
        <p class="text-lg font-bold leading-normal text-invert">
          AI 创作不必只用于「重要大项目」，也能成为日常内容生产的低成本工具。
        </p>
      </section>

      <!-- 底部系列栏 -->
      <footer class="rise-4 relative z-10 mt-4 flex items-center justify-between border-t-[3px] border-primary/20 pt-2.5">
        <span class="text-base font-bold tracking-[0.22em] text-secondary">@web-presentation</span>
        <span class="flex items-center gap-2 text-base font-bold text-primary">
          下一页：分工总结
          <Icon name="icon-blocks" color="#26382E" class="size-6" />
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
.shadow-hard-sm { box-shadow: 6px 6px 0 0 var(--tw-color-text-primary); }
.shadow-receipt { box-shadow: 12px 14px 0 0 color-mix(in srgb, var(--tw-color-text-primary) 14%, transparent); }
.receipt-edge {
  background-image: radial-gradient(circle at 9px 18px, transparent 9px, #FFFDF6 9.5px);
  background-size: 18px 16px;
  background-repeat: repeat-x;
}
.barcode {
  background-image: repeating-linear-gradient(
    90deg,
    var(--tw-color-text-primary) 0 2px,
    transparent 2px 5px,
    var(--tw-color-text-primary) 5px 6px,
    transparent 6px 10px,
    var(--tw-color-text-primary) 10px 13px,
    transparent 13px 16px
  );
}
.tilt-l { transform: rotate(-7deg); }
.tilt-r { transform: rotate(4deg); }
@keyframes floaty {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}
.float-a { animation: floaty 5s ease-in-out infinite; }
.float-b { animation: floaty 6.5s ease-in-out 0.8s infinite; }
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