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

    // 更新单个聊天的最后消息
    const updateChatLastMessage = (chatId: number, message: any) => {
      const chat = chatList.value.find((c) => c.id === chatId);
      if (chat) {
        chat.lastMessage = {
          content: message.content,
          type: message.type,
        };
        chat.updatedAt = new Date().toLocaleString();

        // 重新排序聊天列表
        chatList.value.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
    };

    return {
      chatList,
      fetchChats,
      updateChatList,
      updateChatLastMessage,
    };
  },
  {
    persist: true,
  }
);
