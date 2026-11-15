<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { getItems } from "@/api/items";
import Login from "./Login.vue";
import Register from "./Register.vue";
import HeroSection from "./HeroSection.vue";
import StatsSection from "./StatsSection.vue";
import CategoriesSection from "./CategoriesSection.vue";
import type { Item } from "@/types/item";
import LiveListings from "./LiveListings.vue";
import TheFooter from "@/components/TheFooter.vue";
import {
  ShoppingBag,
  User,
  Flame,
  Package,
  Plus,
  Heart,
  BookOpen,
  Shirt,
  Smartphone,
  Heart as HeartIcon,
  Package as PackageIcon,
  LogIn,
  MessagesSquare,
} from "lucide-vue-next";
import NotificationBell from "@/components/NotificationBell.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();

const isLoginModalOpen = ref(false);
const isRegisterModalOpen = ref(false);
const items = ref<Item[]>([]);
const loadingItems = ref(false);
const searchQuery = ref("");

const displayName = computed(() => {
  if (authStore.user?.firstName || authStore.user?.lastName) {
    return `${authStore.user?.firstName || ""} ${authStore.user?.lastName || ""}`.trim();
  }
  return authStore.user?.username || "";
});

function openLoginModal() {
  isLoginModalOpen.value = true;
  isRegisterModalOpen.value = false;
}

function openRegisterModal() {
  isRegisterModalOpen.value = true;
  isLoginModalOpen.value = false;
}

function closeModals() {
  isLoginModalOpen.value = false;
  isRegisterModalOpen.value = false;
}

async function fetchItems() {
  loadingItems.value = true;
  try {
    items.value = await getItems(authStore.token || undefined);
  } catch (error) {
    // No console.error
  } finally {
    loadingItems.value = false;
  }
}

watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      closeModals();
      fetchItems();
    }
  },
);

onMounted(() => {
  const modal = route.query.modal as string;
  if (modal === "login") openLoginModal();
  else if (modal === "register") openRegisterModal();
  fetchItems();
});

const categories = [
  {
    icon: BookOpen,
    name: "Books",
    color: "#00733F",
  },
  {
    icon: Shirt,
    name: "Uniforms",
    color: "#FFD700",
  },
  {
    icon: Smartphone,
    name: "Electronics",
    color: "#FF8C42",
  },
  {
    icon: HeartIcon,
    name: "Pet Supplies",
    color: "#FF8C42",
  },
  {
    icon: Shirt,
    name: "Fashion",
    color: "#A7D49B",
  },
  {
    icon: PackageIcon,
    name: "Others",
    color: "#FF8C42",
  },
];

function navigateToProfile() {
  if (authStore.isAuthenticated) {
    router.push("/profile");
  } else {
    openLoginModal();
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function handleQuickAction(item: Item, action: string) {
  if (!authStore.isAuthenticated) {
    openLoginModal();
    return;
  }

  if (action === "contact") {
    if (item.user?.id === authStore.user?.id) {
      router.push({ name: "Chats" });
      return;
    }
    try {
      const conversation = await chatStore.startWithItem(item.id);
      router.push({ name: "Chats", params: { id: conversation.id } });
    } catch (e: any) {
      alert(e?.message || "Could not open chat.");
    }
  } else if (action === "like") {
    alert("Liked & Saved! (Syncing...)");
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#F5F5F5]/70 via-[#E2E8F0]/50 to-[#F5F5F5] text-[#333333]"
  >
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 w-full transition-all duration-300">
      <div
        class="h-1 w-full bg-gradient-to-r from-[#00733F] via-[#FFD700] to-[#00733F]"
      ></div>

      <div class="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20 lg:h-24">
            <div class="flex items-center gap-3 group cursor-pointer">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-[#00733F] blur-lg opacity-20 group-hover:opacity-40 transition-opacity"
                ></div>
                <ShoppingBag class="relative w-10 h-10 text-[#00733F]" />
              </div>
              <div class="flex flex-col">
                <span
                  class="text-2xl font-black tracking-tighter leading-none text-[#00733F]"
                >
                  GAWT
                </span>
                <span
                  class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mt-1"
                >
                  Campus Trading
                </span>
              </div>
            </div>

            <div class="hidden md:flex items-center gap-6">
              <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
                <NotificationBell />
                <button
                  @click="router.push({ name: 'Chats' })"
                  class="relative flex items-center gap-2 px-4 py-3 bg-white/50 border border-black/10 rounded-full text-[#333] font-semibold transition-all hover:bg-white hover:shadow-lg"
                  aria-label="Open chats"
                >
                  <MessagesSquare class="w-5 h-5" />
                  <span>Chats</span>
                  <span
                    v-if="chatStore.unreadTotal"
                    class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#ff8c42] text-white text-[11px] font-bold flex items-center justify-center shadow"
                    >{{ chatStore.unreadTotal }}</span
                  >
                </button>
              </div>
              <button
                v-if="authStore.isAuthenticated"
                @click="navigateToProfile"
                class="group relative flex items-center gap-3 pl-1.5 pr-5 py-1.5 bg-white border border-slate-200 rounded-full hover:border-[#00733F] hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                <div
                  class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00733F] to-[#A7D49B] flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-500 shadow-inner"
                >
                  <User
                    class="w-5 h-5 group-hover:scale-110 transition-transform"
                  />
                </div>

                <div class="flex flex-col items-start">
                  <span
                    class="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none mb-0.5"
                    >Account</span
                  >
                  <span
                    class="font-black text-sm text-slate-700 group-hover:text-[#00733F] transition-colors leading-none"
                  >
                    {{ displayName }}
                  </span>
                </div>
              </button>

              <button
                v-else
                @click="openLoginModal"
                class="relative group flex items-center gap-2 px-10 py-3.5 bg-[#00733F] text-white rounded-2xl font-bold text-sm overflow-hidden transition-all hover:shadow-[0_10px_20px_-5px_rgba(0,115,63,0.4)] active:scale-95 shadow-lg"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"
                ></div>

                <div class="relative flex items-center gap-2">
                  <div class="overflow-hidden w-4 h-4 relative">
                    <LogIn
                      class="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  <span class="tracking-wide">Sign In to Campus</span>
                </div>

                <div
                  class="absolute bottom-0 left-0 h-1 w-0 bg-[#FFD700] transition-all duration-500 group-hover:w-full"
                ></div>
              </button>
            </div>

            <!-- Mobile: bell, chats and account (the old menu button did nothing) -->
            <div class="md:hidden flex items-center gap-2">
              <template v-if="authStore.isAuthenticated">
                <NotificationBell />
                <button
                  @click="router.push({ name: 'Chats' })"
                  class="relative p-2.5 bg-white/50 border border-black/10 rounded-full text-[#333]"
                  aria-label="Open chats"
                >
                  <MessagesSquare class="w-5 h-5" />
                  <span
                    v-if="chatStore.unreadTotal"
                    class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#ff8c42] text-white text-[11px] font-bold flex items-center justify-center shadow"
                    >{{ chatStore.unreadTotal }}</span
                  >
                </button>
                <button
                  @click="navigateToProfile"
                  class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00733F] to-[#A7D49B] flex items-center justify-center text-white shadow"
                  aria-label="My account"
                >
                  <User class="w-5 h-5" />
                </button>
              </template>
              <button
                v-else
                @click="openLoginModal"
                class="flex items-center gap-1.5 px-4 py-2.5 bg-[#00733F] text-white rounded-xl font-bold text-sm shadow"
              >
                <LogIn class="w-4 h-4" /> Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <HeroSection />

    <StatsSection />

    <CategoriesSection :categories="categories" />

    <!-- Featured Items -->
    <LiveListings
      :items="items.slice(0, 9)"
      :loading="loadingItems"
      @action="handleQuickAction"
    />

    <TheFooter />

    <!-- Login Modal -->
    <Login
      :is-open="isLoginModalOpen"
      @close="closeModals"
      @switch-to-register="openRegisterModal"
    />

    <!-- Register Modal -->
    <Register
      :is-open="isRegisterModalOpen"
      @close="closeModals"
      @switch-to-login="openLoginModal"
    />
  </div>
</template>
