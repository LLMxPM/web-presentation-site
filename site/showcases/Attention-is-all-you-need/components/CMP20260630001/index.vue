<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import ThemeLogo from '@runtime-kit/public/components/primitives/ThemeLogo.v1.vue'

interface Props {
  title?: string
  subtitle?: string
  author?: string
  date?: string
  showLogo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '学术报告标题',
  subtitle: '副标题或研究主题',
  author: '报告人姓名',
  date: '2026年6月',
  showLogo: true
})
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col items-center justify-center">
      <!-- 顶部装饰色块 -->
      <div class="absolute top-0 left-0 right-0 h-2 bg-background-invert"></div>
      
      <!-- 主题 Logo -->
      <div v-if="showLogo" class="mb-10">
        <ThemeLogo :size="16" />
      </div>
      
      <!-- 标题区域 -->
      <div class="text-center max-w-6xl px-12">
        <h1 class="text-6xl font-heading font-bold text-primary mb-6 leading-tight">
          {{ title }}
        </h1>
        
        <p v-if="subtitle" class="text-2xl text-secondary mb-10">
          {{ subtitle }}
        </p>
        
        <div class="border-t-2 border-primary pt-8 mt-8">
          <p v-if="author" class="text-xl text-primary mb-3 font-medium">
            {{ author }}
          </p>
          <p v-if="date" class="text-lg text-secondary">
            {{ date }}
          </p>
        </div>
      </div>
      
      <!-- 底部装饰色块 -->
      <div class="absolute bottom-0 left-0 right-0 h-2 bg-background-invert"></div>
    </div>
  </DefaultContainer>
</template>