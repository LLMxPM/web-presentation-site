<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
import Icon from '@runtime-kit/public/components/primitives/Icon.v1.vue'

const infoItems = [
  { icon: 'icon-doc', label: '内容来源', value: '论文《 Attention Is All You Need 》' },
  { icon: 'icon-sparkle', label: '大纲总结', value: 'Codex' },
  { icon: 'icon-blocks', label: '实现工具', value: 'Web-Presentation' },
  { icon: 'icon-hat', label: '生成模型', value: 'DeepSeek-V4-pro' },
  { icon: 'icon-tag', label: '排版成本', value: '不到 1 元' },
]

const featureTags = ['学术风格', '简洁统一', 'Latex', '三线表']
</script>

<template>
  <DefaultContainer>
    <div class="h-full w-full bg-background flex flex-col items-center px-[80px] pt-[48px] pb-[48px]">

      <!-- 顶部图标 -->
      <div class="flex justify-center mb-[4px]">
        <Icon name="icon-hat" class="size-[48px]" color="accent1" />
      </div>

      <!-- 标题区 -->
      <h2 class="text-3xl font-bold text-primary tracking-wide text-center">
        Web-Presentation 案例展示
      </h2>
      <h1 class="text-4xl font-extrabold text-accent1-600 tracking-wider text-center mt-2">
        学术PPT
      </h1>

      <!-- Slide 1 截图 -->
      <div class="w-full max-w-[920px] mt-[32px]">
        <div class="relative rounded-[16px] overflow-hidden border border-border bg-background-subtle">
          <AssetImage
            name="01-Slide-1-·-论文背景与一句话贡献-v1"
            fit="contain"
            class="w-full"
          />
        </div>
      </div>

      <!-- 信息卡片 -->
      <div class="w-full max-w-[920px] mt-3 bg-background-subtle border border-border rounded-[20px] px-[40px] py-[20px] flex flex-col gap-[12px]">
        <div
          v-for="item in infoItems"
          :key="item.label"
          class="flex items-center gap-[16px]"
        >
          <Icon :name="item.icon" class="size-[32px] shrink-0" color="accent1" />
          <span class="text-xl font-semibold text-secondary w-[160px] shrink-0">{{ item.label }}</span>
          <span class="text-xl font-semibold text-primary">{{ item.value }}</span>
        </div>
      </div>

      <!-- 特点标签 -->
      <div class="mt-6 flex flex-wrap justify-center gap-[12px]">
        <span
          v-for="tag in featureTags"
          :key="tag"
          class="text-xl font-semibold text-accent1-600 bg-accent1-600/10 border border-accent1-600/20 rounded-full px-[22px] py-2"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 底部补充 -->
      <div class="mt-auto text-lg text-secondary text-center">
         Web-Presentation — GitHub 开源项目
      </div>

    </div>
  </DefaultContainer>
</template>
