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
  type: "text" | "file";
  file?: {
    id: number;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    createdAt: string;
  };
}
