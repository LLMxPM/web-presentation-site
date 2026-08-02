<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import ImagePerspectiveShowcase from '@workspace-components/CMP20260607004/v/5'

const huangshanImages = ['黄山风景', '黄山风景', '黄山风景']
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full flex flex-col items-center justify-center gap-10 bg-background">
      <div class="text-center space-y-3">
        <h1 class="text-6xl font-heading font-bold text-primary">
          黄山风景 · 透视展示
        </h1>
        <p class="text-2xl text-secondary font-body">
          ImagePerspectiveShowcase 组件演示
        </p>
      </div>

      <ImagePerspectiveShowcase
        :images="huangshanImages"
        :tilt-angle="25"
        container-width="1400px"
        container-height="500px"
        gap="32px"
        border-class="rounded-2xl shadow-2xl"
        fit-mode="cover"
      />

      <p class="text-base text-secondary/60 font-body">图片资源：黄山风景 · 左右两侧透视倾斜 25° </p>
    </div>
  </DefaultContainer>
</template>