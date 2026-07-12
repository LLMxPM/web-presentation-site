<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <div class="flex-shrink-0 px-[72px] pt-[56px]">
        <p class="text-accent3-600 text-4xl font-extrabold tracking-wider mb-1">05</p>
        <h2 class="text-primary text-5xl font-bold mb-1">奔赴天柱山</h2>
        <p class="text-primary/40 text-xl mb-5">解锁夏日限定山野浪漫</p>

        <!-- 图 1：云海风光 -->
        <div class="h-[240px] mb-4">
          <AssetImage
            name="天柱山云海风光"
            alt="天柱山云海风光"
            fit="cover"
            class="w-full h-full rounded-[28px] border-0 bg-transparent overflow-hidden"
          />
        </div>

        <!-- 双栏：云海 + 文脉 -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-background-subtle rounded-2xl px-5 py-4 border border-border/40">
            <h4 class="text-primary text-xl font-bold mb-1.5">☁️ 赴云海之约</h4>
            <p class="text-primary/50 text-sm leading-relaxed">
              立于天池峰、漫步青龙背，层层流云如瀑布奔涌。云雾漫卷，山河辽阔，每一步都置身缥缈空灵的山水秘境。
            </p>
          </div>
          <div class="bg-background-subtle rounded-2xl px-5 py-4 border border-border/40">
            <h4 class="text-primary text-xl font-bold mb-1.5">📜 寻千年文脉</h4>
            <p class="text-primary/50 text-sm leading-relaxed">
              触摸山谷流泉千年石刻，读懂李白「奇峰出奇云」的意境。这座山，本身就是一部立体的文学史。
            </p>
          </div>
        </div>

        <!-- 图 2：蓬莱峰天梯 -->
        <div class="h-[230px] mb-4">
          <AssetImage
            name="蓬莱峰天梯"
            alt="蓬莱峰天梯"
            fit="cover"
            class="w-full h-full rounded-[28px] border-0 bg-transparent overflow-hidden"
          />
        </div>

        <!-- 双栏：蓬莱峰 + 清凉 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-background-subtle rounded-2xl px-5 py-4 border border-border/40">
            <h4 class="text-primary text-xl font-bold mb-1.5">🏔 登蓬莱峰</h4>
            <p class="text-primary/50 text-sm leading-relaxed">
              石阶蜿蜒直插云霄，亿万年花岗岩峰丛造就通天奇观——这不是神话，是天柱山给你的真实震撼。
            </p>
          </div>
          <div class="bg-background-subtle rounded-2xl px-5 py-4 border border-border/40">
            <h4 class="text-primary text-xl font-bold mb-1.5">🌿 独享18℃清凉</h4>
            <p class="text-primary/50 text-sm leading-relaxed">
              97% 森林覆盖率，夏季恒温 18℃–22℃。山林蔽日，溪涧潺潺，解锁专属夏日的天然空调秘境。
            </p>
          </div>
        </div>
      </div>

      <!-- 底部留白 -->
      <div class="flex-1 min-h-0 pb-[48px]" />
    </div>
  </DefaultContainer>
</template>
