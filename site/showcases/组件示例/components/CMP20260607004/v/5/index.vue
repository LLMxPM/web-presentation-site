<script setup lang="ts">
import { computed } from 'vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'

const props = withDefaults(defineProps<{
  /** 图片资源逻辑名数组，支持 3~5 张，第一张为左侧，最后一张为右侧，中间为展示区 */
  images: string[]
  /** 左右两侧倾斜角度，单位度 */
  tiltAngle?: number
  /** 组件整体宽度，支持任意 CSS 值 */
  containerWidth?: string
  /** 组件整体高度，支持任意 CSS 值 */
  containerHeight?: string
  /** 图片间距 */
  gap?: string
  /** 边框样式类名，支持 Tailwind CSS */
  borderClass?: string
  /** 图片填充方式 */
  fitMode?: 'contain' | 'cover' | 'fill'
}>(), {
  tiltAngle: 25,
  containerWidth: '1200px',
  containerHeight: '420px',
  gap: '24px',
  borderClass: 'rounded-xl shadow-lg',
  fitMode: 'cover'
})

const PERSPECTIVE_DISTANCE = 1200

// ========== 数值解析 ==========
const containerWNum = computed(() => {
  const match = props.containerWidth.match(/([\d.]+)/)
  return match ? parseFloat(match[1]) : 1200
})
const containerHNum = computed(() => {
  const match = props.containerHeight.match(/([\d.]+)/)
  return match ? parseFloat(match[1]) : 420
})
const gapNum = computed(() => {
  const match = props.gap.match(/([\d.]+)/)
  return match ? parseFloat(match[1]) : 24
})
const widthUnit = computed(() => {
  const match = props.containerWidth.match(/[a-zA-Z%]+$/)
  return match ? match[0] : 'px'
})
const heightUnit = computed(() => {
  const match = props.containerHeight.match(/[a-zA-Z%]+$/)
  return match ? match[0] : 'px'
})

// ========== 图片数量 ==========
const imageCount = computed(() => props.images.length)

// ========== 宽度缩放比例（补偿透视导致的视觉变窄） ==========
const widthScale = computed(() => {
  const angleRad = (props.tiltAngle * Math.PI) / 180
  return 1 / Math.cos(angleRad)
})

// ========== 安全内边距计算（防止透视变形内容被裁切） ==========
const safePaddingNum = computed(() => {
  const angleRad = (props.tiltAngle * Math.PI) / 180
  const n = Math.max(imageCount.value, 1)

  // 初步估算单张图片宽度
  const estW = (containerWNum.value - (n - 1) * gapNum.value) / n

  // 宽度方向因缩放比例多出的物理尺寸
  const extraW = estW * (widthScale.value - 1)

  // 高度方向因透视多出的尺寸（近似）
  const offset = estW / 2
  const edgeDist = PERSPECTIVE_DISTANCE + offset * Math.tan(angleRad)
  const estHeightScale = edgeDist / PERSPECTIVE_DISTANCE
  const extraH = containerHNum.value * (estHeightScale - 1)

  const maxExtra = Math.max(extraW, extraH)
  // 限制安全边距不超过容器宽度的 20%，避免极端参数导致负可用空间
  return Math.ceil(Math.min(maxExtra + 24, containerWNum.value * 0.2))
})

// ========== 可用内部空间（减去安全边距后） ==========
const availW = computed(() => containerWNum.value - 2 * safePaddingNum.value)
const availH = computed(() => containerHNum.value - 2 * safePaddingNum.value)

// ========== 单张图片基准宽度 ==========
const baseWidthNum = computed(() => {
  const n = imageCount.value
  if (n <= 1) return availW.value
  return (availW.value - (n - 1) * gapNum.value) / n
})

// ========== 图片基准高度 ==========
const baseHeightNum = computed(() => availH.value)

// ========== 高度缩放比例（补偿透视导致的视觉变矮） ==========
const heightScale = computed(() => {
  const angleRad = (props.tiltAngle * Math.PI) / 180
  const offset = baseWidthNum.value / 2
  const edgeDistance = PERSPECTIVE_DISTANCE + offset * Math.tan(angleRad)
  return edgeDistance / PERSPECTIVE_DISTANCE
})

// ========== 倾斜图片物理尺寸 ==========
const tiltWidth = computed(() =>
  `${(baseWidthNum.value * widthScale.value).toFixed(1)}${widthUnit.value}`
)
const tiltHeight = computed(() =>
  `${(baseHeightNum.value * heightScale.value).toFixed(1)}${heightUnit.value}`
)

// ========== 负边距修复透视弯曲带来的视觉间隙 ==========
const marginFix = computed(() => {
  const angleRad = (props.tiltAngle * Math.PI) / 180
  const W = baseWidthNum.value
  const d = PERSPECTIVE_DISTANCE
  const zOffset = (W / 2) * Math.tan(angleRad)
  const visualX = (W / 2) * (d / (d + zOffset))
  const physicalX = (W * widthScale.value) / 2
  const offset = physicalX - visualX
  return `-${offset.toFixed(1)}${widthUnit.value}`
})

// ========== 容器样式 ==========
const containerStyle = computed(() => ({
  width: props.containerWidth,
  height: props.containerHeight,
  padding: `${safePaddingNum.value}${widthUnit.value}`,
  gap: props.gap
}))

// ========== 倾斜图片样式 ==========
const getTiltStyle = (direction: 'left' | 'right') => {
  const isLeft = direction === 'left'
  return {
    width: tiltWidth.value,
    height: tiltHeight.value,
    marginRight: isLeft ? marginFix.value : '0',
    marginLeft: isLeft ? '0' : marginFix.value,
    transform: `perspective(${PERSPECTIVE_DISTANCE}px) rotateY(${isLeft ? props.tiltAngle : -props.tiltAngle}deg)`,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.4s ease'
  }
}

// ========== 中间图片样式 ==========
const middleStyle = computed(() => ({
  width: `${baseWidthNum.value.toFixed(1)}${widthUnit.value}`,
  height: `${baseHeightNum.value.toFixed(1)}${heightUnit.value}`,
  transform: `perspective(${PERSPECTIVE_DISTANCE}px) rotateY(0deg)`,
  transformStyle: 'preserve-3d' as const
}))

// ========== 图片数据拆分 ==========
const leftImage = computed(() => props.images[0])
const rightImage = computed(() => props.images[props.images.length - 1])
const middleImages = computed(() => props.images.slice(1, -1))
</script>

<template>
  <div class="flex items-center justify-center box-border overflow-hidden" :style="containerStyle">
    <div
      v-if="leftImage"
      class="flex-shrink-0 overflow-hidden"
      :class="borderClass"
      :style="getTiltStyle('left')"
    >
      <AssetImage
        :name="leftImage"
        class="w-full h-full"
        :fit="fitMode"
      />
    </div>

    <div
      v-for="(img, index) in middleImages"
      :key="'middle-' + index"
      class="flex-shrink-0 overflow-hidden"
      :class="borderClass"
      :style="middleStyle"
    >
      <AssetImage
        :name="img"
        class="w-full h-full"
        :fit="fitMode"
      />
    </div>

    <div
      v-if="rightImage"
      class="flex-shrink-0 overflow-hidden"
      :class="borderClass"
      :style="getTiltStyle('right')"
    >
      <AssetImage
        :name="rightImage"
        class="w-full h-full"
        :fit="fitMode"
      />
    </div>
  </div>
</template>
