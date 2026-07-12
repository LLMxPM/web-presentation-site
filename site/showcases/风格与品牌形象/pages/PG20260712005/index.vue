<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue';
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue';
</script>

<template>
  <DefaultContainer>
    <div class="h-full w-full flex flex-col bg-background-invert px-[72px] pt-[56px] pb-[48px]">
      <!-- 标签行 -->
      <div class="mb-[20px]">
        <span class="inline-block px-[24px] py-[8px] rounded-full bg-white/15 text-white/80 text-base font-semibold tracking-wide">
          总结
        </span>
      </div>

      <!-- 主金句区 -->
      <div class="flex-1 flex flex-col justify-center">
        <p class="text-white/50 text-2xl mb-[16px]">核心观点</p>
        <h2 class="text-white text-5xl font-bold leading-tight mb-[48px]" style="max-width: 900px;">
          AI 可以带来速度<br />和变化，但企业创作<br />更需要可控和连续。
        </h2>

        <!-- 三大适用场景 -->
        <div class="space-y-[16px] mb-[48px]">
          <div class="flex items-center gap-[16px]">
            <div class="w-[48px] h-[48px] rounded-xl bg-accent4/25 flex items-center justify-center flex-shrink-0">
              <Icon name="icon-chart" class="size-[28px]" color="white" />
            </div>
            <span class="text-white/80 text-2xl">产品发布 & 季度汇报</span>
          </div>
          <div class="flex items-center gap-[16px]">
            <div class="w-[48px] h-[48px] rounded-xl bg-accent3/25 flex items-center justify-center flex-shrink-0">
              <Icon name="icon-doc" class="size-[28px]" color="white" />
            </div>
            <span class="text-white/80 text-2xl">数据解读 & 客户提案</span>
          </div>
          <div class="flex items-center gap-[16px]">
            <div class="w-[48px] h-[48px] rounded-xl bg-accent2/25 flex items-center justify-center flex-shrink-0">
              <Icon name="icon-hat" class="size-[28px]" color="white" />
            </div>
            <span class="text-white/80 text-2xl">活动物料 & 内部培训</span>
          </div>
        </div>
      </div>

      <!-- 底部结论条 -->
      <div class="py-[24px] px-[36px] rounded-2xl bg-white/10 border border-white/15">
        <p class="text-white text-xl leading-relaxed text-center">
          把风格、品牌形象和内容结构沉淀为平台资产，<br />让 AI 在自定义约束内发挥——<br />这更接近团队真正需要的生产方式。
        </p>
      </div>

      <!-- GitHub 开源 -->
      <p class="text-white/35 text-base text-center mt-[20px]">
        web-presentation · GitHub 开源项目 · 可自由部署与二次开发
      </p>
    </div>
  </DefaultContainer>
</template>
