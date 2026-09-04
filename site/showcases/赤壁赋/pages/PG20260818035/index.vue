<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'

const scenes = [
  { quote: '“清风徐来，水波不兴。”', note: '好风好水 —— 泛舟而游，怡然自得。' },
  { quote: '“月出于东山之上，徘徊于斗牛之间。”', note: '“徘徊”传神 —— 明月含情，脉脉动人。' },
  { quote: '“白露横江，水光接天。”', note: '清辉四溢 —— 辽阔悠远，朦胧神秘。' }
]

const joys = [
  { label: '好风', text: '清风徐来' },
  { label: '好水', text: '水波不兴' },
  { label: '好酒', text: '举酒属客' },
  { label: '好诗', text: '诵明月之诗' }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background px-[80px] py-[56px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>第一段赏析 · 乐</p>
          <h1 class="mt-4 font-heading text-[52px] leading-tight tracking-[3px]">泛舟之乐：良辰美景</h1>
        </div>
        <p class="pb-2 text-[20px] tracking-[2px] text-secondary">“于是饮酒乐甚” —— 乐从何来？</p>
      </header>
      <div class="mt-8 flex flex-1 items-center gap-12">
        <figure class="flex w-[762px] shrink-0 flex-col">
          <AssetImage name="chibi-scene-ffe83866-1" fit="contain" class="h-[508px] w-[762px] border border-border" />
          <figcaption class="mt-3 flex items-center justify-between text-[16px] tracking-[2px] text-secondary">
            <span>七月既望 · 苏子与客泛舟游于赤壁之下</span>
            <span class="text-accent3">三组对偶 · 写景名句</span>
          </figcaption>
          <div class="mt-8 border border-border bg-background-subtle px-7 py-5">
            <p class="text-[16px] tracking-[3px] text-accent3">诵读提示</p>
            <p class="mt-2 text-[17px] leading-relaxed text-secondary">三组对偶句宜缓读，读出空阔宁静之感；“徘徊”二字轻读，传明月眷恋含情之态。</p>
          </div>
        </figure>
        <div class="flex flex-1 flex-col">
          <div class="flex flex-col gap-6">
            <div v-for="s in scenes" :key="s.quote" class="border-l-2 border-accent2 pl-6">
              <p class="font-heading text-[25px] leading-snug tracking-[1px] text-accent1">{{ s.quote }}</p>
              <p class="mt-2 text-[18px] leading-relaxed text-secondary">{{ s.note }}</p>
            </div>
          </div>
          <div class="mt-8 flex items-center gap-4">
            <span v-for="h in joys" :key="h.label" class="flex items-center gap-2 border border-accent2 px-5 py-2">
              <span class="font-heading text-[20px] text-accent3">{{ h.label }}</span>
              <span class="text-[16px] text-secondary">{{ h.text }}</span>
            </span>
          </div>
          <div class="mt-8 bg-background-invert px-9 py-7">
            <p class="font-heading text-[24px] leading-relaxed tracking-[1px] text-invert">“浩浩乎如冯虚御风，而不知其所止；飘飘乎如遗世独立，羽化而登仙。”</p>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-[17px] tracking-[2px] text-accent2">纵一苇之所如，凌万顷之茫然 —— 物我合一，宠辱偕忘。</p>
              <span class="bg-accent3 px-4 py-1 text-[16px] tracking-[3px] text-invert">人间仙境</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </DefaultContainer>
</template>