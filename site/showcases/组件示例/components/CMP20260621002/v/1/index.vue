<template>
  <div
    class="perspective-3d-wrapper"
    :style="wrapperStyle"
  >
    <div
      class="perspective-3d-stage"
      :style="stageStyle"
    >
      <div
        class="perspective-3d-content"
        :style="contentStyle"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Perspective3DProps {
  /** 绕X轴旋转角度（度） */
  rotateX?: number
  /** 绕Y轴旋转角度（度） */
  rotateY?: number
  /** 绕Z轴旋转角度（度） */
  rotateZ?: number
  /** 透视距离（CSS perspective 值，如 '1000px'、'800px'） */
  perspective?: string
  /** 变换原点（CSS transform-origin 值，如 'center center'、'left top'） */
  transformOrigin?: string
  /** 容器宽度 */
  width?: string
  /** 容器高度 */
  height?: string
}

const props = withDefaults(defineProps<Perspective3DProps>(), {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: '1000px',
  transformOrigin: 'center center',
  width: '100%',
  height: 'auto',
})

const wrapperStyle = computed(() => ({
  width: props.width,
  height: props.height,
}))

const stageStyle = computed(() => ({
  perspective: props.perspective,
  perspectiveOrigin: props.transformOrigin,
}))

const contentStyle = computed(() => ({
  transform: `rotateX(${props.rotateX}deg) rotateY(${props.rotateY}deg) rotateZ(${props.rotateZ}deg)`,
  transformOrigin: props.transformOrigin,
}))
</script>

<style scoped>
.perspective-3d-wrapper {
  display: inline-block;
  overflow: visible;
}

.perspective-3d-stage {
  width: 100%;
  height: 100%;
}

.perspective-3d-content {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  backface-visibility: visible;
}
</style>
