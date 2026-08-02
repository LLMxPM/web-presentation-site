<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import ThemeLogo from '@runtime-kit/public/components/primitives/ThemeLogo.v1.vue'
import { useCurrentPage } from '@runtime-kit/public/composables/page/useCurrentPage.v1'

interface Props {
  title?: string
  subtitle?: string
  footer?: string
  showLogo?: boolean
  showPageNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '内容标题',
  subtitle: '',
  footer: '',
  showLogo: true,
  showPageNumber: true,
})

const { currentPage, totalPages } = useCurrentPage()
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background">
      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-accent1" />

      <!-- 内容区域 -->
      <div class="relative z-10 flex h-full w-full flex-col p-12">
        <!-- 顶部：标题区域 + Logo -->
        <div class="flex items-start justify-between mb-8">
          <div class="flex-1">
            <h1 class="font-heading text-5xl font-bold tracking-tight text-primary">
              {{ title }}
            </h1>
            <p v-if="subtitle"
               class="mt-3 text-2xl text-secondary">
              {{ subtitle }}
            </p>
            <div class="mt-4 h-1 w-20 rounded-full bg-accent1" />
          </div>
          <ThemeLogo v-if="showLogo" :size="8" class="ml-8 flex-shrink-0" />
        </div>

        <!-- 中间：内容插槽 -->
        <div class="flex-1 overflow-hidden">
          <slot>
            <div class="flex h-full items-center justify-center">
              <p class="text-xl text-secondary/50">在此处添加内容</p>
            </div>
          </slot>
        </div>

        <!-- 底部：页脚信息 + 页码 -->
        <div class="flex items-end justify-between mt-8 pt-4 border-t border-border-subtle">
          <div class="flex flex-col gap-1">
            <p v-if="footer"
               class="text-base text-secondary">
              {{ footer }}
            </p>
          </div>
          <div v-if="showPageNumber" class="flex items-center gap-3">
            <span class="text-lg font-medium text-primary">{{ currentPage }}</span>
            <span class="text-base text-secondary">/</span>
            <span class="text-base text-secondary">{{ totalPages }}</span>
          </div>
        </div>
      </div>
    </div>
  </DefaultContainer>
</template>