<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  avatar?: string;
  username: string;
  size?: "sm" | "md" | "lg";
}>();

// 计算尺寸类名
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-8 h-8 text-sm";
    case "lg":
      return "w-12 h-12 text-xl";
    default:
      return "w-10 h-10 text-base";
  }
});

// 生成背景颜色
const backgroundColor = computed(() => {
  const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
  const index = props.username.charCodeAt(0) % colors.length;
  return colors[index];
});

// 获取用户名首字符
const initial = computed(() => props.username.charAt(0).toUpperCase());
</script>

<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden',
      sizeClass,
    ]"
  >
    <template v-if="avatar">
      <img :src="avatar" :alt="username" class="w-full h-full object-cover" />
    </template>
    <template v-else>
      <div
        :style="{ backgroundColor }"
        class="w-full h-full flex items-center justify-center text-white font-medium"
      >
        {{ initial }}
      </div>
    </template>
  </div>
</template>
