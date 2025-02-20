export interface User {
  id: number;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  createTime: string;
}
