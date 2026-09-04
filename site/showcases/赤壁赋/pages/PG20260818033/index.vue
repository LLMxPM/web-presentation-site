<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'

const goals = [
  { no: '壹', keyword: '宇宙观 · 人生观', text: '体会苏轼的宇宙观和人生观。' },
  { no: '贰', keyword: '构思 · 情景交融', text: '学习本文融情于景、融情于事的构思特点。' },
  { no: '叁', keyword: '取譬 · 哲理语言', text: '鉴赏本文善于取譬、蕴涵哲理的语言特点。' },
  { no: '肆', keyword: '超脱 · 达观', text: '体会作者遇到挫折后超脱的人生态度和达观的处世情怀。' }
]

const focus = [
  { label: '教学重点', text: '体会作者的人生态度，以及本文重点语句的哲理意义。', top: 'border-accent3', labelClass: 'text-accent3' },
  { label: '教学难点', text: '把握行文的感情变化和景、情、理水乳交融的特点。', top: 'border-accent1', labelClass: 'text-accent1' },
  { label: '教学方法', text: '诵读法 · 比较法 · 讨论法，多媒体辅助。', top: 'border-accent4', labelClass: 'text-accent4' }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3">
            <span class="inline-block h-[2px] w-[40px] bg-accent3"></span>课前导引
          </p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">教学目标与重难点</h1>
        </div>
        <p class="pb-2 text-[18px] tracking-[2px] text-secondary">《赤壁赋》 · 深入鉴赏课</p>
      </header>
      <div class="flex flex-1 flex-col justify-center">
        <div class="grid grid-cols-2 gap-6">
          <section v-for="g in goals" :key="g.no" class="flex items-center gap-8 border border-border bg-background-subtle px-10 py-8">
            <span class="flex h-[76px] w-[76px] shrink-0 items-center justify-center border-2 border-accent3 font-heading text-[34px] text-accent3">{{ g.no }}</span>
            <div class="flex flex-col gap-2">
              <span class="text-[16px] tracking-[4px] text-accent3">目标 {{ g.no }} · {{ g.keyword }}</span>
              <p class="text-[22px] leading-relaxed">{{ g.text }}</p>
            </div>
          </section>
        </div>
        <section class="mt-10 grid grid-cols-3 gap-10">
          <div v-for="f in focus" :key="f.label" class="border-t-2 pt-5" :class="f.top">
            <p class="text-[19px] font-semibold tracking-[4px]" :class="f.labelClass">{{ f.label }}</p>
            <p class="mt-2 text-[18px] leading-relaxed text-secondary">{{ f.text }}</p>
          </div>
        </section>
      </div>
    </main>
  </DefaultContainer>
</template>