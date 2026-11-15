<template>
  <div ref="root" class="relative">
    <!-- Bell button -->
    <button
      type="button"
      @click="toggle"
      class="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-3 bg-white/50 border border-black/10 rounded-full text-[#333] font-semibold text-sm sm:text-base transition-all hover:bg-white hover:shadow-lg"
      :aria-label="`Notifications${store.unreadCount ? `, ${store.unreadCount} unread` : ''}`"
      :aria-expanded="open"
    >
      <Bell class="w-4 h-4 sm:w-5 sm:h-5" />
      <span
        v-if="store.unreadCount"
        class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow"
        >{{ store.unreadCount > 99 ? "99+" : store.unreadCount }}</span
      >
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[900] overflow-hidden text-left"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-slate-100"
      >
        <p class="font-black text-[#333] text-lg">Notifications</p>
        <button
          v-if="store.unreadCount"
          @click="store.markAllRead()"
          class="text-xs font-bold text-[#00733f] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div class="max-h-[60vh] overflow-y-auto">
        <p
          v-if="store.items.length === 0"
          class="px-4 py-10 text-center text-sm text-slate-500"
        >
          <BellOff class="w-8 h-8 mx-auto mb-2 text-slate-300" />
          No notifications yet
        </p>
        <button
          v-for="n in store.items"
          :key="n.id"
          type="button"
          @click="openNotification(n)"
          class="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
          :class="n.isRead ? '' : 'bg-[#00733f]/5'"
        >
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00733f] to-[#a7d49b] text-white font-black flex items-center justify-center flex-shrink-0 relative"
          >
            {{ n.actorUsername.charAt(0).toUpperCase() }}
            <span
              class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white"
              :class="n.type === 'COMMENT_REPLY' ? 'bg-blue-500' : 'bg-[#ff8c42]'"
            >
              <Reply v-if="n.type === 'COMMENT_REPLY'" class="w-3 h-3 text-white" />
              <MessageCircle v-else class="w-3 h-3 text-white" />
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-[#333] leading-snug">
              <b>{{ n.actorUsername }}</b> {{ describeNotification(n) }}
              <span v-if="n.preview" class="text-slate-500"
                >: "{{ n.preview }}"</span
              >
            </p>
            <p
              class="text-xs mt-0.5"
              :class="n.isRead ? 'text-slate-400' : 'text-[#00733f] font-bold'"
            >
              {{ timeAgo(n.createdAt) }}
            </p>
          </div>
          <span
            v-if="!n.isRead"
            class="w-2.5 h-2.5 rounded-full bg-[#00733f] mt-2 flex-shrink-0"
            aria-label="Unread"
          ></span>
        </button>
      </div>
    </div>

    <!-- Live toast for a new notification -->
    <Transition name="notif-toast">
      <button
        v-if="store.toast && !open"
        type="button"
        @click="openNotification(store.toast)"
        class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[1000] flex items-start gap-3 p-4 bg-white rounded-2xl shadow-2xl border border-slate-200 text-left"
      >
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00733f] to-[#a7d49b] text-white font-black flex items-center justify-center flex-shrink-0"
        >
          {{ store.toast.actorUsername.charAt(0).toUpperCase() }}
        </div>
        <p class="flex-1 text-sm text-[#333] leading-snug">
          <b>{{ store.toast.actorUsername }}</b>
          {{ describeNotification(store.toast) }}
          <span v-if="store.toast.preview" class="text-slate-500"
            >: "{{ store.toast.preview }}"</span
          >
        </p>
        <span
          role="button"
          tabindex="0"
          @click.stop="store.dismissToast()"
          @keydown.enter.stop="store.dismissToast()"
          class="text-slate-400 hover:text-slate-600"
          aria-label="Dismiss"
        >
          <X class="w-4 h-4" />
        </span>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Bell, BellOff, MessageCircle, Reply, X } from "lucide-vue-next";
import {
  describeNotification,
  useNotificationStore,
} from "@/stores/notifications";
import type { AppNotification } from "@/types/notification";

const store = useNotificationStore();
const router = useRouter();
const open = ref(false);
const root = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
  if (open.value && !store.loaded) store.load().catch(() => {});
}

/** Go to the item, open its comments and highlight the comment. */
function openNotification(n: AppNotification) {
  store.markRead(n);
  store.dismissToast();
  open.value = false;
  if (n.itemId) {
    router.push({
      name: "Marketplace",
      query: {
        item: String(n.itemId),
        ...(n.commentId ? { comment: String(n.commentId) } : {}),
      },
    });
  }
}

function onDocumentClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));

function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
.notif-toast-enter-active,
.notif-toast-leave-active {
  transition: all 0.25s ease;
}
.notif-toast-enter-from,
.notif-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
