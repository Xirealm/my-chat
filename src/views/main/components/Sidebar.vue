<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { ChatIcon, ContactIcon } from "@/components/icons";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const currentPath = computed(() => route.path);
const userStore = useUserStore();

// 导航菜单项
const navItems = [
  {
    path: "/main/chat",
    icon: ChatIcon,
    title: "聊天",
  },
  {
    path: "/main/contacts",
    icon: ContactIcon,
    title: "联系人",
  },
];
</script>

<template>
  <div class="flex h-full">
    <!-- 左侧导航栏 -->
    <div
      class="w-[70px] h-full bg-gray-50 flex flex-col items-center py-4 border-r border-gray-100"
    >
      <!-- 头像部分 -->
      <div class="mb-8 cursor-pointer relative group">
        <img
          :src="userStore.userInfo?.avatar"
          class="w-12 h-12 rounded-full object-cover border-1 border-white shadow-sm hover:border-blue-300 transition-all duration-200"
        />
        <div
          class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          :class="{
            'bg-green-500': userStore.userInfo?.status === 'online',
            'bg-yellow-500': userStore.userInfo?.status === 'away',
            'bg-gray-400': userStore.userInfo?.status === 'offline',
          }"
        ></div>
      </div>

      <!-- 导航菜单 -->
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="relative w-12 h-12 mb-4 flex items-center justify-center rounded-xl transition-all duration-200"
        :class="[
          currentPath === item.path
            ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
            : 'text-gray-500 hover:bg-gray-100 hover:text-blue-500',
        ]"
      >
        <!-- 选中指示器 -->
        <div
          v-if="currentPath === item.path"
          class="absolute -left-1 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r"
        ></div>

        <component :is="item.icon" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  position: relative;
}
</style>
