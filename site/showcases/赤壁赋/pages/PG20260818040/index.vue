<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'

const views = [
  { key: '变', label: '自其变者而观之', quote: '则天地曾不能以一瞬', text: '万物无时不在变迁 —— 天地尚且不能持久，人生得失又何足悲？', bar: 'bg-accent1', keyBg: 'bg-accent1', tone: 'text-accent1', chips: ['天地一瞬', '万物无常', '不必悲叹'] },
  { key: '不变', label: '自其不变者而观之', quote: '则物与我皆无尽也', text: '物我皆无穷尽 —— 生命与自然同在，“而又何羡乎！”', bar: 'bg-accent2', keyBg: 'bg-accent2', tone: 'text-accent2', chips: ['物我无尽', '自然永恒', '而又何羡'] }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>第四段 · 转悲为乐</p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">苏子之答：水月之喻</h1>
        </div>
        <p class="pb-2 text-[19px] tracking-[2px] text-secondary">客人求的是永恒 —— 苏轼如何开解？</p>
      </header>
      <section class="mt-7 border border-border bg-background-subtle px-10 py-6 text-center">
        <p class="font-heading text-[30px] leading-relaxed tracking-[1px] text-accent1">“逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。”</p>
        <p class="mt-2 text-[17px] tracking-[2px] text-secondary">以江水、明月设喻 —— 引出“变”与“不变”的哲思</p>
      </section>
      <div class="relative mt-7 flex-1">
        <div class="grid h-full grid-cols-2 gap-10">
          <section v-for="v in views" :key="v.key" class="flex flex-col border border-border bg-background-subtle pb-8">
            <span class="h-[4px] w-full" :class="v.bar"></span>
            <div class="flex items-center gap-4 px-10 pt-7">
              <span class="flex h-[64px] items-center justify-center px-5 font-heading text-[30px] tracking-[2px] text-invert" :class="v.keyBg">{{ v.key }}</span>
              <div class="flex flex-col">
                <span class="text-[16px] tracking-[3px] text-secondary">观物视角</span>
                <h3 class="font-heading text-[28px] tracking-[1px]">{{ v.label }}</h3>
              </div>
            </div>
            <p class="px-10 pt-5 font-heading text-[30px] leading-relaxed" :class="v.tone">“{{ v.quote }}”</p>
            <p class="px-10 pt-4 text-[18px] leading-relaxed text-secondary">{{ v.text }}</p>
            <div class="mt-auto flex items-center gap-3 px-10 pt-6">
              <span v-for="c in v.chips" :key="c" class="border border-border-subtle bg-background px-4 py-1 text-[15px] tracking-[2px] text-secondary">{{ c }}</span>
            </div>
          </section>
        </div>
        <div class="pointer-events-none absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent2 bg-background">
          <span class="font-heading text-[30px] text-accent2">月</span>
        </div>
      </div>
      <section class="mt-7 flex items-center justify-between bg-background-invert px-10 py-6">
        <p class="font-heading text-[23px] leading-relaxed tracking-[1px] text-invert">“且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。”</p>
        <span class="shrink-0 bg-accent3 px-5 py-2 text-[18px] tracking-[3px] text-invert">放下执念 · 豁然开朗</span>
      </section>
    </main>
  </DefaultContainer>
</template>