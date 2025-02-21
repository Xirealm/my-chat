<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ChatIcon, ContactIcon, LogoutIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth";
import { useSocketStore } from "@/stores/socket"; // 添加这一行
import { postLogoutAPI } from "@/api/auth";
import { ElMessageBox } from "element-plus";
import UserAvatar from "@/components/UserAvatar.vue";

const route = useRoute();
const router = useRouter();
const currentPath = computed(() => route.path);
const authStore = useAuthStore();
const socketStore = useSocketStore(); // 添加这一行

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

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm("确定要退出登录吗？", "退出登录", {
      confirmButtonText: "退出",
      cancelButtonText: "取消",
      customClass: "modern-message-box",
      distinguishCancelAndClose: true,
      confirmButtonClass: "modern-confirm-button",
      cancelButtonClass: "modern-cancel-button",
      showClose: false,
    });
    await postLogoutAPI();
    socketStore.disconnect(); // 添加这一行，断开 WebSocket 连接
    authStore.clearUserInfo();
    router.push("/login");
  } catch (error) {
    // 用户取消操作，不做处理
  }
};

// 修改计算属性
const isPathActive = (path: string) => {
  return route.path.startsWith(path);
};
</script>

<template>
  <div class="flex h-full">
    <!-- 左侧导航栏 -->
    <div
      class="w-[70px] h-full bg-gray-50 flex flex-col items-center py-4 border-r border-gray-100"
    >
      <!-- 头像部分 -->
      <div class="mb-8 cursor-pointer relative group">
        <UserAvatar
          :avatar="authStore.userInfo?.avatar"
          :username="authStore.userInfo?.username || '未知用户'"
          size="lg"
        />
        <div
          class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          :class="{
            'bg-green-500': authStore.userInfo?.status === 'online',
            'bg-yellow-500': authStore.userInfo?.status === 'away',
            'bg-gray-400': authStore.userInfo?.status === 'offline',
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
          isPathActive(item.path)
            ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
            : 'text-gray-500 hover:bg-gray-100 hover:text-blue-500',
        ]"
      >
        <!-- 选中指示器 -->
        <div
          v-if="isPathActive(item.path)"
          class="absolute -left-1 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r"
        ></div>

        <component :is="item.icon" />
      </router-link>

      <!-- 底部退出按钮 -->
      <div class="mt-auto">
        <button
          class="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
          @click="handleLogout"
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  position: relative;
}
</style>

<style>
/* 添加全局样式 */
.modern-message-box {
  border-radius: 12px !important;
  padding: 24px !important;
  background: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
}

.modern-message-box .el-message-box__header {
  padding: 0 !important;
  margin-bottom: 16px !important;
}

.modern-message-box .el-message-box__title {
  font-size: 18px !important;
  color: #1a1a1a !important;
  font-weight: 600 !important;
}

.modern-message-box .el-message-box__content {
  padding: 0 !important;
  font-size: 15px !important;
  color: #4a4a4a !important;
  margin-bottom: 24px !important;
}

.modern-message-box .el-message-box__btns {
  padding: 0 !important;
}

.modern-confirm-button {
  background: #ef4444 !important;
  border: none !important;
  padding: 10px 24px !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.modern-confirm-button:hover {
  background: #dc2626 !important;
  transform: translateY(-1px) !important;
}

.modern-cancel-button {
  background: #f3f4f6 !important;
  border: none !important;
  padding: 10px 24px !important;
  border-radius: 8px !important;
  color: #4b5563 !important;
  font-weight: 500 !important;
  margin-right: 12px !important;
  transition: all 0.2s ease !important;
}

.modern-cancel-button:hover {
  background: #e5e7eb !important;
  transform: translateY(-1px) !important;
}
</style>
