<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElNotification } from "element-plus";
import { postLoginAPI, postRegisterAPI } from "@/api/auth";
import type { LoginForm, RegisterForm } from "@/types/auth";
import type { FormInstance } from "element-plus";

const router = useRouter();
const userStore = useUserStore();

const isLogin = ref(true);
const loginForm = ref<LoginForm>({
  phone: "",
  password: "",
});

const registerForm = ref<RegisterForm>({
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);

const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();

const loginShake = ref(false);
const registerShake = ref(false);

// 表单校验规则
const loginRules = {
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const registerRules = {
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== registerForm.value.password) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  try {
    await loginFormRef.value.validate();
    loading.value = true;
    const result = await postLoginAPI({
      phone: loginForm.value.phone,
      password: loginForm.value.password,
    });
    userStore.setUserInfo(result.user, result.token);
    router.push("/main/chat");
  } catch (error: any) {
    if (error.message) {
      loginShake.value = true;
      ElNotification({
        title: "登录失败",
        message: error.message || "账号或密码错误",
        type: "error",
        duration: 3000,
        position: "top-left",
      });
      setTimeout(() => {
        loginShake.value = false;
      }, 500);
    }
  } finally {
    loading.value = false;
  }
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;
  try {
    await registerFormRef.value.validate();
    loading.value = true;
    await postRegisterAPI({
      phone: registerForm.value.phone,
      username: registerForm.value.username,
      password: registerForm.value.password,
    });
    ElNotification({
      title: "注册成功",
      message: "请使用新账号登录",
      type: "success",
      duration: 3000,
      position: "top-left",
    });
    isLogin.value = true;
    loginForm.value.phone = registerForm.value.phone;
  } catch (error: any) {
    if (error.message) {
      registerShake.value = true;
      ElNotification({
        title: "注册失败",
        message: error.message || "注册失败，请稍后重试",
        type: "error",
        duration: 3000,
        position: "top-left",
      });
      setTimeout(() => {
        registerShake.value = false;
      }, 500);
    }
  } finally {
    loading.value = false;
  }
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
      class="bg-white rounded-[15px] h-[450px] w-[300px] p-8 -translate-x-[10px] flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      :class="{ 'shake-animation': loginShake || registerShake }"
    >
      <h2 class="text-xl font-bold mb-6 text-gray-800">
        {{ isLogin ? "欢迎使用MyChat" : "欢迎注册MyChat" }}
      </h2>

      <!-- 登录表单 -->
      <el-form
        v-if="isLogin"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="space-y-5"
      >
        <el-form-item prop="phone">
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              手机号
            </label>
          </div>
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
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
        </el-form-item>

        <el-button
          type="primary"
          class="w-full mt-6 hover:opacity-90 transition-opacity"
          size="large"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>

        <div class="flex justify-center mt-4">
          <el-button
            link
            type="primary"
            class="hover:scale-105 transition-transform"
            @click="togglePanel"
          >
            创建新账号
          </el-button>
        </div>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="space-y-4 flex-1 overflow-y-auto pr-2 login-scrollbar"
      >
        <el-form-item prop="phone">
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              手机号
            </label>
          </div>
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="username">
          <div class="mb-2">
            <label
              class="text-sm border-b-2 pb-1 border-blue-500 text-blue-500"
            >
              用户名
            </label>
          </div>
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
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
        </el-form-item>

        <el-form-item prop="confirmPassword">
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
        </el-form-item>

        <div class="pt-4">
          <el-button
            type="primary"
            class="w-full hover:opacity-90 transition-opacity"
            size="large"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>

          <div class="flex justify-center mt-4">
            <el-button
              link
              type="primary"
              class="hover:scale-105 transition-transform"
              @click="togglePanel"
            >
              返回登录
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.el-input {
  --el-input-hover-border-color: #3b82f6;
  --el-input-focus-border-color: #3b82f6;
}

.login-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(203, 213, 225, 0.4) transparent;
}

.login-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.login-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.login-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(178, 178, 178, 0.252);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.login-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.6);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

.shake-animation {
  animation: shake 0.5s ease-in-out;
}
</style>
