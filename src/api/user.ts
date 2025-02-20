import http from "@/utils/http";
import type { User } from "@/types/user";
/**
 * 获取所有用户列表
 */
export const getAllUsersAPI = ():any => {
  return http.get<User[]>("/users");
};
