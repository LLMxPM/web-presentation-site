<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'

const features = [
  { no: '壹', title: '融情于景 · 融情于事', text: '景由情生：清风、明月、白露皆是心境；泛舟、举酒、诵诗，事事承载游兴与情思。', points: ['一切景语皆情语', '事事件件皆含游兴'], quote: '“清风徐来” → “羽化登仙”', effect: '意境浑然' },
  { no: '贰', title: '善于取譬 · 蕴含哲理', text: '取譬小而喻大：江水明月、蜉蝣一粟、悲风箫声，皆是哲思的载体。', points: ['水月喻变与不变', '蜉蝣一粟喻渺小须臾', '连串比喻写箫声之悲'], quote: '“逝者如斯，而未尝往也”', effect: '哲理自出' },
  { no: '叁', title: '主客问答 · 以客衬主', text: '一问一答间感情扬抑起落：借客之言写悲，以苏子之答写悟，牵引读者随之悲喜。', points: ['借客之言写悲', '以苏子之答写悟', '悲乐相生，情理相成'], quote: '“而今安在哉” → “而又何羡乎”', effect: '以客衬主' }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>写法归纳</p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">艺术特色：景、情、理交融</h1>
        </div>
        <p class="pb-2 text-[18px] tracking-[2px] text-secondary">对应教学目标二、三</p>
      </header>
      <div class="flex flex-1 flex-col justify-center">
        <div class="grid grid-cols-3 gap-8">
          <section v-for="f in features" :key="f.no" class="flex flex-col border border-border bg-background-subtle px-9 py-8">
            <div class="flex items-center gap-4">
              <span class="flex h-[54px] w-[54px] items-center justify-center border-2 border-accent3 font-heading text-[26px] text-accent3">{{ f.no }}</span>
              <h3 class="font-heading text-[27px] leading-snug tracking-[1px]">{{ f.title }}</h3>
            </div>
            <p class="mt-5 text-[19px] leading-relaxed">{{ f.text }}</p>
            <div class="mt-4 flex flex-col gap-2">
              <p v-for="pt in f.points" :key="pt" class="text-[16px] leading-relaxed text-secondary">· {{ pt }}</p>
            </div>
            <div class="mt-5 flex items-center justify-between gap-4 border-t border-border-subtle pt-4">
              <p class="font-heading text-[19px] tracking-[1px] text-accent1">{{ f.quote }}</p>
              <span class="shrink-0 bg-accent3 px-3 py-1 text-[15px] tracking-[2px] text-invert">{{ f.effect }}</span>
            </div>
          </section>
        </div>
        <section class="mt-7 flex items-center justify-between bg-background-invert px-10 py-5">
          <p class="text-[21px] tracking-[2px] text-invert">景生情，情寓理 —— 全文以“乐—悲—乐”为线，写景、抒情、说理水乳交融。</p>
          <div class="flex shrink-0 items-center gap-3 text-[20px] tracking-[3px]">
            <span class="text-accent2">景</span><span class="h-px w-[30px] bg-accent2"></span><span class="text-accent2">情</span><span class="h-px w-[30px] bg-accent2"></span><span class="text-accent2">理</span>
          </div>
        </section>
      </div>
    </main>
  </DefaultContainer>
</template>