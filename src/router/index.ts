import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/login/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/main",
      component: () => import("../views/main/MainView.vue"),
      children: [
        {
          path: "chat/:chatId?",
          name: "chat",
          component: () => import("@/views/main/ChatView.vue"),
        },
        {
          path: "contacts",
          component: () => import("@/views/main/ContactView.vue"),
          children: [
            {
              path: "",
              component: () => import("@/views/main/ContactView.vue"),
            },
            {
              path: ":id",
              component: () => import("@/views/main/ContactView.vue"),
            },
          ],
        },
        {
          path: "",
          redirect: "/main/chat",
        },
      ],
    },
  ],
});

export default router;
