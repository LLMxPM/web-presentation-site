<!-- 文件功能：渲染站点页脚，把版权信息和备案号排在同一行；备案号未配置时只显示版权。 -->
<template>
  <footer class="site-footer">
    <span class="site-footer-copyright">© 2026 LLMxPM · Web-Presentation</span>
    <a
      v-if="beianNumber"
      class="site-footer-beian"
      :href="beianHref"
      target="_blank"
      rel="noopener noreferrer"
    >{{ beianNumber }}</a>
  </footer>
</template>

<script setup lang="ts">
/**
 * 备案号与跳转地址来自 config.mts 的 vite.define 注入：
 * 未配置时注入空字符串，页面只保留版权信息。
 */
const beianNumber = __SITE_BEIAN_NUMBER__;
const beianHref = __SITE_BEIAN_HREF__;
</script>
