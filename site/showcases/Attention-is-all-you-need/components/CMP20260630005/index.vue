<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import ThemeLogo from '@runtime-kit/public/components/primitives/ThemeLogo.v1.vue'

interface Props {
  thankYouText?: string
  contactInfo?: string
  showLogo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  thankYouText: '谢谢！',
  contactInfo: '欢迎交流讨论',
  showLogo: true
})
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col items-center justify-center">
      <!-- 顶部装饰色块 -->
      <div class="absolute top-0 left-0 right-0 h-2 bg-background-invert"></div>
      
      <!-- 主题 Logo -->
      <div v-if="showLogo" class="mb-12">
        <ThemeLogo :size="14" />
      </div>
      
      <!-- 感谢文字 -->
      <div class="text-center px-12">
        <h1 class="text-7xl font-heading font-bold text-primary mb-8">
          {{ thankYouText }}
        </h1>
        
        <div class="w-20 h-1 bg-primary mx-auto mb-8"></div>
        
        <p v-if="contactInfo" class="text-xl text-secondary">
          {{ contactInfo }}
        </p>
      </div>
      
      <!-- 底部装饰色块 -->
      <div class="absolute bottom-0 left-0 right-0 h-2 bg-background-invert"></div>
    </div>
  </DefaultContainer>
</template>