<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue';
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue';
</script>

<template>
  <DefaultContainer>
    <div class="h-full w-full flex flex-col bg-background-invert px-[72px] pt-[48px] pb-[48px]">
      <!-- 标签行 -->
      <div class="mb-[16px]">
        <span class="inline-block px-[24px] py-[8px] rounded-full bg-white/15 text-white/80 text-base font-semibold tracking-wide">
          解决方案
        </span>
      </div>

      <!-- 标题区 -->
      <h2 class="text-white text-5xl font-bold leading-tight mb-[8px]" style="max-width: 900px;">
        品牌不是一句话，<br />而是一套可复用的约束体系
      </h2>
      <p class="text-white/65 text-xl mb-[28px]">
        web-presentation 把品牌要素变成平台原生资产，AI 在规则内创作
      </p>

      <!-- 机制要点网格 2x2 -->
      <div class="grid grid-cols-2 gap-[16px] flex-1">
        <!-- 要点 1：品牌标识 -->
        <div class="rounded-3xl bg-white/8 p-[24px] flex flex-col">
          <div class="w-[44px] h-[44px] rounded-xl bg-accent3/30 flex items-center justify-center mb-[12px]">
            <Icon name="icon-tag" class="size-[28px]" color="white" />
          </div>
          <h3 class="text-white text-2xl font-bold mb-[6px]">品牌标识与 Logo</h3>
          <p class="text-white/60 text-lg leading-relaxed">
            Logo、主色、辅助色、字体声明统一配置，所有页面自动继承。
          </p>
        </div>

        <!-- 要点 2：样式库 -->
        <div class="rounded-3xl bg-white/8 p-[24px] flex flex-col">
          <div class="w-[44px] h-[44px] rounded-xl bg-accent2/30 flex items-center justify-center mb-[12px]">
            <Icon name="icon-ruler" class="size-[28px]" color="white" />
          </div>
          <h3 class="text-white text-2xl font-bold mb-[6px]">样式规范沉淀</h3>
          <p class="text-white/60 text-lg leading-relaxed">
            页面比例、内容密度、留白节奏以 Markdown 样式库维护。
          </p>
        </div>

        <!-- 要点 3：组件复用 -->
        <div class="rounded-3xl bg-white/8 p-[24px] flex flex-col">
          <div class="w-[44px] h-[44px] rounded-xl bg-accent4/30 flex items-center justify-center mb-[12px]">
            <Icon name="icon-blocks" class="size-[28px]" color="white" />
          </div>
          <h3 class="text-white text-2xl font-bold mb-[6px]">高频组件沉淀</h3>
          <p class="text-white/60 text-lg leading-relaxed">
            常用页面结构做成可复用组件，多页相同结构优先引用。
          </p>
        </div>

        <!-- 要点 4：主题切换 -->
        <div class="rounded-3xl bg-white/8 p-[24px] flex flex-col">
          <div class="w-[44px] h-[44px] rounded-xl bg-accent5/30 flex items-center justify-center mb-[12px]">
            <Icon name="icon-palette" class="size-[28px]" color="white" />
          </div>
          <h3 class="text-white text-2xl font-bold mb-[6px]">多主题演进</h3>
          <p class="text-white/60 text-lg leading-relaxed">
            不同业务线维护不同主题，品牌随团队需求持续进化。
          </p>
        </div>
      </div>
    </div>
  </DefaultContainer>
</template>
