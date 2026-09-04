<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'

const flow = [
  { char: '乐', label: '泛舟美景', mood: 'bg-accent2', note: '清风明月 · 羽化登仙' },
  { char: '悲', label: '箫声客言', mood: 'bg-accent1', note: '望美人 · 吊古伤今' },
  { char: '乐', label: '水月之悟', mood: 'bg-accent2', note: '物我无尽 · 共适清风明月' }
]
const transitions = ['触景生情 · 由乐转悲', '悟理释怀 · 转悲为乐']
const tasks = [
  { no: '壹', text: '背诵全文，梳理“乐—悲—乐”的感情脉络。' },
  { no: '贰', text: '归纳整理“而、之、于”等虚词用法与特殊句式。' },
  { no: '叁', text: '随笔 300 字：《我眼中的苏轼》。' },
  { no: '肆', text: '拓展阅读《后赤壁赋》，比较两赋景与情的异同。' }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>课堂收束</p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">课堂小结与作业</h1>
        </div>
        <p class="pb-2 text-[18px] tracking-[2px] text-secondary">一篇赋 · 三转情 · 景情理水乳交融</p>
      </header>
      <div class="mt-9 flex flex-1 items-center justify-center gap-10">
        <section class="flex min-h-[520px] shrink-0 flex-col border border-border bg-background-subtle px-14 py-12">
          <h3 class="text-[22px] tracking-[4px] text-accent1">感情线索</h3>
          <div class="flex flex-1 items-center">
            <template v-for="(n, i) in flow" :key="i">
              <div class="flex w-[240px] flex-col items-center gap-4">
                <span class="flex h-[130px] w-[130px] items-center justify-center rounded-full font-heading text-[46px] text-invert" :class="n.mood">{{ n.char }}</span>
                <span class="font-heading text-[22px] tracking-[2px]">{{ n.label }}</span>
                <span class="text-center text-[16px] leading-relaxed text-secondary">{{ n.note }}</span>
              </div>
              <div v-if="i < transitions.length" class="flex flex-1 flex-col items-center gap-2 px-3">
                <span class="text-[15px] tracking-[2px] text-accent3">{{ transitions[i] }}</span>
                <div class="relative h-[2px] w-full bg-border">
                  <span class="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[9px] border-y-transparent border-l-accent3"></span>
                </div>
              </div>
            </template>
          </div>
          <p class="border-t border-border-subtle pt-6 text-[20px] leading-relaxed">苏轼在逆境中以达观化解失意 —— 学习他<span class="text-accent3">超脱的人生态度</span>与<span class="text-accent3">旷达的处世情怀</span>。</p>
        </section>
        <aside class="flex min-h-[520px] w-[600px] shrink-0 flex-col border border-border bg-background-subtle px-12 py-12">
          <h3 class="text-[22px] tracking-[4px] text-accent1">作业与拓展</h3>
          <div class="mt-6 flex flex-1 flex-col justify-center gap-8">
            <div v-for="t in tasks" :key="t.no" class="flex items-start gap-5">
              <span class="flex h-[44px] w-[44px] shrink-0 items-center justify-center border border-accent3 font-heading text-[20px] text-accent3">{{ t.no }}</span>
              <p class="pt-1 text-[19px] leading-relaxed">{{ t.text }}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </DefaultContainer>
</template>