import http from "@/utils/http";
import type { Chat } from "@/types/chat";

/**
 * 获取当前用户的聊天列表
 */
export const getChatsAPI = () => {
  return http.get<Chat[]>("/chats");
};

/**
 * 创建或获取私聊会话
 */
export const getPrivateChatAPI = (userId: number) => {
  return http.post<{ chatId: number }>("/chats/private", { userId });
};

/**
 * 获取单个聊天会话详情
 */
export const getChatByIdAPI = (chatId: number) => {
  return http.get<Chat>(`/chats/${chatId}`);
};
