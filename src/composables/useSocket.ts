import { ref } from "vue";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/types/chat";

export function useSocket(token: string) {
  const socket = ref<Socket | null>(null);

  const initSocket = () => {
    socket.value = io("http://localhost:3000/chat", {
      transports: ["websocket"],
      auth: {
        authorization: "Bearer " + token,
      },
    });

    socket.value.on("connect", () => {
      console.log("Connected to WebSocket");
    });
  };

  const subscribeToChat = async (chatId: number): Promise<Message[]> => {
    if (!socket.value) return [];

    return new Promise((resolve) => {
      socket.value!.emit("subscribeToChat", chatId, (response: any) => {
        if (response.success && response.messages) {
          resolve(response.messages.reverse());
        } else {
          resolve([]);
        }
      });
    });
  };

  const unsubscribeFromChat = async (chatId: number): Promise<void> => {
    if (!socket.value) return;

    return new Promise((resolve) => {
      socket.value!.emit("unsubscribeFromChat", chatId, resolve);
    });
  };

  const sendMessage = (message: Partial<Message>) => {
    socket.value?.emit("sendMessage", message);
  };

  return {
    socket,
    initSocket,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage,
  };
}
