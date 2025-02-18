<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="h-full w-full flex">
    <Sidebar />
    <div class="flex-1 h-full bg-gray-200">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped></style>
