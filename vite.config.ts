import { fileURLToPath, URL } from 'node:url'
import path from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from "@tailwindcss/vite";
import vueDevTools from 'vite-plugin-vue-devtools'
import electron from "vite-plugin-electron";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    electron({
      // 主进程入口文件
      entry: "./electron/main.js",
    }),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
          // directives: true,
          // version: "2.1.5",
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  server: {
    allowedHosts: ["f68a-39-144-95-127.ngrok-free.app"], // 添加你的 ngrok 域名
    proxy: {
      "/api": {
        target: "https://ae49-39-144-95-127.ngrok-free.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/assets/element.scss" as *;`,
      },
    },
  },
});
