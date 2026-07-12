<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'

defineProps<{
  topImage?: string
  bottomImage?: string
  title?: string
  topLabel?: string
  bottomLabel?: string
}>()
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full flex flex-col bg-background py-[60px]">
      <!-- 页面标题区 -->
      <div
        v-if="title"
        class="shrink-0 flex items-center justify-center h-[80px]"
      >
        <h1 class="text-5xl font-heading font-bold mb-6 text-primary tracking-wide">
          {{ title }}
        </h1>
      </div>

      <!-- 上方PPT截图区域 -->
      <div class="flex-1 flex flex-col items-center justify-center px-[80px] min-h-0">
        <div class="w-full flex flex-col items-center">
          <AssetImage
            v-if="topImage"
            :name="topImage"
            alt="PPT截图"
            fit="contain"
            class="w-full h-full max-h-[580px] rounded-xl border border-border bg-background-subtle overflow-hidden"
          />
          <div
            v-else
            class="w-full aspect-[16/9] max-h-[580px] rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-background-subtle"
          >
            <span class="text-2xl text-secondary font-body">PPT 截图 1</span>
          </div>
          <p
            v-if="topLabel"
            class="mt-3 text-lg text-secondary font-body"
          >
            {{ topLabel }}
          </p>
        </div>
      </div>

      <!-- 分隔间距 -->
      <div class="shrink-0 h-[40px]" />

      <!-- 下方PPT截图区域 -->
      <div class="flex-1 flex flex-col items-center justify-center px-[80px] min-h-0">
        <div class="w-full flex flex-col items-center">
          <AssetImage
            v-if="bottomImage"
            :name="bottomImage"
            alt="PPT截图"
            fit="contain"
            class="w-full h-full max-h-[580px] rounded-xl border border-border bg-background-subtle overflow-hidden"
          />
          <div
            v-else
            class="w-full aspect-[16/9] max-h-[580px] rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-background-subtle"
          >
            <span class="text-2xl text-secondary font-body">PPT 截图 2</span>
          </div>
          <p
            v-if="bottomLabel"
            class="mt-3 text-lg text-secondary font-body"
          >
            {{ bottomLabel }}
          </p>
        </div>
      </div>
    </div>
  </DefaultContainer>
</template>
