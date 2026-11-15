<template>
  <div
    class="h-screen flex flex-col bg-gradient-to-b from-[#f5f5f5] to-[#e2e8f0] font-sans"
  >
    <!-- Header -->
    <header
      class="bg-[#00733f]/95 backdrop-blur-md border-b border-white/20 flex-shrink-0"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3"
      >
        <button
          @click="router.push({ name: 'Marketplace' })"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white/50 border border-black/10 rounded-full text-[#333] font-semibold text-sm sm:text-base transition-all hover:bg-white hover:shadow-lg"
        >
          <ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5" />
          <span class="hidden sm:inline">Marketplace</span>
        </button>
        <div class="text-center flex-1 min-w-0">
          <p
            class="text-xs sm:text-sm font-bold text-[#ffd700] uppercase tracking-wider"
          >
            Trade Chats
          </p>
          <h1
            class="text-lg sm:text-2xl font-black bg-gradient-to-r from-white to-[#ffd700] bg-clip-text text-transparent truncate"
          >
            Messages
          </h1>
        </div>
        <NotificationBell />
        <span
          class="flex items-center gap-1.5 text-xs font-semibold text-white/80"
          :title="chat.connected ? 'Live' : 'Reconnecting…'"
        >
          <span
            class="w-2.5 h-2.5 rounded-full"
            :class="chat.connected ? 'bg-[#a7d49b]' : 'bg-orange-400 animate-pulse'"
          ></span>
          <span class="hidden sm:inline">{{
            chat.connected ? "Live" : "Reconnecting…"
          }}</span>
        </span>
      </div>
    </header>

    <!-- Body -->
    <main
      class="flex-1 min-h-0 w-full max-w-7xl mx-auto sm:px-6 lg:px-8 sm:py-6 flex"
    >
      <div
        class="flex-1 min-h-0 flex bg-white sm:rounded-3xl shadow-lg border border-slate-200 overflow-hidden"
      >
        <!-- Inbox -->
        <aside
          class="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 flex flex-col min-h-0"
          :class="activeId ? 'hidden md:flex' : 'flex'"
        >
          <div class="px-4 py-3 border-b border-slate-200">
            <p
              class="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Conversations
            </p>
          </div>
          <div v-if="loadingInbox" class="p-6 text-center text-slate-500">
            Loading…
          </div>
          <div
            v-else-if="chat.conversations.length === 0"
            class="p-8 text-center text-slate-500"
          >
            <MessageCircle class="w-12 h-12 text-[#a7d49b] mx-auto mb-3" />
            <p class="font-bold text-[#333] mb-1">No chats yet</p>
            <p class="text-sm">
              Tap "Message Owner" on a listing to start trading.
            </p>
          </div>
          <ul v-else class="flex-1 overflow-y-auto">
            <li v-for="c in chat.conversations" :key="c.id">
              <button
                @click="router.push({ name: 'Chats', params: { id: c.id } })"
                class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-100"
                :class="
                  c.id === activeId ? 'bg-[#00733f]/10' : 'hover:bg-slate-50'
                "
              >
                <div
                  class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center"
                >
                  <img
                    v-if="c.itemThumbnailUrl"
                    :src="c.itemThumbnailUrl"
                    :alt="c.itemTitle"
                    class="w-full h-full object-cover"
                  />
                  <Package v-else class="w-6 h-6 text-[#a7d49b]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <p class="font-black text-[#333] truncate">
                      {{ c.otherUsername }}
                    </p>
                    <span
                      class="text-[11px] text-slate-400 flex-shrink-0"
                      v-if="c.lastMessageAt"
                      >{{ formatShort(c.lastMessageAt) }}</span
                    >
                  </div>
                  <p class="text-xs font-semibold text-slate-500 truncate">
                    {{ c.itemTitle }}
                  </p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <p
                      class="text-sm truncate flex-1"
                      :class="
                        c.unreadCount
                          ? 'font-bold text-[#333]'
                          : 'text-slate-500'
                      "
                    >
                      {{ c.lastMessagePreview || "Say hi 👋" }}
                    </p>
                    <StatusPill :status="c.itemStatus" small />
                    <span
                      v-if="c.unreadCount"
                      class="min-w-5 h-5 px-1.5 rounded-full bg-[#ff8c42] text-white text-[11px] font-bold flex items-center justify-center"
                      >{{ c.unreadCount }}</span
                    >
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </aside>

        <!-- Thread -->
        <section
          class="flex-1 min-w-0 flex-col min-h-0"
          :class="activeId ? 'flex' : 'hidden md:flex'"
        >
          <div
            v-if="!active"
            class="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center"
          >
            <MessagesSquare class="w-16 h-16 text-[#a7d49b] mb-4" />
            <p class="font-bold text-[#333]">Select a conversation</p>
          </div>

          <template v-else>
            <!-- Thread header -->
            <div
              class="flex items-center gap-3 px-3 sm:px-5 py-3 border-b border-slate-200"
            >
              <button
                class="md:hidden p-1.5 rounded-full hover:bg-slate-100"
                @click="router.push({ name: 'Chats' })"
                aria-label="Back to conversations"
              >
                <ArrowLeft class="w-5 h-5" />
              </button>
              <div
                class="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="active.itemThumbnailUrl"
                  :src="active.itemThumbnailUrl"
                  :alt="active.itemTitle"
                  class="w-full h-full object-cover"
                />
                <Package v-else class="w-5 h-5 text-[#a7d49b]" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-black text-[#333] truncate">
                  {{ active.itemTitle }}
                </p>
                <p class="text-xs text-slate-500 truncate">
                  {{ active.isPoster ? "Trading with" : "Posted by" }}
                  <span class="font-bold">@{{ active.otherUsername }}</span>
                </p>
              </div>
              <StatusPill :status="active.itemStatus" />
            </div>

            <!-- Poster controls -->
            <div
              v-if="active.isPoster"
              class="px-3 sm:px-5 py-2.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2"
            >
              <p class="text-xs sm:text-sm text-slate-600 flex-1 min-w-40">
                <template v-if="active.itemStatus === 'AVAILABLE'"
                  >Agreed on a trade with
                  <b>@{{ active.otherUsername }}</b>?</template
                >
                <template v-else-if="tradedWithThisUser"
                  >You traded this item with
                  <b>@{{ active.otherUsername }}</b>.</template
                >
                <template v-else
                  >This item was traded with someone else.</template
                >
              </p>
              <button
                v-if="active.itemStatus === 'AVAILABLE'"
                :disabled="updatingStatus"
                @click="changeStatus('TRADED')"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00733f] to-[#a7d49b] text-white text-sm font-bold transition-all hover:shadow-lg disabled:opacity-60"
              >
                <Repeat class="w-4 h-4" />
                Mark as Traded
              </button>
              <button
                v-else
                :disabled="updatingStatus"
                @click="changeStatus('AVAILABLE')"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-600 text-sm font-bold transition-all hover:border-[#00733f] disabled:opacity-60"
              >
                <Undo2 class="w-4 h-4" />
                Mark as Available
              </button>
            </div>
            <div
              v-else-if="active.itemStatus === 'TRADED'"
              class="px-3 sm:px-5 py-2.5 border-b border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-600"
            >
              {{
                tradedWithMe
                  ? "🎉 The owner marked this item as traded with you."
                  : "This item has been traded."
              }}
            </div>

            <!-- Messages -->
            <div
              ref="scroller"
              class="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-2 bg-gradient-to-b from-white to-slate-50"
            >
              <div v-if="loadingThread" class="text-center text-slate-500 py-6">
                Loading messages…
              </div>
              <p
                v-else-if="messages.length === 0"
                class="text-center text-sm text-slate-400 py-6"
              >
                Start the conversation about "{{ active.itemTitle }}".
              </p>
              <template v-for="m in messages" :key="m.id">
                <div v-if="m.type === 'SYSTEM'" class="flex justify-center">
                  <span
                    class="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-center"
                    >{{ m.content }} · {{ formatTime(m.createdAt) }}</span
                  >
                </div>
                <div
                  v-else
                  class="flex"
                  :class="isMine(m) ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-[80%] sm:max-w-[65%] rounded-2xl shadow-sm"
                    :class="[
                      isMine(m)
                        ? 'bg-gradient-to-r from-[#00733f] to-[#2e9b5f] text-white rounded-br-md'
                        : 'bg-white border border-slate-200 text-[#333] rounded-bl-md',
                      m.imageUrl ? 'p-1.5' : 'px-4 py-2',
                    ]"
                  >
                    <button
                      v-if="m.imageUrl"
                      type="button"
                      class="block rounded-xl overflow-hidden"
                      @click="viewerUrl = m.imageUrl"
                      aria-label="View photo"
                    >
                      <img
                        :src="m.imageUrl"
                        alt="Photo"
                        loading="lazy"
                        class="max-h-72 w-auto max-w-full object-cover"
                        @load="scrollToBottom"
                      />
                    </button>
                    <p
                      v-if="m.content"
                      class="whitespace-pre-wrap break-words text-sm sm:text-base"
                      :class="m.imageUrl ? 'px-2.5 pt-1.5' : ''"
                    >
                      {{ m.content }}
                    </p>
                    <p
                      class="text-[10px] mt-0.5 text-right"
                      :class="[
                        isMine(m) ? 'text-white/70' : 'text-slate-400',
                        m.imageUrl ? 'px-2.5 pb-1' : '',
                      ]"
                    >
                      {{ formatTime(m.createdAt) }}
                    </p>
                  </div>
                </div>
              </template>
            </div>

            <!-- Selected photo preview -->
            <div
              v-if="pendingImage"
              class="flex items-center gap-3 px-3 sm:px-5 pt-3 border-t border-slate-200 bg-white"
            >
              <div class="relative">
                <img
                  :src="pendingPreview"
                  alt="Selected photo"
                  class="w-16 h-16 rounded-xl object-cover border border-slate-200"
                />
                <button
                  type="button"
                  @click="clearPendingImage"
                  class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shadow"
                  aria-label="Remove photo"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
              <p class="text-xs text-slate-500">
                1 photo · add a caption below (optional)
              </p>
            </div>

            <!-- Composer -->
            <form
              @submit.prevent="submit"
              class="flex items-end gap-2 px-3 sm:px-5 py-3 bg-white"
              :class="pendingImage ? '' : 'border-t border-slate-200'"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="onPickImage"
              />
              <button
                type="button"
                @click="fileInput?.click()"
                :disabled="photoLimitReached || sending"
                class="relative p-3 rounded-full border-2 border-slate-200 text-slate-500 transition-all hover:border-[#00733f] hover:text-[#00733f] disabled:opacity-40 disabled:cursor-not-allowed"
                :title="
                  photoLimitReached
                    ? `Photo limit reached (${active.imagesLimit} per conversation)`
                    : `Add photo (${active.imagesUsed}/${active.imagesLimit} used)`
                "
                aria-label="Add photo"
              >
                <ImagePlus class="w-5 h-5" />
                <span
                  class="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1 rounded-full"
                  :class="
                    photoLimitReached
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  "
                  >{{ active.imagesUsed }}/{{ active.imagesLimit }}</span
                >
              </button>
              <textarea
                v-model="draft"
                @keydown.enter.exact.prevent="submit"
                rows="1"
                maxlength="2000"
                :placeholder="pendingImage ? 'Add a caption…' : 'Write a message…'"
                aria-label="Message"
                class="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-[#00733f] focus:outline-none text-sm sm:text-base"
              ></textarea>
              <button
                type="submit"
                :disabled="(!draft.trim() && !pendingImage) || sending"
                class="p-3 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff8c42] text-[#333] transition-all hover:shadow-lg disabled:opacity-50"
                aria-label="Send"
              >
                <Send class="w-5 h-5" />
              </button>
            </form>
            <p v-if="error" class="px-5 pb-2 text-sm text-red-600">
              {{ error }}
            </p>
          </template>
        </section>
      </div>
    </main>

    <!-- Full-screen photo viewer -->
    <div
      v-if="viewerUrl"
      class="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4"
      @click="viewerUrl = null"
    >
      <button
        class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
        aria-label="Close photo"
      >
        <X class="w-6 h-6" />
      </button>
      <img
        :src="viewerUrl"
        alt="Photo"
        class="max-w-full max-h-full object-contain rounded-lg"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  MessageCircle,
  MessagesSquare,
  Package,
  Repeat,
  Send,
  Undo2,
  ImagePlus,
  X,
} from "lucide-vue-next";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import NotificationBell from "@/components/NotificationBell.vue";
import type { ChatMessage } from "@/types/chat";
import type { ItemStatus } from "@/types/item";

/** Small AVAILABLE / TRADED badge. */
const StatusPill = defineComponent({
  props: { status: { type: String, required: true }, small: Boolean },
  setup(props) {
    return () =>
      h(
        "span",
        {
          class: [
            "rounded-full font-bold uppercase tracking-wide flex-shrink-0",
            props.small ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2.5 py-1",
            props.status === "TRADED"
              ? "bg-slate-200 text-slate-600"
              : "bg-[#a7d49b]/40 text-[#00733f]",
          ],
        },
        props.status === "TRADED" ? "Traded" : "Available",
      );
  },
});

const route = useRoute();
const router = useRouter();
const chat = useChatStore();
const authStore = useAuthStore();

const draft = ref("");
const sending = ref(false);
const updatingStatus = ref(false);
const loadingInbox = ref(false);
const loadingThread = ref(false);
const error = ref("");
const scroller = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const pendingImage = ref<File | null>(null);
const pendingPreview = ref("");
const viewerUrl = ref<string | null>(null);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const photoLimitReached = computed(
  () =>
    !!active.value && active.value.imagesUsed >= active.value.imagesLimit,
);

function onPickImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0]; // only 1 photo per message
  input.value = ""; // allow picking the same file again later
  if (!file) return;
  error.value = "";
  if (!ALLOWED_TYPES.includes(file.type)) {
    error.value = "Photo must be JPEG, PNG or WebP.";
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    error.value = "Photo must be 5MB or smaller.";
    return;
  }
  if (photoLimitReached.value) {
    error.value = `Photo limit reached (${active.value?.imagesLimit} per conversation).`;
    return;
  }
  clearPendingImage();
  pendingImage.value = file;
  pendingPreview.value = URL.createObjectURL(file);
}

function clearPendingImage() {
  if (pendingPreview.value) URL.revokeObjectURL(pendingPreview.value);
  pendingImage.value = null;
  pendingPreview.value = "";
}

const activeId = computed(() => {
  const id = Number(route.params.id);
  return Number.isFinite(id) && id > 0 ? id : null;
});
const active = computed(() => chat.activeConversation);
const messages = computed<ChatMessage[]>(() =>
  activeId.value ? chat.messagesByConv[activeId.value] || [] : [],
);
const tradedWithThisUser = computed(
  () =>
    !!active.value &&
    active.value.itemStatus === "TRADED" &&
    active.value.tradedWithUserId === active.value.otherUserId,
);
const tradedWithMe = computed(
  () =>
    !!active.value &&
    !active.value.isPoster &&
    active.value.itemStatus === "TRADED" &&
    active.value.tradedWithUserId != null &&
    active.value.tradedWithUserId === authStore.user?.id,
);

function isMine(m: ChatMessage) {
  return !!active.value && m.senderId !== active.value.otherUserId;
}

onMounted(async () => {
  loadingInbox.value = true;
  try {
    await chat.loadInbox();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loadingInbox.value = false;
  }
});

watch(
  activeId,
  async (id) => {
    error.value = "";
    clearPendingImage(); // never carry a selected photo into another chat
    if (!id) {
      chat.closeConversation();
      return;
    }
    loadingThread.value = true;
    try {
      await chat.openConversation(id);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loadingThread.value = false;
      scrollToBottom();
    }
  },
  { immediate: true },
);

watch(() => messages.value.length, scrollToBottom);

function scrollToBottom() {
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
  });
}

async function submit() {
  const text = draft.value.trim();
  if ((!text && !pendingImage.value) || !activeId.value || sending.value)
    return;
  sending.value = true;
  error.value = "";
  try {
    if (pendingImage.value) {
      await chat.sendImage(activeId.value, pendingImage.value, text);
      clearPendingImage();
    } else {
      await chat.send(activeId.value, text);
    }
    draft.value = "";
  } catch (e: any) {
    error.value = e.message || "Failed to send";
  } finally {
    sending.value = false;
  }
}

async function changeStatus(status: ItemStatus) {
  if (!activeId.value) return;
  if (
    status === "TRADED" &&
    !confirm(`Mark "${active.value?.itemTitle}" as traded with @${active.value?.otherUsername}?`)
  )
    return;
  updatingStatus.value = true;
  error.value = "";
  try {
    await chat.setItemStatus(activeId.value, status);
  } catch (e: any) {
    error.value = e.message || "Failed to update status";
  } finally {
    updatingStatus.value = false;
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShort(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? formatTime(iso)
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
</script>
