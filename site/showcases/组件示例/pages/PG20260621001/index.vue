<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import ImageShapeClip from '@workspace-components/CMP20260614002/v/2'
</script>

<template>
  <DefaultContainer class="w-full h-full bg-background flex flex-col items-center justify-center p-8">
    <div class="text-center mb-8">
      <h1 class="text-5xl font-heading text-primary mb-4">安徽省轮廓裁剪示例</h1>
      <p class="text-xl text-secondary">使用安徽省 SVG 蒙版裁剪黄山风景图片</p>
    </div>
    
    <div class="relative">
      <ImageShapeClip
        imageName="黄山风景"
        shape="mask"
        maskImageName="安徽省"
        :width="500"
        :height="649"
        :scale="1"
        :offsetX="0"
        :offsetY="0"
        :border-width="2"
        border-color="#ffffff"
      />
    </div>
    
    <div class="mt-8 text-center">
      <p class="text-lg text-tertiary">
        组件：ImageShapeClip | 蒙版：安徽省.svg | 图片：黄山风景.jpg
      </p>
    </div>
  </DefaultContainer>
  <DefaultContainer class="w-full h-full bg-background flex flex-col items-center justify-center p-8">
    <div class="text-center mb-8">
      <h1 class="text-5xl font-heading text-primary mb-4">安徽省轮廓裁剪示例</h1>
      <p class="text-xl text-secondary">使用安徽省 SVG 蒙版裁剪黄山风景图片</p>
    </div>
    
    <div class="relative">
      <ImageShapeClip
        imageName="黄山风景"
        shape="mask"
        maskImageName="安徽省"
        :width="500"
        :height="649"
        :scale="1"
        :offsetX="0"
        :offsetY="0"
        :border-width="2"
        border-color="#ffffff"
      />
    </div>
    
    <div class="mt-8 text-center">
      <p class="text-lg text-tertiary">
        组件：ImageShapeClip | 蒙版：安徽省.svg | 图片：黄山风景.jpg
      </p>
    </div>
  </DefaultContainer>
</template>