<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <!-- 顶部区域 -->
      <div class="flex-shrink-0 px-[72px] pt-[64px]">
        <p class="text-accent3-600 text-4xl font-extrabold tracking-wider mb-1">04</p>
        <h2 class="text-primary text-5xl font-bold mb-5">交通出行</h2>

        <!-- 高铁直达 -->
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🚄</span>
            <h4 class="text-primary text-2xl font-bold">高铁直达（潜山站）</h4>
          </div>
          <div class="bg-background-subtle rounded-xl px-5 py-3 space-y-1.5 text-base">
            <p class="text-primary/55"><span class="text-primary font-semibold">合肥方向</span>　约1小时（G2795/G2697/G8393 等 8 趟）</p>
            <p class="text-primary/55"><span class="text-primary font-semibold">上海方向</span>　约4小时30分（G7080/D2216/D3090 等 7 趟）</p>
            <p class="text-primary/55"><span class="text-primary font-semibold">南京方向</span>　约2小时（G2781/G7081/D2217 等 10 趟）</p>
            <p class="text-primary/55"><span class="text-primary font-semibold">杭州方向</span>　约3小时（G7436/G1437/G7592）</p>
          </div>
        </div>

        <!-- 直通车 -->
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🚌</span>
            <h4 class="text-primary text-2xl font-bold">官方旅游直通车</h4>
          </div>
          <div class="bg-background-subtle rounded-xl px-5 py-3 text-base space-y-1">
            <p class="text-primary/55"><span class="text-primary font-semibold">上车点</span>　潜山站出站左转 20 米 · 天柱山旅游集散中心</p>
            <p class="text-primary/55"><span class="text-primary font-semibold">票价</span>　10 元 / 人</p>
            <p class="text-primary/55"><span class="text-primary font-semibold">终点</span>　天柱山茶庄游客中心（景区主入口）</p>
          </div>
        </div>

        <!-- 普速 -->
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🚂</span>
            <h4 class="text-primary text-2xl font-bold">普速直达（天柱山站）</h4>
          </div>
          <div class="bg-background-subtle rounded-xl px-5 py-3 space-y-1 text-sm">
            <p class="text-primary/50"><span class="text-primary font-semibold text-base">合肥方向</span>　K611 / K8451 / T221 / K1071，约 2.5–3 小时</p>
            <p class="text-primary/40">南京 · 上海 · 杭州方向 → 推荐合肥站中转</p>
          </div>
        </div>

        <!-- 服务信息 -->
        <div class="flex items-start gap-2 bg-primary/5 rounded-xl px-5 py-3 text-sm text-primary/45 leading-relaxed">
          <span class="text-base flex-shrink-0">📞</span>
          <p>
            <span class="text-primary font-semibold">12306</span> 官网/APP 可预约重点旅客服务 ·
            <span class="text-primary font-semibold">潜山站服务台</span> 0556-5165410 ·
            潜山站<span class="text-primary font-semibold">「宜行」雷锋服务站</span>为您的旅途排忧解难
          </p>
        </div>
      </div>

      <!-- 底部图片 -->
      <div class="flex-1 px-[72px] pt-4 pb-[64px] min-h-0">
        <AssetImage
          name="潜山站航拍夜景"
          alt="潜山站航拍夜景"
          fit="cover"
          class="w-full h-full rounded-[40px] border-0 bg-transparent overflow-hidden"
        />
      </div>
    </div>
  </DefaultContainer>
</template>
