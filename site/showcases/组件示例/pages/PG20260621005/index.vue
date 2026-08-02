<template>
  <div class="perspective-demo-page bg-background p-10 h-full w-full">
    <div class="h-full w-full flex flex-col">
      <!-- 页面标题 -->
      <header class="text-center shrink-0 mb-8">
        <h1 class="text-6xl font-heading text-primary">3D透视组件示例</h1>
        <p class="text-xl font-body text-secondary mt-3">Perspective3D 静态可配置角度的 3D 透视容器</p>
      </header>

      <!-- 示例网格：4 列展示 -->
      <div class="grid grid-cols-4 gap-8 flex-1 min-h-0">
        <!-- 示例1：左侧倾斜30° -->
        <div class="example-card flex flex-col">
          <h2 class="text-3xl font-heading text-primary mb-4 text-center">左侧倾斜 30°</h2>
          <div class="flex-1 flex justify-center items-center min-h-[300px]">
            <Perspective3D :rotateY="30" perspective="800px" width="300px" height="200px">
              <div class="w-full h-full bg-primary/10 rounded-xl border border-border flex items-center justify-center">
                <p class="text-lg font-body text-center text-primary">rotateY: 30°</p>
              </div>
            </Perspective3D>
          </div>
          <p class="text-lg font-body text-center text-secondary mt-4">perspective: 800px</p>
        </div>

        <!-- 示例2：上仰倾斜20° -->
        <div class="example-card flex flex-col">
          <h2 class="text-3xl font-heading text-primary mb-4 text-center">上仰倾斜 20°</h2>
          <div class="flex-1 flex justify-center items-center min-h-[300px]">
            <Perspective3D :rotateX="-20" perspective="900px" width="300px" height="200px">
              <div class="w-full h-full bg-secondary/10 rounded-xl border border-border flex items-center justify-center">
                <p class="text-lg font-body text-center text-primary">rotateX: -20°</p>
              </div>
            </Perspective3D>
          </div>
          <p class="text-lg font-body text-center text-secondary mt-4">perspective: 900px</p>
        </div>

        <!-- 示例3：复合旋转 -->
        <div class="example-card flex flex-col">
          <h2 class="text-3xl font-heading text-primary mb-4 text-center">复合旋转</h2>
          <div class="flex-1 flex justify-center items-center min-h-[300px]">
            <Perspective3D :rotateX="15" :rotateY="25" :rotateZ="5" perspective="1000px" width="300px" height="200px">
              <div class="w-full h-full bg-accent2/10 rounded-xl border border-border flex items-center justify-center">
                <p class="text-lg font-body text-center text-primary">X 15° · Y 25° · Z 5°</p>
              </div>
            </Perspective3D>
          </div>
          <p class="text-lg font-body text-center text-secondary mt-4">perspective: 1000px</p>
        </div>

        <!-- 示例4：强透视效果 -->
        <div class="example-card flex flex-col">
          <h2 class="text-3xl font-heading text-primary mb-4 text-center">强透视效果</h2>
          <div class="flex-1 flex justify-center items-center min-h-[300px]">
            <Perspective3D :rotateY="-40" perspective="500px" width="300px" height="200px">
              <div class="w-full h-full bg-accent3/10 rounded-xl border border-border flex items-center justify-center">
                <p class="text-lg font-body text-center text-primary">rotateY: -40°</p>
              </div>
            </Perspective3D>
          </div>
          <p class="text-lg font-body text-center text-secondary mt-4">perspective: 500px</p>
        </div>
      </div>

      <!-- 组件特性 -->
      <div class="mt-8 shrink-0 bg-background-subtle rounded-2xl border border-border px-10 py-7">
        <div class="grid grid-cols-2 gap-10">
          <div>
            <h3 class="text-2xl font-heading text-primary mb-3">可配置参数</h3>
            <div class="flex flex-wrap gap-3">
              <span class="chip">rotateX</span>
              <span class="chip">rotateY</span>
              <span class="chip">rotateZ</span>
              <span class="chip">perspective</span>
              <span class="chip">transformOrigin</span>
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-heading text-primary mb-3">使用场景</h3>
            <div class="flex flex-wrap gap-3">
              <span class="chip">卡片立体展示</span>
              <span class="chip">图片 3D 倾斜</span>
              <span class="chip">数据可视化</span>
              <span class="chip">产品展示</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Perspective3D from '@workspace-components/CMP20260621002/v/1'
</script>

<style scoped>
.perspective-demo-page {
  height: 100%;
}

.example-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.75rem;
  border: 1px solid var(--tw-color-border-default, #e5e7eb);
  transition: all 0.3s ease;
}

.example-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: var(--tw-color-text-secondary, #64748b);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--tw-color-border-default, #e5e7eb);
}
</style>
