<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="app-container">
    <!-- <div class="title-bar">
    </div> -->
    <!-- 其他内容 -->
    <router-view></router-view>
  </div>
</template>

<style>
.app-container {
  height: 100vh;
  width: 100vw;
}

.title-bar {
  height: 30px;
  background: #f5f5f5;
  -webkit-app-region: drag; /* 使该区域可拖动 */
  /* 如果标题栏中有按钮，需要将按钮设置为不可拖动 */
}

/* 如果标题栏中有按钮，添加以下样式 */
.title-bar button {
  -webkit-app-region: no-drag;
}
</style>
