<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import ThemeLogo from '@runtime-kit/public/components/primitives/ThemeLogo.v1.vue'
import { useCurrentPage } from '@runtime-kit/public/composables/page/useCurrentPage.v1'

interface Props {
  title?: string
  showLogo?: boolean
  showPageNumber?: boolean
  footerText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showLogo: true,
  showPageNumber: true,
  footerText: ''
})

const { currentPage, totalPages } = useCurrentPage()
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <!-- 页头 -->
      <header class="flex items-center justify-between px-12 py-4 border-b-2 border-background-invert">
        <div class="flex-1">
          <span v-if="title" class="text-4xl font-heading font-bold text-primary">{{ title }}</span>
        </div>
        <div class="flex items-center gap-4">
          <ThemeLogo v-if="showLogo" :size="12" />
        </div>
      </header>
      
      <!-- 内容区域 -->
      <main class="flex-1 px-12 py-10 overflow-hidden">
        <slot />
      </main>
      
      <!-- 页脚 -->
      <footer class="px-12 py-2 border-t-2 border-background-invert">
        <div class="flex items-center justify-between">
          <span v-if="footerText" class="text-base text-secondary">
            {{ footerText }}
          </span>
          <span v-else class="w-24"></span>
          <div v-if="showPageNumber" class="text-lg text-secondary font-medium">
            {{ currentPage }} / {{ totalPages }}
          </div>
        </div>
      </footer>
    </div>
  </DefaultContainer>
</template>