<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  placeholder?: string;
}>();

const emit = defineEmits<{
  search: [searchText: string];
  "update:modelValue": [value: string];
}>();

const searchText = ref("");
const isFocused = ref(false);

// 监听输入变化
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  searchText.value = value;
  emit("update:modelValue", value);
  emit("search", value);
};

// 按回车触发搜索
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    emit("search", searchText.value);
  }
};
</script>

<template>
  <div class="px-4 py-3">
    <div
      class="relative transition-all duration-300"
      :class="{ 'ring-2 ring-blue-100 ring-opacity-60': isFocused }"
    >
      <input
        v-model="searchText"
        type="text"
        :placeholder="placeholder ?? '搜索'"
        class="w-full h-8 pl-8 pr-3 text-sm bg-gray-50 rounded-md border-0 outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-gray-100"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <div
        class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200"
        :class="{ 'scale-90': isFocused || searchText }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-colors duration-200"
          :class="{ 'text-blue-500': isFocused }"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  transition: color 0.2s ease;
}

input:focus::placeholder {
  color: #94a3b8; /* text-slate-400 */
}
</style>
