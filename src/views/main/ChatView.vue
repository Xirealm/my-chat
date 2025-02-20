<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import ChatList from "./components/ChatList.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { EmojiIcon, FileIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { io } from "socket.io-client";
import { onMounted } from "vue";

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();

// 当前聊天信息
const currentChat = ref();

// 当前聊天数据
const loading = ref(false);

// 监听路由变化更新当前聊天信息
watchEffect(() => {
  if (route.params.chatId) {
    currentChat.value = chatStore.chatList.find(
      (chat) => chat.id === Number(route.params.chatId)
    );
  } else {
    currentChat.value = null;
  }
});

// onMounted(() => {
//   const socket = io("http://localhost:3000/chat", {
//     transports: ["websocket"],
//     auth: {
//       authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImlhdCI6MTczOTk3MTAxOCwiZXhwIjoxNzQwMDU3NDE4fQ.UGaLH6Z7vmSKUmgYaVHJ8U2DTpuSkRNuj0cy93yho5U",
//     },
//   });

//   socket.on("connect", () => {
//     console.log("Connected to WebSocket");
//   });

//   socket.on("error", (error) => {
//     console.error("WebSocket error:", error);
//   });

//   socket.on("newMessage", (message) => {
//     console.log("Received message:", message);
//   });

//   // 测试发送消息
//   setTimeout(() => {
//     socket.emit("sendMessage", {
//       content: "这是测试消息666",
//       timestamp: new Date(),
//       receiverId: 2,
//     });
//   }, 2000);
// });

const messageText = ref("");

const handleSendMessage = () => {
  if (!messageText.value.trim()) return;
  console.log("发送消息:", messageText.value);
  messageText.value = "";
};
</script>

<template>
  <div class="flex h-full">
    <ChatList />

    <div class="flex-1 h-full bg-white">
      <!-- 加载状态 -->
      <div v-if="loading" class="h-full flex items-center justify-center">
        <p class="text-gray-500">加载中...</p>
      </div>

      <!-- 未选择聊天时的提示 -->
      <div
        v-else-if="!currentChat"
        class="h-full flex items-center justify-center"
      >
        <p class="text-gray-500">请选择一个聊天</p>
      </div>

      <!-- 聊天界面 -->
      <div v-else class="h-full flex flex-col">
        <!-- 顶部信息栏 -->
        <div
          class="h-16 px-6 border-b border-gray-100 flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <UserAvatar
              :username="currentChat.name"
              :avatar="currentChat.avatar"
              size="md"
            />
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-medium text-gray-900">
                  {{ currentChat.name }}
                </h2>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"
                ></span>
                在线
              </p>
            </div>
          </div>
        </div>

        <!-- 聊天内容区域 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <!-- 对方的消息 -->
          <div class="flex items-start space-x-3">
            <UserAvatar
              :username="currentChat.name"
              :avatar="currentChat.avatar"
              size="sm"
            />
            <div class="flex flex-col items-start max-w-[70%]">
              <div
                class="bg-white px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm"
              >
                <p class="text-sm text-gray-700 break-words">
                  这是一条示例消息，展示对方发送的内容
                </p>
              </div>
              <span class="text-xs text-gray-400 mt-1 ml-1">12:30</span>
            </div>
          </div>

          <!-- 自己的消息 -->
          <div class="flex items-start justify-end space-x-3">
            <div class="flex flex-col items-end max-w-[70%]">
              <div
                class="bg-blue-500 px-4 py-2 rounded-2xl rounded-tr-sm shadow-sm"
              >
                <p class="text-sm text-white break-words">
                  这是一条示例回复，展示自己发送的内容
                </p>
              </div>
              <span class="text-xs text-gray-400 mt-1 mr-1">12:31</span>
            </div>
            <UserAvatar
              :username="authStore.userInfo?.username || ''"
              :avatar="authStore.userInfo?.avatar"
              size="sm"
            />
          </div>

          <!-- 时间分割线 -->
          <div class="flex items-center justify-center py-2">
            <div class="flex-1 h-[1px] bg-gray-200"></div>
            <span class="text-xs text-gray-400 bg-gray-50 px-4"
              >昨天 12:30</span
            >
            <div class="flex-1 h-[1px] bg-gray-200"></div>
          </div>
        </div>

        <!-- 底部输入区域 -->
        <div class="border-t border-gray-100 bg-white">
          <!-- 工具栏 -->
          <div
            class="h-10 px-4 flex items-center space-x-4 border-b border-gray-100"
          >
            <button
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <EmojiIcon class="w-5 h-5" />
            </button>
            <button
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FileIcon class="w-5 h-5" />
            </button>
          </div>
          <!-- 输入框区域 -->
          <div class="flex flex-col p-3">
            <div class="mb-2 min-h-[72px] max-h-36 relative">
              <textarea
                v-model="messageText"
                rows="3"
                placeholder="输入消息..."
                class="w-full h-full resize-none border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none custom-scrollbar absolute inset-0"
                @keydown.enter.prevent="handleSendMessage"
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button
                class="h-8 px-4 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!messageText.trim()"
                @click="handleSendMessage"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped >
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 2px;  
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 40px 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.2);
  border-radius: 10px;
  transition: background-color 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.4);
}

/* 隐藏滚动条上下箭头 */
.custom-scrollbar::-webkit-scrollbar-button {
  display: none;
}
</style>
