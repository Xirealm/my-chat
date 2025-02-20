export interface Chat {
  id: number;
  type: "private" | "group";
  updatedAt: string;
  avatar: string | undefined;
  name: string;
}
