<script setup lang="ts">
import { computed } from 'vue'
import DataTable from '@runtime-kit/public/components/data/DataTable.v1.vue'

interface Column {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface Row {
  [key: string]: any
}

const props = withDefaults(defineProps<{
  /** 表头列配置 */
  columns: Column[]
  /** 数据行 */
  rows: Row[]
  /** 表格标题 */
  caption?: string
  /** 文字大小 */
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  /** 整体宽度 */
  width?: string
  /** 整体高度，设置后行高自动均分 */
  height?: string
}>(), {
  caption: '',
  fontSize: '2xl',
  width: '100%',
  height: ''
})

// 字号映射到 Tailwind 类
const fontSizeTailwindMap: Record<string, string> = {
  'xs': 'text-xs',
  'sm': 'text-sm',
  'base': 'text-base',
  'lg': 'text-lg',
  'xl': 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl'
}

const fontSizeClass = fontSizeTailwindMap[props.fontSize] || 'text-2xl'

// 构建 DataTable 的二维 rows 格式
const tableRows = computed(() => {
  const result: any[][] = []

  // 表头行
  const headerRow = props.columns.map((col) => ({
    text: col.title,
    class: 'text-secondary font-medium',
    style: { textAlign: col.align || 'left' }
  }))
  result.push(headerRow)

  // 数据行
  props.rows.forEach((row) => {
    const dataRow = props.columns.map((col) => ({
      text: row[col.key] ?? '',
      class: 'text-primary',
      style: { textAlign: col.align || 'left' }
    }))
    result.push(dataRow)
  })

  return result
})

// 构建列宽配置
const columnsStyle = computed(() => {
  const result: Record<string, { width: string }> = {}
  props.columns.forEach((col, index) => {
    if (col.width) {
      result[String(index)] = { width: col.width }
    }
  })
  return Object.keys(result).length > 0 ? result : undefined
})

// 构建 DataTable styles（三线表样式）
const tableStyles = computed(() => {
  const styles: Record<string, any> = {
    cell: {
      class: `${fontSizeClass} text-secondary bg-white`
    },
    table: {
      border: {
        top: { color: 'var(--tw-color-border, #d1d5db)', width: 3, style: 'solid' },
        bottom: { color: 'var(--tw-color-border, #d1d5db)', width: 3, style: 'solid' },
        left: 'none',
        right: 'none',
        innerHorizontal: 'none'
      }
    },
    rows: {
      '0': {
        class: `${fontSizeClass} text-primary font-semibold`,
        border: {
          bottom: { color: 'var(--tw-color-border, #d1d5db)', width: 2, style: 'solid' }
        }
      }
    }
  }

  if (columnsStyle.value) {
    styles.columns = columnsStyle.value
  }

  return styles
})

const containerStyle = computed(() => {
  const style: Record<string, string> = { width: props.width }
  if (props.height) {
    style.height = props.height
  }
  return style
})
</script>

<template>
  <div class="flex flex-col overflow-hidden" :style="containerStyle">
    <!-- 标题 -->
    <div v-if="caption" :class="['shrink-0 mb-2 font-semibold text-primary', fontSizeClass]">
      {{ caption }}
    </div>

    <!-- 空态 -->
    <div v-if="rows.length === 0" class="flex-1 flex items-center justify-center text-gray-400">
      暂无数据
    </div>

    <!-- 数据表格 -->
    <DataTable
      v-else
      :rows="tableRows"
      :header-rows="1"
      :styles="tableStyles"
      class="w-full"
      :class="height ? 'flex-1 min-h-0' : ''"
    />
  </div>
</template>