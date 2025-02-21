import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface UserInfo {
  id: number;
  username: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
  region?: string;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    const userInfo = ref<UserInfo | null>(null);
    const token = ref<string | null>(null);
    const isLoggedIn = ref(false);

    // 设置用户信息和token
    const setUserInfo = (info: UserInfo, accessToken: string) => {
      userInfo.value = info;
      token.value = accessToken;
      isLoggedIn.value = true;
    };

    // 更新用户信息
    const updateUserInfo = (info: Partial<UserInfo>) => {
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...info };
      }
    };

    // 清除用户信息
    const clearUserInfo = () => {
      userInfo.value = null;
      token.value = null;
      isLoggedIn.value = false;
      localStorage.removeItem("token");
    };

    // 检查登录状态
    const checkLoginStatus = async () => {
      try {
        // TODO: 调用后端 API 检查登录状态
        // const response = await api.checkLoginStatus();
        // setUserInfo(response.data);
        return true;
      } catch (error) {
        clearUserInfo();
        return false;
      }
    };

    // 获取用户状态显示文本
    const getUserStatusText = computed(() => {
      if (!userInfo.value) return "";

      switch (userInfo.value.status) {
        case "online":
          return "在线";
        case "offline":
          return "离线";
        case "away":
          return "离开";
        default:
          return "";
      }
    });

    return {
      userInfo,
      token,
      isLoggedIn,
      setUserInfo,
      updateUserInfo,
      clearUserInfo,
      checkLoginStatus,
      getUserStatusText,
    };
  },
  {
    persist: true,
  }
);
