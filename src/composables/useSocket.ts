import { useSocketStore } from "@/stores/socket";
import type { Message } from "@/types/chat";

export function useSocket() {
  const socketStore = useSocketStore();

  const subscribeToChat = async (chatId: number): Promise<void> => {
    if (!socketStore.socket) return;

    return new Promise((resolve) => {
      socketStore.socket!.emit("subscribeToChat", chatId, (response: any) => {
        if (response.success) {
          resolve();
        }
      });
    });
  };

  const getChatHistory = async (chatId: number): Promise<Message[]> => {
    if (!socketStore.socket) return [];

    return new Promise((resolve) => {
      socketStore.socket!.emit("getChatHistory", chatId, (response: any) => {
        if (response.success && response.messages) {
          resolve(response.messages.reverse());
        } else {
          resolve([]);
        }
      });
    });
  };

  const unsubscribeFromChat = async (chatId: number): Promise<void> => {
    if (!socketStore.socket) return;

    return new Promise((resolve) => {
      socketStore.socket!.emit("unsubscribeFromChat", chatId, resolve);
    });
  };

  const sendMessage = (message: Partial<Message>) => {
    socketStore.socket?.emit("sendMessage", message);
  };

  return {
    socket: socketStore.socket,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage,
    getChatHistory,
  };
}
