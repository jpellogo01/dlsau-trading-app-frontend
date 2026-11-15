import { defineStore, acceptHMRUpdate } from "pinia";
import { computed, ref } from "vue";
import * as api from "@/api/notifications";
import type { AppNotification } from "@/types/notification";
import { useAuthStore } from "@/stores/auth";

/**
 * Facebook-style notifications (replies to your comments, comments on your items).
 * Live updates arrive over the chat WebSocket at /user/queue/notifications
 * (see stores/chat.ts), which calls receive().
 */
export const useNotificationStore = defineStore("notifications", () => {
  const items = ref<AppNotification[]>([]);
  const loaded = ref(false);
  /** The newest live notification, shown briefly as a toast. */
  const toast = ref<AppNotification | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  const unreadCount = computed(() => items.value.filter((n) => !n.isRead).length);

  function token() {
    return useAuthStore().token;
  }

  async function load() {
    const t = token();
    if (!t) return;
    items.value = await api.getNotifications(t);
    loaded.value = true;
  }

  function receive(n: AppNotification) {
    if (items.value.some((x) => x.id === n.id)) return;
    items.value = [n, ...items.value];
    toast.value = n;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.value = null), 5000);
  }

  async function markRead(n: AppNotification) {
    if (n.isRead) return;
    n.isRead = true; // optimistic
    const t = token();
    if (t) await api.markNotificationRead(n.id, t).catch(() => {});
  }

  async function markAllRead() {
    items.value.forEach((n) => (n.isRead = true));
    const t = token();
    if (t) await api.markAllNotificationsRead(t).catch(() => {});
  }

  function dismissToast() {
    toast.value = null;
  }

  function reset() {
    items.value = [];
    loaded.value = false;
    toast.value = null;
  }

  return {
    items,
    loaded,
    toast,
    unreadCount,
    load,
    receive,
    markRead,
    markAllRead,
    dismissToast,
    reset,
  };
});

/** Text like "maria replied to your comment" for a notification. */
export function describeNotification(n: AppNotification): string {
  return n.type === "COMMENT_REPLY"
    ? "replied to your comment"
    : `commented on your item${n.itemTitle ? ` "${n.itemTitle}"` : ""}`;
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot));
}
