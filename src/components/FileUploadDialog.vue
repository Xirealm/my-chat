<script setup lang="ts">
import { computed } from "vue";

interface Props {
  file: File | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const visible = defineModel<boolean>("visible");
const emit = defineEmits<Emits>();

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const fileType = computed(() => {
  if (!props.file) return "";
  const ext = props.file.name.split(".").pop()?.toLowerCase() || "";
  return ext;
});

const handleClose = () => {
  emit("cancel");
  visible.value = false;
};

const handleConfirm = () => {
  emit("confirm");
  visible.value = false;
};
</script>

<template>
  <el-dialog
    v-model="visible"
    title="发送文件"
    width="400px"
    top="30vh"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div v-if="file" class="space-y-4">
      <div class="flex items-center space-x-4">
        <div
          class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <span class="text-lg font-medium text-gray-500 uppercase">{{
            fileType
          }}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">发送</el-button>
      </div>
    </template>
  </el-dialog>
</template>
