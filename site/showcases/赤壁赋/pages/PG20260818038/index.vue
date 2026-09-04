<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative flex h-full w-full flex-col bg-background-invert px-[88px] py-[60px] text-invert">
      <header class="flex items-end justify-between">
        <div>
          <p class="flex items-center gap-3 text-[18px] tracking-[6px] text-accent2"><span class="inline-block h-[2px] w-[40px] bg-accent2"></span>感情转折 · 第一问</p>
          <h1 class="mt-4 font-heading text-[50px] leading-tight tracking-[3px]">由乐转悲：两层悲意</h1>
        </div>
        <p class="pb-2 text-[19px] tracking-[2px] text-invert">苏子愀然 —— “何为其然也？”</p>
      </header>
      <div class="mt-8 flex flex-1 items-center gap-16">
        <div class="flex flex-1 flex-col">
          <div class="flex flex-col gap-6">
            <section class="border-l-4 border-accent2 bg-[rgba(245,240,226,0.05)] px-8 py-6">
              <div class="flex items-center gap-4">
                <span class="bg-accent2 px-3 py-1 text-[15px] tracking-[3px] text-background-invert">第一层 · 望美人</span>
                <h3 class="font-heading text-[26px] tracking-[2px]">“渺渺兮予怀，望美人兮天一方”</h3>
              </div>
              <p class="mt-4 text-[19px] leading-relaxed">“美人”喻指君主与理想追求 —— 贬谪的苦闷、知音难觅的怅惘；游赏之乐实为苦中作乐。</p>
              <p class="mt-2 text-[17px] tracking-[1px] text-accent2">居庙堂之高则忧其民，处江湖之远则忧其君。</p>
              <div class="mt-4 flex items-center gap-3 text-[16px] tracking-[2px]">
                <span class="text-accent2">泛舟之乐</span>
                <span class="h-px w-[32px] bg-accent2"></span>
                <span>望美人而生悲</span>
              </div>
            </section>
            <section class="border-l-4 border-accent2 bg-[rgba(245,240,226,0.05)] px-8 py-6">
              <div class="flex items-center gap-4">
                <span class="bg-accent2 px-3 py-1 text-[15px] tracking-[3px] text-background-invert">第二层 · 洞箫声</span>
                <h3 class="font-heading text-[26px] tracking-[2px]">客有吹洞箫者，倚歌而和之</h3>
              </div>
              <p class="mt-4 font-heading text-[22px] leading-relaxed text-accent2">“如怨如慕，如泣如诉，余音袅袅，不绝如缕。舞幽壑之潜蛟，泣孤舟之嫠妇。”</p>
              <p class="mt-2 text-[18px] leading-relaxed">连用比喻，箫声幽怨悲凉、悱恻缠绵，如闻其声，几乎也要流泪。</p>
              <div class="mt-4 flex items-center gap-3 text-[16px] tracking-[2px]">
                <span class="text-accent2">歌声含悲</span>
                <span class="h-px w-[32px] bg-accent2"></span>
                <span>箫声倚和而悲深</span>
              </div>
            </section>
          </div>
          <div class="mt-8 flex items-center justify-between gap-8 border-t border-[rgba(245,240,226,0.25)] pt-4">
            <p class="text-[17px] leading-relaxed tracking-[2px]">联想比较：《琵琶行》“弦弦掩抑声声思，似诉平生不得志” —— 借乐声写愁情。</p>
            <span class="shrink-0 text-[17px] tracking-[3px] text-accent2">过渡自然圆转 · 不露痕迹</span>
          </div>
        </div>
        <aside class="flex w-[680px] shrink-0 flex-col items-center gap-7">
          <AssetImage name="chibi-xiao-a824a38e-1" fit="contain" class="h-[400px] w-[600px] border border-[rgba(245,240,226,0.25)]" />
          <p class="text-[17px] tracking-[3px] text-accent2">倚歌而和 —— 泛舟之乐，悄然向悲转化</p>
        </aside>
      </div>
    </main>
  </DefaultContainer>
</template>