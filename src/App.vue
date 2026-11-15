<script setup lang="ts">
import { watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";

const authStore = useAuthStore();
const chatStore = useChatStore();

// Keep the real-time chat connection in sync with login / logout.
watch(
  () => authStore.token,
  (token) => {
    if (token) chatStore.connect(token);
    else chatStore.disconnect();
  },
  { immediate: true },
);
</script>

<template>
  <router-view />
</template>

<style scoped></style>
