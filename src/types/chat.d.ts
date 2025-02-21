export interface Chat {
  id: number;
  type: "private" | "group";
  updatedAt: string;
  avatar: string | undefined;
  name: string;
  lastMessage: {
    content: string;
    type: string;
  };
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
  createdAt: string;
}
