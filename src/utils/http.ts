import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/http";
import { useAuthStore } from "@/stores/auth";

const axiosInstance = axios.create({
  // baseURL:"/api",
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>) => {
    const res = response.data;
    if (res.code !== 200 && res.code !== 201) {
      return Promise.reject(new Error(res.message || "请求失败"));
    }
    return res.data;
  },
  (error) => {
    let message = "网络错误，请稍后重试";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "未授权，请重新登录";
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = "请求错误，未找到该资源";
          break;
        case 500:
          message = "服务器错误";
          break;
        default:
          message = `连接错误${error.response.status}`;
      }
    }
    return Promise.reject(new Error(message));
  }
);

const http = {
  get: <T>(url: string) => {
    return axiosInstance.get<any, T>(url);
  },
  post: <T>(url: string, data?: any) => {
    return axiosInstance.post<any, T>(url, data);
  },
  put: <T>(url: string, data?: any) => {
    return axiosInstance.put<any, T>(url, data);
  },
  delete: <T>(url: string) => {
    return axiosInstance.delete<any, T>(url);
  },
};

export default http;
