<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'

const sorrows = [
  { tag: '悲叹一', title: '英雄不再', quote: '“固一世之雄也，而今安在哉？”', text: '凭吊历史兴亡：曹操称雄一世，终被浪淘尽 —— 人生短促，变化无常。', tail: '一世之雄，终归浪淘尽' },
  { tag: '悲叹二', title: '人生须臾', quote: '“寄蜉蝣于天地，渺沧海之一粟。”', text: '吾生之须臾与长江之无穷对比 —— 叹人生短暂、个体渺小，如匆匆过客。', tail: '须臾人生，沧海一粟' },
  { tag: '悲叹三', title: '理想难遂', quote: '“挟飞仙以遨游，抱明月而长终。”', text: '渴望永恒而“知不可乎骤得” —— 只能渔樵江渚，托遗响于悲风。', tail: '永恒不可得，托遗响于悲风' }
]
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col justify-center bg-background px-[80px] py-[52px] text-primary">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent3"><span class="inline-block h-[2px] w-[40px] bg-accent3"></span>第三段 · 分组讨论</p>
          <h1 class="mt-3 font-heading text-[48px] leading-tight tracking-[3px]">客悲从何来：三重悲叹</h1>
        </div>
        <p class="pb-2 text-[19px] tracking-[2px] text-secondary">读第三段：客为何引曹操？“知不可乎骤得”，客想得到什么？</p>
      </header>
      <div class="mt-6 flex gap-9">
        <figure class="flex w-[510px] shrink-0 flex-col">
          <AssetImage name="chibi-caocao-b15d5bcd-1" fit="contain" class="h-[320px] w-[480px] border border-border" />
          <figcaption class="mt-2 text-[15px] tracking-[2px] text-secondary">月明星稀 · 横槊赋诗的一世之雄</figcaption>
        </figure>
        <section class="flex flex-1 flex-col justify-center border border-border bg-background-subtle px-9 py-6">
          <span class="text-[16px] tracking-[4px] text-accent3">用典 · 曹操《短歌行》与赤壁之战</span>
          <p class="mt-3 font-heading text-[23px] leading-relaxed text-accent1">“月明星稀，乌鹊南飞……舳舻千里，旌旗蔽空，酾酒临江，横槊赋诗，固一世之雄也，而今安在哉？”</p>
          <div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[17px] leading-relaxed text-secondary">
            <p>· 引诗言志：渴慕贤才，却叹人才流散 —— 暗合自身不遇。</p>
            <p>· 写其文治武功，终归失败 —— “山川相缪”写困窘之状。</p>
            <p>· 英雄尚且如此，何况“渔樵于江渚之上”的吾与子？</p>
            <p>· 怀古伤今，由凭吊兴亡跌入现实苦闷。</p>
          </div>
        </section>
      </div>
      <div class="mt-6 grid h-[300px] grid-cols-3 gap-7">
        <section v-for="s in sorrows" :key="s.tag" class="flex flex-col justify-center border border-border bg-background-subtle px-8 py-6">
          <div class="flex items-center gap-3">
            <span class="bg-accent3 px-3 py-1 text-[15px] tracking-[3px] text-invert">{{ s.tag }}</span>
            <h3 class="font-heading text-[26px] tracking-[3px]">{{ s.title }}</h3>
          </div>
          <p class="mt-4 font-heading text-[20px] leading-relaxed text-accent1">{{ s.quote }}</p>
          <p class="mt-3 text-[17px] leading-relaxed text-secondary">{{ s.text }}</p>
          <p class="pt-3 text-[15px] tracking-[2px] text-accent3">{{ s.tail }}</p>
        </section>
      </div>
    </main>
  </DefaultContainer>
</template>