import { useSocketStore } from "@/stores/socket";
import type { Message } from "@/types/chat";
import { ref } from "vue";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";

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

  const uploadFile = async (
    file: File,
    chatId: number,
    onProgress?: (progress: number) => void
  ): Promise<any> => {
    if (!socketStore.socket) return;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {        
          const result = await socketStore.socket!.emitWithAck("uploadFile", {
            file: e.target?.result,
            filename: file.name,
            mimetype: file.type,
            chatId: chatId,
          });
          if (result.success) {
            resolve(result.message);
          } else {
            reject(new Error("File upload failed"));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };

      reader.onerror = () => reject("File reading failed");
      reader.readAsArrayBuffer(file);
    });
  };

  return {
    socket: socketStore.socket,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage,
    getChatHistory,
    uploadFile,
  };
}
