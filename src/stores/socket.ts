import { defineStore } from "pinia";
import { ref } from "vue";
import { io, Socket } from "socket.io-client";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const reconnectAttempts = ref(0);
  const savedToken = ref<string>("");

  const initSocket = (token: string) => {
    if (socket.value?.connected) return;
    savedToken.value = token;

    socket.value = io("http://localhost:3000/chat", {
      transports: ["websocket"],
      auth: {
        authorization: "Bearer " + token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.value.on("connect", () => {
      console.log("Connected to WebSocket");
      isConnected.value = true;
    });

    socket.value.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      isConnected.value = false;
    });

    socket.value.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
      reconnectAttempts.value = attempt;
    });

    socket.value.on("reconnect", () => {
      console.log("Reconnected to WebSocket");
      reconnectAttempts.value = 0;
      isConnected.value = true;
    });

    socket.value.on("reconnect_failed", () => {
      console.log("Failed to reconnect after maximum attempts");
      reconnectAttempts.value = 0;
    });
  };

  const disconnect = () => {
    socket.value?.disconnect();
    socket.value = null;
    isConnected.value = false;
  };

  return {
    socket,
    isConnected,
    reconnectAttempts,
    initSocket,
    disconnect,
  };
});
