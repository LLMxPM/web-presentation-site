<script setup lang="ts">
import { computed } from 'vue'

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
  /** 文字大小，Tailwind 字体大小类如 xs/sm/base/lg/xl/2xl 等 */
  fontSize?: string
  /** 表格最大高度 */
  maxHeight?: string
}>(), {
  caption: '',
  fontSize: 'lg',
  maxHeight: ''
})

const tableStyle = computed(() => {
  if (props.maxHeight) {
    return { maxHeight: props.maxHeight, overflowY: 'auto' }
  }
  return {}
})
const fontSizeClass = computed(() => {
  return `text-${props.fontSize}`
})

function getCellValue(row: Row, column: Column) {
  return row[column.key] ?? ''
}

function getAlignClass(align?: string) {
  switch (align) {
    case 'center': return 'text-center'
    case 'right': return 'text-right'
    default: return 'text-left'
  }
}
</script>

<template>
  <div class="w-full overflow-hidden">
    <!-- 标题 -->
    <div v-if="caption" :class="['mb-3 font-semibold text-primary', fontSizeClass]">
      {{ caption }}
    </div>
    
    <!-- 表格容器 -->
    <div :style="tableStyle" class="overflow-x-auto">
      <table class="w-full border-collapse">
        <!-- 表头 -->
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'py-3 px-4 font-medium text-secondary',
                fontSizeClass,
                getAlignClass(column.align)
              ]"
              :style="column.width ? { width: column.width } : {}"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        
        <!-- 表体 -->
        <tbody>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'py-3 px-4 text-primary',
                fontSizeClass,
                getAlignClass(column.align)
              ]"
            >
              {{ getCellValue(row, column) }}
            </td>
          </tr>
        </tbody>
        
        <!-- 表尾 -->
        <tfoot>
          <tr>
            <td :colspan="columns.length"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 三线表核心样式 */
table thead tr {
  border-top: 2px solid var(--tw-color-border-default, #e5e7eb);
  border-bottom: 1px solid var(--tw-color-border-default, #e5e7eb);
}

table tfoot tr {
  border-bottom: 2px solid var(--tw-color-border-default, #e5e7eb);
}
</style>