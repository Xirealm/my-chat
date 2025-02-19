<script setup lang="ts">
import SearchInput from "@/components/common/SearchInput.vue";
import UserAvatar from "@/components/UserAvatar.vue";

// 模拟聊天列表数据
const chatList = [
  {
    id: 1,
    username: "张三",
    avatar: "",
    lastMessage: "好的，明天见！",
    timestamp: "12:30",
  },
  {
    id: 2,
    username: "李四",
    avatar: "",
    lastMessage: "收到了，谢谢！",
    timestamp: "11:45",
  },
  {
    id: 3,
    username: "王五",
    avatar: "",
    lastMessage: "项目进展如何？",
    timestamp: "09:20",
  },
];

// 处理搜索
const handleSearch = (searchText: string) => {
  console.log("搜索聊天内容:", searchText);
  // 这里实现搜索逻辑
};
</script>

<template>
  <div class="w-[240px] h-full bg-white border-r border-gray-100">
    <SearchInput placeholder="搜索聊天" @search="handleSearch" />
    <div class="border-b border-gray-100">
      <div class="px-4">
        <h3 class="text-sm font-medium text-gray-500 mb-2">最近会话</h3>
        <div class="space-y-1">
          <div
            v-for="chat in chatList"
            :key="chat.id"
            class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
          >
            <UserAvatar
              :username="chat.username"
              :avatar="chat.avatar"
              size="md"
            />
            <div class="ml-3 flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900 truncate">{{
                  chat.username
                }}</span>
                <span class="text-xs text-gray-400 group-hover:text-gray-500">
                  {{ chat.timestamp }}
                </span>
              </div>
              <p class="text-sm text-gray-500 truncate">
                {{ chat.lastMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
