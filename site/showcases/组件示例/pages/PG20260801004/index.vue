<script setup lang="ts">
import ContentSlide from '@workspace-components/CMP20260605006/v/2'
import AssetVideo from '@runtime-kit/public/components/assets/AssetVideo.v1.vue'
</script>

<template>
  <ContentSlide
    title="视频资源渲染示例"
    subtitle="使用 AssetVideo 渲染工作空间视频资源"
    footer="Web Presentation · 资源渲染示例"
    :show-logo="true"
    :show-page-number="true"
  >
    <div class="flex h-full w-full gap-8">
      <!-- 左侧说明 -->
      <aside class="flex w-[400px] shrink-0 flex-col gap-3">
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">资源信息</p>
          <h3 class="mb-1 text-xl font-semibold text-primary font-heading">recording-2026-05-26-20-01-39</h3>
          <p class="text-lg text-secondary">MP4 屏幕录制 · render_type=video</p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">渲染方式</p>
          <p class="text-xl leading-relaxed text-primary">
            原生 video 播放器，支持控件、封面、静音循环与行内播放。
          </p>
        </div>
        <div class="rounded-xl border border-border-subtle bg-background p-4">
          <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">使用要点</p>
          <ul class="space-y-1.5 text-lg text-secondary">
            <li>· controls 播放控件默认开启</li>
            <li>· fit=contain 完整展示画面</li>
            <li>· posterName 可绑定封面资源</li>
          </ul>
        </div>
      </aside>

      <!-- 右侧渲染区 -->
      <section class="flex min-h-0 flex-1 flex-col gap-3">
        <div class="flex-1 min-h-0 overflow-hidden rounded-xl border border-border bg-background-invert p-3">
          <AssetVideo name="recording-2026-05-26-20-01-39" controls class="h-full w-full" />
        </div>
        <p class="px-1 text-sm text-secondary">浏览器内直接播放，无需额外依赖</p>
      </section>
    </div>
  </ContentSlide>
</template>
