<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { getPrivateChatAPI } from "@/api/chat";
import ContactList from "./components/ContactList.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const currentUser = ref();

watchEffect(() => {
  const userId = Number(route.params.id);
  if (userId) {
    currentUser.value = userStore.users.find((user) => user.id === userId);
  }
});

// 处理发送消息按钮点击
const handleSendMessage = async () => {
  if (!currentUser.value) return;
  try {
    const { chatId } = await getPrivateChatAPI(currentUser.value.id);
    console.log(chatId);

    // 跳转到聊天页面
    router.push({
      path: "/main/chat",
      query: { chatId: chatId },
    });
  } catch (error) {
    console.error("创建聊天失败:", error);
  }
};
</script>

<template>
  <div class="flex h-full">
    <ContactList />

    <div class="flex-1 h-full bg-white overflow-hidden">
      <div v-if="currentUser" class="h-full flex flex-col">
        <!-- 顶部信息栏 -->
        <div
          class="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0"
        >
          <div class="flex items-center space-x-3">
            <h2 class="text-base font-medium text-gray-900">用户资料</h2>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <!-- 用户基本信息 -->
            <div class="flex items-center space-x-4 mb-6">
              <UserAvatar
                :username="currentUser.username"
                size="lg"
                class="!w-20 !h-20 !text-3xl"
              />
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h1 class="text-xl font-medium text-gray-900">
                    {{ currentUser.username }}
                  </h1>
                  <span
                    class="text-xs text-gray-500 px-2 py-0.5 bg-gray-50 rounded-full"
                  >
                    ID: {{ currentUser.id }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mb-2">
                  <span
                    class="inline-block w-2 h-2 rounded-full mr-1"
                    :class="
                      currentUser.status === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    "
                  ></span>
                  {{ currentUser.status === "online" ? "在线" : "离线" }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ currentUser.bio || "这个人很懒，什么都没写" }}
                </p>
              </div>
            </div>

            <!-- 信息卡片网格布局 -->
            <div class="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              <!-- 基本信息卡片 -->
              <div
                class="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-sm transition-shadow"
              >
                <h3
                  class="text-sm font-medium text-gray-900 mb-4 flex items-center"
                >
                  <span class="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                  基本信息
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">昵称</span>
                    <span class="text-sm text-gray-900">{{
                      currentUser.nickname || "未设置"
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">性别</span>
                    <span class="text-sm text-gray-900">{{
                      currentUser.gender || "未设置"
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">地区</span>
                    <span class="text-sm text-gray-900">{{
                      currentUser.location || "未设置"
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- 社交信息卡片 -->
              <div
                class="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-sm transition-shadow"
              >
                <h3
                  class="text-sm font-medium text-gray-900 mb-4 flex items-center"
                >
                  <span class="w-1 h-4 bg-green-500 rounded mr-2"></span>
                  社交信息
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">个性签名</span>
                    <span class="text-sm text-gray-900">{{
                      currentUser.bio || "这个人很懒，什么都没写"
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">添加时间</span>
                    <span class="text-sm text-gray-900">2024-01-01</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div
          class="h-16 px-6 border-t border-gray-100 flex items-center justify-end space-x-4 shrink-0 bg-white"
        >
          <button
            class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            删除好友
          </button>
          <button
            class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 shadow-sm"
            @click="handleSendMessage"
          >
            发送消息
          </button>
        </div>
      </div>

      <!-- 未选择用户时的提示 -->
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        <p>请选择一个联系人查看详情</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
