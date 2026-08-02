<script setup lang="ts">
import ThreeLineTable from '@workspace-components/CMP20260605001/v/2'

// 基础表格列配置
const basicColumns = [
  { key: 'name', title: '姓名', width: '25%' },
  { key: 'department', title: '部门', width: '25%' },
  { key: 'position', title: '职位', width: '25%' },
  { key: 'joinDate', title: '入职日期', width: '25%' }
]

// 基础表格数据
const basicRows = [
  { name: '张三', department: '研发部', position: '高级工程师', joinDate: '2022-03-15' },
  { name: '李四', department: '产品部', position: '产品经理', joinDate: '2021-08-20' },
  { name: '王五', department: '设计部', position: 'UI 设计师', joinDate: '2023-01-10' }
]

// 销售数据列配置
const salesColumns = [
  { key: 'quarter', title: '季度', width: '20%', align: 'center' as const },
  { key: 'revenue', title: '营收（万元）', width: '25%', align: 'right' as const },
  { key: 'profit', title: '利润（万元）', width: '25%', align: 'right' as const },
  { key: 'growth', title: '同比增长', width: '30%', align: 'right' as const }
]

// 销售数据
const salesRows = [
  { quarter: 'Q1', revenue: '1,250', profit: '320', growth: '+12.5%' },
  { quarter: 'Q2', revenue: '1,480', profit: '410', growth: '+18.4%' },
  { quarter: 'Q3', revenue: '1,620', profit: '485', growth: '+9.5%' },
  { quarter: 'Q4', revenue: '1,850', profit: '560', growth: '+14.2%' }
]
</script>

<template>
  <div class="relative h-full w-full overflow-hidden bg-background">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-background to-background-subtle opacity-50"></div>
    
    <!-- 主内容区 -->
    <div class="relative z-10 h-full w-full flex flex-col p-12">
      <!-- 标题区 -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold text-primary mb-3 font-heading">
          三线表组件示例
        </h1>
        <p class="text-xl text-secondary">
          展示 ThreeLineTable 组件的基本用法和数据展示效果
        </p>
      </div>
      
      <!-- 表格展示区 -->
      <div class="flex-1 grid grid-cols-2 gap-10">
        <!-- 左侧：基础表格 -->
        <div class="flex flex-col">
          <h2 class="text-2xl font-semibold text-primary mb-4 font-heading">
            员工信息表
          </h2>
          <div class="flex-1 bg-background rounded-xl p-6 shadow-sm border border-border-subtle">
            <ThreeLineTable
              :columns="basicColumns"
              :rows="basicRows"
              caption="2024 年度新入职员工名单"
              font-size="lg"
            />
          </div>
        </div>
        
        <!-- 右侧：带对齐的数据表格 -->
        <div class="flex flex-col">
          <h2 class="text-2xl font-semibold text-primary mb-4 font-heading">
            季度销售报表
          </h2>
          <div class="flex-1 bg-background rounded-xl p-6 shadow-sm border border-border-subtle">
            <ThreeLineTable
              :columns="salesColumns"
              :rows="salesRows"
              caption="2024 年度销售业绩汇总"
              font-size="lg"
              bordered
            />
          </div>
        </div>
      </div>
      
      <!-- 底部说明 -->
      <div class="mt-8 pt-4 border-t border-border-subtle">
        <p class="text-base text-secondary">
          <span class="font-medium text-primary">三线表特点：</span>
          仅保留顶部粗线、表头底线和底部粗线，简洁专业，适用于正式文档和数据报告展示
        </p>
      </div>
    </div>
  </div>
</template>