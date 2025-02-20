// 用户信息接口
export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  status: string;
}

// 登录请求参数
export interface LoginParams {
  phone: string;
  password: string;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  phone: string;
  password: string;
}

// 登录响应
export interface LoginResult {
  token: string;
  user: UserInfo;
}

// 表单数据类型(包含确认密码)
export interface RegisterForm {
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginForm {
  phone: string;
  password: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
