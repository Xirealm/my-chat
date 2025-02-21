<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import type { Message, Chat } from "@/types/chat.d";
import { useSocket } from "@/composables/useSocket";
import ChatList from "./components/ChatList.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { EmojiIcon, FileIcon, DownloadIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { formatTime, formatFileSize } from "@/utils/format";
import FileUploadDialog from "@/components/FileUploadDialog.vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();

// 状态管理
const currentChat = ref<Chat | null>(null);
const loading = ref(false);
const messages = ref<Message[]>([]);
const messageText = ref("");
const messageContainer = ref<any>(null);

// 初始化 WebSocket
const {
  socket,
  subscribeToChat,
  unsubscribeFromChat,
  sendMessage,
  getChatHistory,
} = useSocket();

// 消息滚动处理
const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    const scrollbar = messageContainer.value;
    scrollbar.setScrollTop(scrollbar.wrapRef.scrollHeight);
  }
};

// 监听路由变化，更新当前聊天
watch(
  () => route.params.chatId,
  async (newChatId) => {
    if (newChatId) {
      const chatId = Number(newChatId);
      currentChat.value =
        chatStore.chatList.find((chat: Chat) => chat.id === chatId) || null;

      if (currentChat.value) {
        loading.value = true;
        messages.value = [];
        try {
          // 获取历史消息
          const historicalMessages = await getChatHistory(chatId);
          messages.value = historicalMessages;
        } finally {
          loading.value = false;
          scrollToBottom();
        }
      }
    } else {
      currentChat.value = null;
    }
  },
  { immediate: true }
);

// 处理新消息监听时的滚动逻辑也需要修改
onMounted(() => {
  if (!socket) return;

  socket.on("newMessage", async (message: Message) => {
    // 只有当消息属于当前聊天时才添加到当前消息列表中
    if (currentChat.value && message.chatId === currentChat.value.id) {
      messages.value.push(message);
      await scrollToBottom();
    }
    // 更新聊天列表
    await chatStore.fetchChats();
  });
});

// 发送消息处理
const handleSendMessage = () => {
  const trimmedMessage = messageText.value.trim();
  if (!trimmedMessage || !currentChat.value) return;

  sendMessage({
    content: trimmedMessage,
    chatId: currentChat.value.id,
  });

  messageText.value = "";
};

// 添加文件上传相关状态
const showFileDialog = ref(false);
const selectedFile = ref<File | null>(null);

// 添加文件选择处理函数
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    showFileDialog.value = true;
  }
  // 重置 input 以便可以选择相同的文件
  input.value = "";
};

// 文件发送处理函数
const handleFileSend = async () => {
  if (!selectedFile.value || !currentChat.value) return;

  try {
    const message = await useSocket().uploadFile(
      selectedFile.value,
      currentChat.value.id,
      (progress) => {
        console.log("Upload progress:", progress);
      }
    );
    // 消息会通过 socket 的 newMessage 事件自动添加到消息列表
  } catch (error) {
    console.error("文件上传失败:", error);
    ElMessage.error("文件上传失败");
  } finally {
    selectedFile.value = null;
    showFileDialog.value = false;
  }
};

// 添加文件上传取消处理函数
const handleFileCancel = () => {
  selectedFile.value = null;
};

// 修改文件下载处理函数
const handleFileDownload = async (message: Message) => {
  if (!message.file) return;

  try {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseURL}${message.file.path}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = message.file.filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("文件下载失败:", error);
    ElMessage.error("文件下载失败");
  }
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
        <el-scrollbar
          ref="messageContainer"
          class="flex-1 bg-gray-50"
          wrap-class="p-6 space-y-4"
          :height="'100%'"
        >
          <template v-for="message in messages" :key="message.id">
            <!-- 对方的消息 -->
            <div
              v-if="message.senderId != authStore.userInfo?.id"
              class="flex items-start space-x-3"
            >
              <UserAvatar
                :username="currentChat.name"
                :avatar="currentChat.avatar"
                size="sm"
              />
              <div class="flex flex-col items-start max-w-[70%]">
                <!-- 根据消息类型显示不同内容 -->
                <div
                  :class="[
                    message.type === 'text'
                      ? 'bg-white px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm'
                      : 'bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors',
                  ]"
                >
                  <!-- 文本消息 -->
                  <p
                    v-if="message.type === 'text'"
                    class="text-sm text-gray-700 break-words min-w-[0] max-w-[280px] whitespace-pre-wrap"
                  >
                    {{ message.content }}
                  </p>

                  <!-- 文件消息 -->
                  <template v-if="message.type === 'file'">
                    <div
                      class="flex items-center gap-3 px-4 py-3 cursor-pointer group w-[280px]"
                      @click="handleFileDownload(message)"
                    >
                      <div class="p-2 rounded-lg bg-blue-50">
                        <FileIcon class="w-6 h-6 text-blue-500" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">
                          {{ message.file?.filename }}
                        </p>
                        <div class="text-xs mt-0.5 space-y-0.5 text-gray-500">
                          <p>{{ formatFileSize(message.file?.size || 0) }}</p>
                          <!-- <p>类型：{{ message.file?.mimetype || "未知" }}</p> -->
                        </div>
                      </div>
                      <div
                        class="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
                      >
                        <DownloadIcon class="w-5 h-5" />
                      </div>
                    </div>
                  </template>
                </div>
                <span class="text-xs text-gray-400 mt-1 ml-1">
                  {{ formatTime(message.createdAt) }}
                </span>
              </div>
            </div>

            <!-- 自己的消息 -->
            <div v-else class="flex items-start justify-end space-x-3">
              <div class="flex flex-col items-end max-w-[70%]">
                <!-- 根据消息类型显示不同内容 -->
                <div
                  :class="[
                    message.type === 'text'
                      ? 'bg-blue-500 px-4 py-2 rounded-2xl rounded-tr-sm shadow-sm'
                      : 'bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 transition-colors',
                  ]"
                >
                  <!-- 文本消息 -->
                  <p
                    v-if="message.type === 'text'"
                    class="text-sm text-white break-words min-w-[0] max-w-[280px] whitespace-pre-wrap"
                  >
                    {{ message.content }}
                  </p>

                  <!-- 文件消息 -->
                  <template v-if="message.type === 'file'">
                    <div
                      class="flex items-center gap-3 px-4 py-3 cursor-pointer group w-[280px]"
                      @click="handleFileDownload(message)"
                    >
                      <div class="bg-blue-400 p-2 rounded-lg">
                        <FileIcon class="w-6 h-6 text-white" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">
                          {{ message.file?.filename }}
                        </p>
                        <div class="text-xs text-blue-100 mt-0.5 space-y-0.5">
                          <p>{{ formatFileSize(message.file?.size || 0) }}</p>
                          <!-- <p>类型：{{ message.file?.mimetype || "未知" }}</p> -->
                        </div>
                      </div>
                      <div
                        class="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <DownloadIcon class="w-5 h-5" />
                      </div>
                    </div>
                  </template>
                </div>
                <span class="text-xs text-gray-400 mt-1 mr-1">
                  {{ formatTime(message.createdAt) }}
                </span>
              </div>
              <UserAvatar
                :username="authStore.userInfo?.username || ''"
                :avatar="authStore.userInfo?.avatar"
                size="sm"
              />
            </div>
          </template>
        </el-scrollbar>

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
            <label
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <input type="file" class="hidden" @change="handleFileSelect" />
              <FileIcon class="w-5 h-5" />
            </label>
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

  <!-- 添加文件上传对话框 -->
  <FileUploadDialog
    v-model:visible="showFileDialog"
    :file="selectedFile"
    @confirm="handleFileSend"
    @cancel="handleFileCancel"
  />
</template>

<style scoped>
:deep(.el-scrollbar__bar) {
  z-index: 10;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>
