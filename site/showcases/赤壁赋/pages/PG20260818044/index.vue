<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <main class="relative h-full w-full overflow-hidden bg-background-invert text-invert">
      <div aria-hidden="true" class="pointer-events-none absolute right-[560px] top-[80px] h-[150px] w-[150px] rounded-full border border-accent2"></div>
      <div class="flex h-full">
        <div class="flex flex-1 flex-col justify-center pl-[120px] pr-[60px]">
          <p class="text-[18px] tracking-[8px] text-accent2">结 语</p>
          <p class="mt-9 font-heading text-[46px] leading-[1.65] tracking-[3px]">相与枕藉乎舟中，<br />不知东方之既白。</p>
          <p class="mt-9 max-w-[640px] text-[20px] leading-relaxed">从“乐甚”到“愀然”，再到“喜而笑”——苏轼以水月为喻，在赤壁的清风明月间，完成了从失意到达观的精神突围。</p>
          <div class="mt-14 flex items-center gap-6">
            <span class="flex h-[60px] w-[60px] items-center justify-center bg-accent3 font-heading text-[30px]">谢</span>
            <div class="flex flex-col gap-1">
              <span class="text-[26px] tracking-[5px]">谢谢聆听</span>
              <span class="text-[16px] tracking-[3px] text-accent2">敬请批评指正 · 《赤壁赋》第三课时</span>
            </div>
          </div>
        </div>
        <div class="flex w-[700px] shrink-0 items-center justify-center py-[44px]">
          <AssetImage name="chibi-sushi-ef1c1ab7-1" fit="contain" class="h-[900px] w-[600px]" />
        </div>
      </div>
    </main>
  </DefaultContainer>
</template>