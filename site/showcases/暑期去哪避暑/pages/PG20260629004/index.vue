<script setup lang="ts">
import DefaultContainer from '@runtime-kit/public/components/page/layout/DefaultContainer.v1.vue'
import AssetImage from '@runtime-kit/public/components/assets/AssetImage.v1.vue'
</script>

<template>
  <DefaultContainer>
    <div class="relative h-full w-full bg-background flex flex-col">
      <!-- 顶部区域 -->
      <div class="flex-shrink-0 px-[72px] pt-[64px]">
        <p class="text-accent3-600 text-4xl font-extrabold tracking-wider mb-1">03</p>
        <h2 class="text-primary text-5xl font-bold mb-1">入园指南</h2>
        <p class="text-primary/50 text-lg mb-6">线上预约 + 现场登记，随心选择</p>

        <!-- 方式一 -->
        <div class="bg-primary/5 rounded-2xl px-6 py-5 mb-4 border border-primary/10">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-accent3-600 text-white text-sm font-bold px-3 py-1 rounded-lg">优先推荐</span>
            <h4 class="text-primary text-2xl font-bold">方式一：线上预约</h4>
          </div>
          <ol class="space-y-1.5 list-decimal list-inside text-primary/55 text-base leading-relaxed">
            <li>微信 / 支付宝搜索<span class="text-primary font-semibold">「天柱山旅游官方平台」</span>小程序；</li>
            <li>选择「天柱山门票预订」通道 → 任意爬山入口 →「去购票」→ 选择<span class="text-primary font-semibold">「天柱骄子月」0元票</span> → 填写姓名、身份证号后提交购票；</li>
            <li>购票成功即预约成功，预约日期携带相关证件至检票口核验入园。</li>
          </ol>
        </div>

        <!-- 方式二 -->
        <div class="bg-primary/5 rounded-2xl px-6 py-4 mb-5 border border-primary/10">
          <div class="flex items-center gap-2 mb-2">
            <span class="bg-primary/15 text-primary text-sm font-bold px-3 py-1 rounded-lg">临时出游</span>
            <h4 class="text-primary text-2xl font-bold">方式二：现场登记</h4>
          </div>
          <p class="text-primary/55 text-base leading-relaxed">
            未提前线上预约的游客，前往天柱山游客中心各人工窗口，出示本人身份证及相关优惠证件，现场办理免费入园。
          </p>
        </div>

        <!-- 温馨提醒 -->
        <div class="flex items-start gap-2 bg-accent4-600/8 rounded-xl px-5 py-3">
          <span class="text-accent4-600 text-lg">💡</span>
          <p class="text-primary/50 text-sm leading-relaxed">
            暑期为客流高峰，为提升您的游览体验，建议提前线上购票预约哦！
          </p>
        </div>
      </div>

      <!-- 底部图片 -->
      <div class="flex-1 px-[72px] pt-4 pb-[64px] min-h-0">
        <AssetImage
          name="天柱山日出云海"
          alt="天柱山日出云海"
          fit="cover"
          class="w-full h-full rounded-[40px] border-0 bg-transparent overflow-hidden"
        />
      </div>
    </div>
  </DefaultContainer>
</template>
