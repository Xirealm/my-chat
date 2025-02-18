<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const isLogin = ref(true);
const loginForm = ref({
  username: "",
  password: "",
});

const registerForm = ref({
  password: "",
  confirmPassword: "",
  nickname: "",
});

// 处理登录
const handleLogin = () => {
  console.log("登录信息:", loginForm.value);
  // TODO: 实际登录逻辑
  userStore.setUserInfo({
    id: "1",
    username: loginForm.value.username,
    avatar:"https://xirealm.oss-cn-beijing.aliyuncs.com/xi/v2-4512c514732c060dd6b4f4269de50d01_r.jpg",
    status: "online",
  });
  router.push("/main/chat");
};

// 处理注册
const handleRegister = () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    // TODO: 显示错误提示
    console.error("两次密码不一致");
    return;
  }
  console.log("注册信息:", registerForm.value);
  // TODO: 实际注册逻辑
};

// 切换登录/注册面板
const togglePanel = () => {
  isLogin.value = !isLogin.value;
};
</script>

<template>
  <div class="bg-[#e9eaef] h-full w-full flex justify-center items-center">
    <div class="h-full w-[450px] relative">
      <img
        src="@/assets/images/bg_login.png"
        alt=""
        class="h-[550px] fixed top-1/2 -translate-y-1/2"
      />
      <div class="absolute left-1/2 -translate-x-1/2 bottom-[70px]">
        <img src="@/assets/images/des_login.png" alt="" class="w-[600px]" />
      </div>
    </div>

    <!-- 登录/注册面板 -->
    <div
      class="bg-white rounded-[15px] h-[450px] w-[300px] p-6 -translate-x-[10px] flex flex-col overflow-hidden"
    >
      <h2 class="text-lg font-bold mb-4">
        {{ isLogin ? "欢迎使用MyChat" : "欢迎注册MyChat" }}
      </h2>

      <!-- 登录表单 -->
      <div v-if="isLogin" class="space-y-4">
        <div>
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              用户名
            </label>
          </div>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
          />
        </div>

        <div>
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              密码
            </label>
          </div>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
          />
        </div>

        <el-button
          type="primary"
          class="w-full mt-4"
          size="large"
          @click="handleLogin"
        >
          登录
        </el-button>

        <div class="flex justify-center mt-4">
          <el-button link type="primary" @click="togglePanel">
            创建新账号
          </el-button>
        </div>
      </div>

      <!-- 注册表单 -->
      <div v-else class="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              昵称
            </label>
          </div>
          <el-input
            v-model="registerForm.nickname"
            placeholder="请输入昵称"
            size="large"
          />
        </div>

        <div>
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              密码
            </label>
          </div>
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
          />
        </div>

        <div>
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              确认密码
            </label>
          </div>
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
          />
        </div>

        <div class="pt-2">
          <el-button
            type="primary"
            class="w-full"
            size="large"
            @click="handleRegister"
          >
            注册
          </el-button>

          <div class="flex justify-center mt-3">
            <el-button link type="primary" @click="togglePanel">
              返回登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-input {
  --el-input-hover-border-color: #3b82f6;
  --el-input-focus-border-color: #3b82f6;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>
