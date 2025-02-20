import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/types/user";

export const useUserStore = defineStore(
  "user",
  () => {
    const users = ref<User[]>([]);
    
    const setUsers = (data: User[]) => {
        users.value = data;
    }
    
    return {
      users,
      setUsers
    };
  },
  {
    persist: true,
  }
);
