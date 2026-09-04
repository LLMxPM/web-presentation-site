<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'

const stages = [
  { tag: '第一、二课时 · 已完成', title: '文意疏通', text: '逐段理解文意，积累文言实词、虚词与特殊句式。' },
  { tag: '本课时 · 深入鉴赏', title: '思想探讨', text: '以感情变化为线索，探讨苏轼的人生观与宇宙观。' }
]

const nodes = [
  { char: '乐', source: '乐甚', scene: '泛舟赏景', mood: 'bg-accent2' },
  { char: '悲', source: '愀然', scene: '闻箫听客', mood: 'bg-accent1' },
  { char: '乐', source: '喜而笑', scene: '悟理释怀', mood: 'bg-accent2' }
]
const arrows = ['由乐转悲', '转悲为乐']
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>导入</p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">温故知新 · 抓住感情线索</h1>
        </div>
        <p class="pb-2 text-[18px] tracking-[2px] text-secondary">散文创作，一般以作者的主观感受为线索</p>
      </header>
      <div class="mt-8 flex flex-1 gap-10">
        <aside class="flex w-[520px] shrink-0">
          <div class="flex w-full flex-col justify-center gap-8 border border-border bg-background-subtle px-12 py-10">
            <section v-for="s in stages" :key="s.title" class="flex flex-col gap-3">
              <span class="text-[16px] tracking-[4px] text-accent3">{{ s.tag }}</span>
              <h3 class="font-heading text-[30px] tracking-[2px]">{{ s.title }}</h3>
              <p class="text-[19px] leading-relaxed text-secondary">{{ s.text }}</p>
            </section>
            <div class="border-l-4 border-accent2 bg-background px-8 py-6">
              <p class="text-[20px] leading-relaxed">本文表达感情的词语：<span class="text-accent1">“乐甚”“愀然”“喜而笑”</span>，串起<span class="text-accent1">乐 — 悲 — 乐</span>的感情变化。</p>
            </div>
          </div>
        </aside>
        <section class="flex flex-1 flex-col justify-center border border-border bg-background-subtle px-12 py-10">
          <h3 class="mb-8 text-[24px] tracking-[4px] text-accent1">感情变化线索</h3>
          <div class="mb-6 flex items-center">
            <template v-for="(n, i) in nodes" :key="i">
              <div class="flex w-[220px] flex-col items-center gap-4">
                <span class="flex h-[170px] w-[170px] flex-col items-center justify-center rounded-full text-invert" :class="n.mood">
                  <span class="font-heading text-[58px] leading-none">{{ n.char }}</span>
                  <span class="mt-2 text-[16px] tracking-[2px]">{{ n.source }}</span>
                </span>
                <span class="text-[20px] tracking-[3px] text-secondary">{{ n.scene }}</span>
              </div>
              <div v-if="i < arrows.length" class="flex flex-1 flex-col items-center gap-2 px-2">
                <span class="text-[18px] tracking-[3px] text-accent3">{{ arrows[i] }}</span>
                <div class="relative h-[2px] w-full bg-border">
                  <span class="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-l-[10px] border-y-transparent border-l-accent3"></span>
                </div>
              </div>
            </template>
          </div>
          <div class="border-t border-border-subtle pt-6">
            <p class="text-[20px] leading-relaxed"><span class="text-accent3">思考：</span>为什么会有这样的感情变化？景、情、理之间是如何转化的？</p>
          </div>
        </section>
      </div>
    </main>
  </DefaultContainer>
</template>