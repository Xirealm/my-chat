<script setup lang="ts">
import ContactList from "./components/ContactList.vue";
</script>

<template>
  <div class="flex h-full">
    <!-- 左侧联系人列表 -->
    <ContactList />

    <!-- 右侧联系人详情 -->
    <div class="flex-1 h-full bg-white overflow-hidden">
      <div class="h-full flex flex-col">
        <!-- 顶部信息栏 -->
        <div
          class="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0"
        >
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 rounded-full bg-blue-100"></div>
            <div>
              <h2 class="text-base font-medium text-gray-900">用户名称</h2>
              <p class="text-xs text-gray-500">[在线]</p>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="flex-1">
          <div class="p-6 space-y-6">
            <!-- 基本信息卡片 -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-4">基本信息</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <span class="w-20 text-sm text-gray-500">昵称</span>
                  <span class="text-sm text-gray-900">用户昵称</span>
                </div>
                <div class="flex items-center">
                  <span class="w-20 text-sm text-gray-500">性别</span>
                  <span class="text-sm text-gray-900">保密</span>
                </div>
                <div class="flex items-center">
                  <span class="w-20 text-sm text-gray-500">地区</span>
                  <span class="text-sm text-gray-900">未设置</span>
                </div>
              </div>
            </div>

            <!-- 社交信息卡片 -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-4">社交信息</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <span class="w-20 text-sm text-gray-500">个性签名</span>
                  <span class="text-sm text-gray-900">这是一条示例签名</span>
                </div>
                <div class="flex items-center">
                  <span class="w-20 text-sm text-gray-500">添加时间</span>
                  <span class="text-sm text-gray-900">2024-01-01</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div
          class="h-16 px-6 border-t border-gray-100 flex items-center justify-end space-x-4 shrink-0"
        >
          <button
            class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            删除好友
          </button>
          <button
            class="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
          >
            发送消息
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
