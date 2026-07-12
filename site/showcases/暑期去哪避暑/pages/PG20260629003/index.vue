<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <!-- 顶部区域 -->
      <div class="flex-shrink-0 px-[72px] pt-[64px]">
        <p class="text-accent3-600 text-4xl font-extrabold tracking-wider mb-1">02</p>
        <h2 class="text-primary text-5xl font-bold mb-1">免票人群</h2>
        <p class="text-primary/50 text-lg mb-6">谁可以免票？带什么证件？</p>

        <!-- 四类人群 -->
        <div class="space-y-2 mb-6">
          <!-- 人群 1 -->
          <div class="flex gap-3">
            <div class="w-11 h-11 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
              <span class="text-invert text-xl font-extrabold">一</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-primary text-xl font-bold">18周岁及以下未成年人</h4>
              <p class="text-primary/45 text-base">核验材料：本人有效实体身份证</p>
            </div>
          </div>

          <!-- 人群 2 -->
          <div class="flex gap-3">
            <div class="w-11 h-11 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
              <span class="text-invert text-xl font-extrabold">二</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-primary text-xl font-bold">全日制在校生</h4>
              <p class="text-primary/45 text-base">核验材料：本人身份证 + 学生证（或学信网在线验证报告）</p>
              <p class="text-primary/30 text-sm">覆盖全日制本科、高职、专科、研究生</p>
            </div>
          </div>

          <!-- 人群 3 -->
          <div class="flex gap-3">
            <div class="w-11 h-11 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
              <span class="text-invert text-xl font-extrabold">三</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-primary text-xl font-bold">2026年应届中、高考考生</h4>
              <p class="text-primary/45 text-base">核验材料：本人身份证 + 准考证</p>
            </div>
          </div>

          <!-- 人群 4 -->
          <div class="flex gap-3">
            <div class="w-11 h-11 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
              <span class="text-invert text-xl font-extrabold">四</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-primary text-xl font-bold">全国在职教师</h4>
              <p class="text-primary/45 text-base">核验材料：本人身份证 + 教师资格证</p>
            </div>
          </div>
        </div>

        <!-- 重要须知 -->
        <div class="bg-primary/5 rounded-2xl px-6 py-4 border border-primary/10">
          <h4 class="text-primary text-lg font-bold mb-2">📋 重要须知</h4>
          <ol class="space-y-1.5 list-decimal list-inside text-primary/50 text-base leading-relaxed">
            <li>所有免票人群需在游客中心现场购买 <span class="text-primary font-semibold">5元/人</span> 旅游意外险。</li>
            <li>非全日制、函授、自考、网络教育、成人高考等非全日制学历群体，不参与本次免票活动。</li>
            <li>入园需携带本人真实有效证件，严禁转借、冒用、伪造证件，一经查实，将取消入园资格并依法追责。</li>
          </ol>
        </div>
      </div>

      <!-- 底部图片 -->
      <div class="flex-1 px-[72px] pt-4 pb-[64px] min-h-0">
        <AssetImage
          name="天柱山云海奇石"
          alt="天柱山云海奇石"
          fit="cover"
          class="w-full h-full rounded-[40px] border-0 bg-transparent overflow-hidden"
        />
      </div>
    </div>
  </DefaultContainer>
</template>
