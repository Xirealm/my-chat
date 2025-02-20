import { defineStore } from "pinia";
import { ref } from "vue";
import type { Chat } from "@/types/chat";
import { getChatsAPI } from "@/api/chat";

export const useChatStore = defineStore(
  "chat",
  () => {
    const chatList = ref<Chat[]>([]);

    // 获取聊天列表
    const fetchChats = async () => {
      try {
        const chats = await getChatsAPI();
        chatList.value = chats;
      } catch (error) {
        console.error("获取聊天列表失败:", error);
      }
    };

    // 更新聊天列表
    const updateChatList = (chats: Chat[]) => {
      chatList.value = chats;
    };

    return {
      chatList,
      fetchChats,
      updateChatList,
    };
  },
  {
    persist: true,
  }
);
