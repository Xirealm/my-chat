<script setup lang="ts">
import SearchInput from "@/components/common/SearchInput.vue";
import UserAvatar from "@/components/UserAvatar.vue";

// 处理搜索
const handleSearch = (searchText: string) => {
  console.log("搜索联系人:", searchText);
  // 这里实现搜索逻辑
};

// 模拟联系人数据
const contacts = [
  { id: 1, username: "张三", avatar: "", online: true },
  { id: 2, username: "李四", avatar: "", online: false },
  { id: 3, username: "王五", avatar: "", online: true },
];
</script>

<template>
  <div class="w-[240px] h-full bg-white border-r border-gray-100">
    <SearchInput placeholder="搜索联系人" @search="handleSearch" />
    <div class="border-b border-gray-100">
      <div class="px-4">
        <h3 class="text-sm font-medium text-gray-500 mb-2">联系人</h3>
        <!-- 联系人列表内容 -->
        <div class="space-y-1">
          <!-- 这里放联系人列表项 -->
          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <UserAvatar
              :username="contact.username"
              :avatar="contact.avatar"
              size="md"
            />
            <div class="ml-3 flex-1 min-w-0">
              <div class="font-medium text-gray-900">
                {{ contact.username }}
              </div>
              <p class="text-sm text-gray-500 truncate">
                [{{ contact.online ? "在线" : "离线" }}]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
