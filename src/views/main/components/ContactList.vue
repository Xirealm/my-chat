<script setup lang="ts">
import SearchInput from "@/components/common/SearchInput.vue";

// 处理搜索
const handleSearch = (searchText: string) => {
  console.log("搜索联系人:", searchText);
  // 这里实现搜索逻辑
};
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
            v-for="i in 3"
            :key="i"
            class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div class="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0"></div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="font-medium text-gray-900">用户名称</div>
              <p class="text-sm text-gray-500 truncate">[在线]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
