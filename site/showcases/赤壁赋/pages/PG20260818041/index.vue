<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'

const timeline = [
  { year: '元丰二年', event: '乌台诗案，身陷囹圄' },
  { year: '元丰三年', event: '贬谪黄州，任团练副使' },
  { year: '躬耕东坡', event: '垦荒自给，寄情山水' },
  { year: '元丰五年', event: '月夜泛舟赤壁，作《赤壁赋》' }
]
const insights = ['随缘自适', '乐观旷达', '物我共适']

const blocks = [
  { key: '取之无禁', text: '清风明月无需购买、无人禁止 —— 人人皆可平等享有。' },
  { key: '感官成景', text: '耳得之而为声，目遇之而成色 —— 感官打开，景色自活。' },
  { key: '吾子共适', text: '从“而又何羡”到与物共适 —— 主客同释，悲怀尽消。' }
]
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full overflow-hidden bg-background-invert">
      <div aria-hidden="true" class="absolute inset-0 h-full w-full">
        <AssetImage name="chibi-dawn-8037f106-1" fit="cover" class="h-full w-full" />
      </div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-[rgba(13,20,36,0.92)] via-[rgba(13,20,36,0.72)] to-[rgba(13,20,36,0.35)]"></div>
      <div class="relative z-10 flex h-full w-full gap-14 px-[90px] py-[64px] text-invert">
        <div class="flex w-[1080px] shrink-0 flex-col justify-center">
          <header>
            <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent2"><span class="inline-block h-[2px] w-[40px] bg-accent2"></span>思想升华 · 人生观</p>
            <h1 class="mt-4 font-heading text-[54px] leading-tight tracking-[4px]">超然物外 · 达观人生</h1>
          </header>
          <section class="mt-8 border-l-4 border-accent2 pl-9">
            <p class="font-heading text-[28px] leading-[1.65] tracking-[1px]">“惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭，是造物者之无尽藏也，而吾与子之所共适。”</p>
          </section>
          <div class="mt-8 grid grid-cols-3 gap-6">
            <section v-for="b in blocks" :key="b.key" class="border-t-2 border-accent2 bg-[rgba(245,240,226,0.05)] px-6 py-5">
              <h4 class="font-heading text-[21px] tracking-[2px] text-accent2">{{ b.key }}</h4>
              <p class="mt-2 text-[16px] leading-relaxed">{{ b.text }}</p>
            </section>
          </div>
          <div class="mt-8">
            <div class="flex items-center gap-4">
              <span v-for="t in insights" :key="t" class="border border-accent2 px-6 py-2 text-[18px] tracking-[4px] text-accent2">{{ t }}</span>
            </div>
            <p class="mt-6 border-t border-[rgba(245,240,226,0.3)] pt-5 text-[19px] leading-relaxed">清风明月是造物者之无尽藏 —— 苏轼以自然的永恒化解人生的短暂，在逆境中完成精神的突围。</p>
          </div>
        </div>
        <aside class="flex flex-1 flex-col justify-center">
          <div class="border border-[rgba(245,240,226,0.35)] bg-[rgba(13,20,36,0.55)] px-9 py-8">
            <h3 class="text-[20px] tracking-[4px] text-accent2">苏轼 · 黄州岁月</h3>
            <div class="mt-5 flex flex-col gap-5">
              <div v-for="t in timeline" :key="t.year" class="flex items-start gap-4">
                <span class="mt-[7px] h-[10px] w-[10px] shrink-0 rounded-full bg-accent2"></span>
                <div class="flex flex-col gap-1">
                  <span class="text-[17px] tracking-[3px] text-accent2">{{ t.year }}</span>
                  <span class="text-[18px] leading-relaxed">{{ t.event }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </DefaultContainer>
</template>