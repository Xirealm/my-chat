<script setup lang="ts">
import ChatList from "./components/ChatList.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { EmojiIcon, FileIcon } from "@/components/icons";
import { useUserStore } from "@/stores/user";
import { io } from "socket.io-client";
import { onMounted } from "vue";

const userStore = useUserStore();

const currentChat = {
  username: "张三",
  avatar: "",
  online: true,
};

// onMounted(() => {
//   const socket = io("http://localhost:3000/chat", {
//     transports: ["websocket"],
//     auth: {
//       authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTczOTk0OTk5MSwiZXhwIjoxNzQwMDM2MzkxfQ.wB88EfOfOm3McbLni6cR5XH75hZz_eGvs4MRXSztzWA",
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
//       content: "这是一条测试消息",
//       timestamp: new Date(),
//       receiverId: 3,
//     });
//   }, 2000);
// });
</script>

<template>
  <div class="flex h-full">
    <!-- 左侧会话列表 -->
    <ChatList />

    <!-- 右侧聊天区域 -->
    <div class="flex-1 h-full bg-white">
      <div class="h-full flex flex-col">
        <!-- 顶部信息栏 -->
        <div
          class="h-16 px-6 border-b border-gray-100 flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <UserAvatar
              :username="currentChat.username"
              :avatar="currentChat.avatar"
              size="md"
            />
            <div>
              <h2 class="text-base font-medium text-gray-900">
                {{ currentChat.username }}
              </h2>
              <p class="text-xs text-gray-500">
                [{{ currentChat.online ? "在线" : "离线" }}]
              </p>
            </div>
          </div>
        </div>

        <!-- 聊天内容区域 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          <!-- 对方的消息 -->
          <div class="flex items-start space-x-4">
            <UserAvatar
              :username="currentChat.username"
              :avatar="currentChat.avatar"
              size="sm"
            />
            <div class="flex flex-col items-start">
              <span class="text-xs text-gray-400 mb-1">12:30</span>
              <div
                class="bg-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-md shadow-sm"
              >
                <p class="text-sm text-gray-700">
                  这是一条示例消息，展示对方发送的内容
                </p>
              </div>
            </div>
          </div>

          <!-- 自己的消息 -->
          <div class="flex items-start justify-end space-x-4">
            <div class="flex flex-col items-end">
              <span class="text-xs text-gray-400 mb-1">12:31</span>
              <div
                class="bg-blue-500 px-4 py-2 rounded-2xl rounded-tr-sm max-w-md shadow-sm"
              >
                <p class="text-sm text-white">
                  这是一条示例回复，展示自己发送的内容
                </p>
              </div>
            </div>
            <UserAvatar
              :username="userStore.userInfo?.username || ''"
              :avatar="userStore.userInfo?.avatar"
              size="sm"
            />
          </div>

          <!-- 时间分割线 -->
          <div class="flex items-center justify-center">
            <div class="flex-1 h-[1px] bg-gray-200"></div>
            <span class="text-xs text-gray-400 bg-gray-50 px-4"
              >昨天 12:30</span
            >
            <div class="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          <!-- 系统消息 -->
          <div class="flex justify-center">
            <span
              class="text-xs text-gray-400 bg-white px-4 py-1 rounded-full shadow-sm"
            >
              对方已成为你的好友，现在可以开始聊天了
            </span>
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
          <!-- 输入框 -->
          <div class="p-4">
            <textarea
              rows="3"
              placeholder="输入消息..."
              class="w-full resize-none border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
