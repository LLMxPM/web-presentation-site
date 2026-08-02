<script setup lang="ts">
import { computed } from 'vue'
import { useAssetSrc } from '@runtime-kit/public/composables/assets/useAssetSrc.v1'

const props = withDefaults(defineProps<{
  /** 工作空间图片资源名 */
  imageName: string
  /** 裁切形状 */
  shape?: 'circle' | 'ellipse' | 'diamond' | 'hexagon' | 'heart' | 'star' | 'triangle' | 'rounded-rect' | 'custom' | 'mask'
  /** 自定义 SVG path d（shape=custom 时生效，百分比相对于组件宽高） */
  customClipPathD?: string
  /** SVG 蒙版资源名（shape=mask 时生效） */
  maskImageName?: string
  /** 组件宽度 (px) */
  width?: number
  /** 组件高度 (px) */
  height?: number
  /** 图片等比缩放比例，1=原尺寸 */
  scale?: number
  /** 图片水平偏移 (px)，正值向右 */
  offsetX?: number
  /** 图片垂直偏移 (px)，正值向下 */
  offsetY?: number
  /** 形状边框宽度 (px)，0=无边框 */
  borderWidth?: number
  /** 边框颜色 */
  borderColor?: string
}>(), {
  shape: 'circle',
  width: 300,
  height: 300,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  borderWidth: 0,
  borderColor: '#ffffff',
})

const emit = defineEmits<{
  (e: 'load'): void
  (e: 'error'): void
}>()

// --- 资源 ---
const imageSrc = useAssetSrc(() => props.imageName)
const maskSrc = useAssetSrc(() => props.maskImageName ?? '')

// --- 尺寸（形状直接填满 width × height，无 contain 缩放） ---
const rW = computed(() => props.width)
const rH = computed(() => props.height)

// --- 是否 mask 模式 ---
const isMaskMode = computed(() => props.shape === 'mask' && !!props.maskImageName)

// --- CSS clip-path ---
const clipPathCSS = computed(() => {
  if (isMaskMode.value) return 'none'

  switch (props.shape) {
    case 'circle':
      return 'circle(50% at 50% 50%)'
    case 'ellipse':
      return 'ellipse(50% 50% at 50% 50%)'
    case 'diamond':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    case 'hexagon':
      return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    case 'heart': {
      const rw = rW.value
      const rh = rH.value
      return `path('M${rw * 0.5},${rh * 0.88} C${rw * 0.25},${rh * 0.65} 0,${rh * 0.4} 0,${rh * 0.25} C0,${rh * 0.1} ${rw * 0.12},0 ${rw * 0.25},0 C${rw * 0.35},0 ${rw * 0.42},${rh * 0.05} ${rw * 0.5},${rh * 0.15} C${rw * 0.58},${rh * 0.05} ${rw * 0.65},0 ${rw * 0.75},0 C${rw * 0.88},0 ${rw},${rh * 0.1} ${rw},${rh * 0.25} C${rw},${rh * 0.4} ${rw * 0.75},${rh * 0.65} ${rw * 0.5},${rh * 0.88} Z')`
    }
    case 'star':
      return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    case 'triangle':
      return 'polygon(50% 5%, 95% 95%, 5% 95%)'
    case 'rounded-rect':
      return 'none'
    case 'custom':
      return props.customClipPathD ? `path('${props.customClipPathD}')` : 'none'
    default:
      return 'circle(50% at 50% 50%)'
  }
})

// --- border-radius（rounded-rect） ---
const borderRadiusStyle = computed(() => {
  if (props.shape !== 'rounded-rect' || isMaskMode.value) return {}
  const r = Math.min(rW.value, rH.value) * 0.08
  return { borderRadius: `${r}px` }
})

// --- mask CSS ---
const maskStyle = computed(() => {
  if (!isMaskMode.value) return {}
  const url = maskSrc.value
  if (!url) return {}
  return {
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  }
})

// --- SVG 边框路径（使用真实像素坐标，viewBox 对齐 width×height） ---
const borderD = computed(() => {
  const w = rW.value
  const h = rH.value
  const cx = w / 2
  const cy = h / 2

  switch (props.shape) {
    case 'circle': {
      // CSS circle(50%) 半径 = sqrt(w²+h²)/√2 × 0.5
      const r = Math.sqrt(w * w + h * h) / Math.SQRT2 * 0.5
      return `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx},${cy + r} A ${r},${r} 0 1,1 ${cx},${cy - r} Z`
    }
    case 'ellipse': {
      const rx = w * 0.5
      const ry = h * 0.5
      return `M ${cx},${cy - ry} A ${rx},${ry} 0 1,1 ${cx},${cy + ry} A ${rx},${ry} 0 1,1 ${cx},${cy - ry} Z`
    }
    case 'diamond':
      return `M ${cx},0 L ${w},${cy} L ${cx},${h} L 0,${cy} Z`
    case 'hexagon':
      return `M ${w * 0.25},0 L ${w * 0.75},0 L ${w},${cy} L ${w * 0.75},${h} L ${w * 0.25},${h} L 0,${cy} Z`
    case 'heart':
      return `M${cx},${h * 0.88} C${w * 0.25},${h * 0.65} 0,${h * 0.4} 0,${h * 0.25} C0,${h * 0.1} ${w * 0.12},0 ${w * 0.25},0 C${w * 0.35},0 ${w * 0.42},${h * 0.05} ${cx},${h * 0.15} C${w * 0.58},${h * 0.05} ${w * 0.65},0 ${w * 0.75},0 C${w * 0.88},0 ${w},${h * 0.1} ${w},${h * 0.25} C${w},${h * 0.4} ${w * 0.75},${h * 0.65} ${cx},${h * 0.88} Z`
    case 'star':
      return `M ${cx},0 L ${w * 0.61},${h * 0.35} L ${w * 0.98},${h * 0.35} L ${w * 0.68},${h * 0.57} L ${w * 0.79},${h * 0.91} L ${cx},${h * 0.70} L ${w * 0.21},${h * 0.91} L ${w * 0.32},${h * 0.57} L ${w * 0.02},${h * 0.35} L ${w * 0.39},${h * 0.35} Z`
    case 'triangle':
      return `M ${cx},${h * 0.05} L ${w * 0.95},${h * 0.95} L ${w * 0.05},${h * 0.95} Z`
    case 'rounded-rect':
      return `M ${w * 0.08},0 L ${w * 0.92},0 C ${w * 0.96},0 ${w},${h * 0.04} ${w},${h * 0.08} L ${w},${h * 0.92} C ${w},${h * 0.96} ${w * 0.96},${h} ${w * 0.92},${h} L ${w * 0.08},${h} C ${w * 0.04},${h} 0,${h * 0.96} 0,${h * 0.92} L 0,${h * 0.08} C 0,${h * 0.04} ${w * 0.04},0 ${w * 0.08},0 Z`
    case 'custom':
      return props.customClipPathD || ''
    case 'mask':
      return ''
    default:
      return ''
  }
})

const hasBorder = computed(() => props.borderWidth > 0 && !isMaskMode.value)

function onLoad() { emit('load') }
function onError() { emit('error') }
</script>

<template>
  <div
    class="relative inline-block"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <!-- 裁切层：形状直接填满 width × height -->
    <div
      class="w-full h-full overflow-hidden"
      :style="{
        clipPath: clipPathCSS,
        ...borderRadiusStyle,
        ...maskStyle,
      }"
    >
      <!-- 图片缩放偏移层：唯一控制图片大小的入口 -->
      <div
        class="w-full h-full"
        :style="{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: '0 0',
        }"
      >
        <img
          :src="imageSrc"
          class="w-full h-full object-cover"
          style="object-position: center"
          @load="onLoad"
          @error="onError"
        />
      </div>
    </div>

    <!-- 形状边框 overlay：SVG viewBox 对齐 width×height，路径用真实像素坐标 -->
    <svg
      v-if="hasBorder"
      class="absolute inset-0 pointer-events-none"
      :viewBox="`0 0 ${rW} ${rH}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="borderD"
        :stroke="borderColor"
        :stroke-width="borderWidth"
        fill="none"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  </div>
</template>
