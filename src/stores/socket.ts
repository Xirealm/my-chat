import { defineStore } from "pinia";
import { ref } from "vue";
import { io, Socket } from "socket.io-client";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref<Socket | null>(null);

  const initSocket = (token: string) => {
    if (socket.value?.connected) return;

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

  const disconnect = () => {
    socket.value?.disconnect();
    socket.value = null;
  };

  return {
    socket,
    initSocket,
    disconnect,
  };
});
