<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'

const realms = [
  { no: '一', name: '脚到之境', sub: '身游其境', quote: '“举酒属客，诵明月之诗，歌窈窕之章。”', text: '身游赤壁，把酒临风，对江而歌，满目诗情。', note: '清风好、水波好、酒好、诗好 —— “有此一游，也不枉此一生。”', keys: ['泛舟', '举酒', '诵诗'] },
  { no: '二', name: '眼到之境', sub: '目览其阔', quote: '“月出于东山之上，徘徊于斗牛之间。”', text: '视野由近及远，清辉四溢，境界渐阔。', note: '“徘徊”活画出脉脉含情的月光女神；白露横江、水光接天，更添辽阔朦胧之美。', keys: ['月出', '白露', '水光'] },
  { no: '三', name: '心到之境', sub: '神思其远', quote: '“浩浩乎如冯虚御风……羽化而登仙。”', text: '神思飞扬，宠辱偕忘 —— 人与自然合一，脱俗之高。', note: '“浩浩乎”言视角之广，“飘飘乎”言感受之美 —— 人在画中游，如醉如痴。', keys: ['冯虚御风', '遗世独立', '羽化登仙'] }
]

const steps = [
  { label: '由身入景', next: '眼到' },
  { label: '由景入心', next: '心到' },
  { label: '物我合一', next: '人间仙境 · 乐' }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>第一段赏析 · 境界</p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">景由情生：脚到 · 眼到 · 心到</h1>
        </div>
        <p class="pb-2 text-[18px] tracking-[2px] text-secondary">第一段写景的三层递进</p>
      </header>
      <div class="flex flex-1 flex-col justify-center">
        <div class="grid grid-cols-3 gap-8">
          <section v-for="r in realms" :key="r.no" class="flex flex-col border border-border bg-background-subtle px-9 py-8">
            <div class="flex items-center gap-4">
              <span class="flex h-[52px] w-[52px] items-center justify-center bg-accent1 font-heading text-[24px] text-invert">{{ r.no }}</span>
              <div class="flex flex-col">
                <h3 class="font-heading text-[30px] leading-tight tracking-[3px]">{{ r.name }}</h3>
                <span class="mt-1 text-[15px] tracking-[3px] text-accent3">{{ r.sub }}</span>
              </div>
            </div>
            <p class="mt-5 font-heading text-[24px] leading-relaxed text-accent1">{{ r.quote }}</p>
            <p class="mt-3 text-[18px] leading-relaxed">{{ r.text }}</p>
            <div class="mt-5 border-l-2 border-accent2 bg-background px-5 py-3">
              <p class="text-[16px] leading-relaxed text-secondary">师点拨 · {{ r.note }}</p>
            </div>
            <div class="mt-5 flex flex-wrap items-center gap-3">
              <span v-for="k in r.keys" :key="k" class="border border-border-subtle bg-background px-4 py-1 text-[15px] tracking-[2px] text-secondary">{{ k }}</span>
            </div>
          </section>
        </div>
        <div class="mt-7 flex items-center justify-center gap-4">
          <span class="bg-accent1 px-4 py-2 font-heading text-[20px] tracking-[3px] text-invert">脚到</span>
          <div v-for="s in steps" :key="s.label" class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="h-px w-[36px] bg-accent3"></span>
              <span class="text-[15px] tracking-[2px] text-secondary">{{ s.label }}</span>
              <span class="h-px w-[36px] bg-accent3"></span>
            </div>
            <span class="bg-accent1 px-4 py-2 font-heading text-[20px] tracking-[3px] text-invert">{{ s.next }}</span>
          </div>
        </div>
        <section class="mt-7 flex items-center justify-between border border-border bg-background-subtle px-10 py-5">
          <p class="text-[22px] leading-relaxed">“脚不能到的，眼睛可以到；眼睛不能到的，精神可以到。”<span class="ml-3 text-[17px] text-secondary">—— 维克多 · 雨果</span></p>
          <div class="flex shrink-0 items-center gap-3">
            <span class="bg-accent2 px-5 py-2 font-heading text-[22px] tracking-[3px] text-invert">美景</span>
            <span class="text-[22px] text-accent3">——</span>
            <span class="bg-accent3 px-5 py-2 font-heading text-[22px] tracking-[3px] text-invert">乐</span>
          </div>
        </section>
      </div>
    </main>
  </DefaultContainer>
</template>