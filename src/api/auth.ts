import http from "@/utils/http";
import type {
  LoginParams,
  RegisterParams,
  LoginResult,
  UserInfo,
} from "@/types/auth";

/**
 * 用户登录
 */
export const postLoginAPI = (params: LoginParams): any => {
  return http.post<LoginResult>("/auth/login", params);
};

/**
 * 用户注册
 */
export const postRegisterAPI = (params: RegisterParams) => {
  return http.post<LoginResult>("/auth/register", params);
};

/**
 * 用户登出
 */
export const postLogoutAPI = () => {
  return http.post<null>("/auth/logout");
};

// 以下均未实现

/**
 * 获取当前用户信息
 */
export const getCurrentUserAPI = () => {
  return http.get<UserInfo>("/auth/current");
};

/**
 * 刷新token
 */
export const postRefreshTokenAPI = () => {
  return http.post<{ token: string }>("/auth/refresh");
};
