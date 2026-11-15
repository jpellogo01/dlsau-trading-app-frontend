<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e2e8f0] font-sans"
  >
    <!-- Header -->
    <header
      class="bg-[#00733f]/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
    >
      <div
        class="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2"
      >
        <button
          @click="router.push('/')"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-3 bg-white/50 border border-black/10 rounded-full text-[#333] font-semibold text-sm sm:text-base transition-all hover:bg-white hover:shadow-lg"
        >
          <ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5" />
          <span class="hidden sm:inline">Home</span>
        </button>
        <div class="text-center flex-1 min-w-0">
          <p
            class="text-xs sm:text-sm font-bold text-[#ffd700] uppercase tracking-wider"
          >
            GAWT
          </p>
          <h1
            class="text-lg sm:text-2xl font-black bg-gradient-to-r from-white to-[#ffd700] bg-clip-text text-transparent truncate"
          >
            My Account
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <NotificationBell />
          <button
            @click="handleLogout"
            class="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-3 rounded-full bg-gradient-to-r from-[#ff4444] to-[#cc3333] text-white font-bold text-sm transition-all hover:shadow-lg"
          >
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
      <!-- Identity card -->
      <section
        class="bg-white rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-7 flex items-center gap-4 sm:gap-6"
      >
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00733f] to-[#a7d49b] text-white text-2xl sm:text-3xl font-black flex items-center justify-center shadow-md flex-shrink-0"
        >
          {{ displayName.charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <h2 class="text-xl sm:text-3xl font-black text-[#333] truncate">
            {{ displayName }}
          </h2>
          <p class="text-sm text-slate-500 truncate">
            @{{ authStore.user?.username }}
            <span v-if="authStore.user?.program"
              >· {{ authStore.user.program }}</span
            >
          </p>
          <span
            class="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-bold"
            :class="
              authStore.isVerified
                ? 'bg-[#a7d49b]/40 text-[#00733f]'
                : 'bg-amber-100 text-amber-700'
            "
          >
            <BadgeCheck v-if="authStore.isVerified" class="w-3.5 h-3.5" />
            <Clock v-else class="w-3.5 h-3.5" />
            {{ authStore.isVerified ? "Verified account" : "Not verified yet" }}
          </span>
        </div>
      </section>

      <!-- Tabs -->
      <nav
        class="mt-5 flex gap-1 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm w-full sm:w-fit"
        role="tablist"
      >
        <button
          v-for="t in tabs"
          :key="t.id"
          role="tab"
          :aria-selected="tab === t.id"
          @click="setTab(t.id)"
          class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          :class="
            tab === t.id
              ? 'bg-gradient-to-r from-[#00733f] to-[#2e9b5f] text-white shadow'
              : 'text-slate-500 hover:text-[#00733f] hover:bg-slate-50'
          "
        >
          <component :is="t.icon" class="w-4 h-4" />
          {{ t.label }}
          <span
            v-if="t.id === 'posts' && postsLoaded"
            class="px-1.5 py-0.5 rounded-full text-[11px]"
            :class="tab === t.id ? 'bg-white/25' : 'bg-slate-100'"
            >{{ posts.length }}</span
          >
        </button>
      </nav>

      <!-- Toast -->
      <Transition name="fade">
        <div
          v-if="toast.text"
          class="mt-4 px-4 py-3 rounded-2xl text-sm font-semibold border"
          :class="
            toast.kind === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-[#a7d49b]/30 border-[#a7d49b] text-[#00733f]'
          "
        >
          {{ toast.text }}
        </div>
      </Transition>

      <!-- ===================== PROFILE TAB ===================== -->
      <section
        v-if="tab === 'profile'"
        class="mt-5 bg-white rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-7"
      >
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-black text-[#333]">Profile details</h3>
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ff8c42] text-[#333] text-sm font-bold transition-all hover:shadow-lg"
          >
            <Pencil class="w-4 h-4" /> Edit Profile
          </button>
        </div>

        <!-- View mode -->
        <dl v-if="!isEditing" class="grid sm:grid-cols-2 gap-3">
          <div
            v-for="row in detailRows"
            :key="row.label"
            class="p-4 rounded-2xl bg-slate-50 border border-slate-100"
          >
            <dt
              class="text-[11px] font-black uppercase tracking-wider text-slate-400"
            >
              {{ row.label }}
            </dt>
            <dd class="mt-1 font-bold text-[#333] break-words">
              {{ row.value || "—" }}
            </dd>
          </div>
        </dl>

        <!-- Edit mode -->
        <form v-else @submit.prevent="saveProfile" class="grid sm:grid-cols-2 gap-4">
          <label class="block">
            <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5"
              >First name</span
            >
            <input
              v-model="form.firstName"
              maxlength="60"
              required
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none transition-all"
            />
          </label>
          <label class="block">
            <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5"
              >Last name</span
            >
            <input
              v-model="form.lastName"
              maxlength="60"
              required
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none transition-all"
            />
          </label>
          <label class="block sm:col-span-2">
            <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5"
              >Program</span
            >
            <select
              v-model="form.program"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none transition-all"
            >
              <option value="">Select program</option>
              <option v-for="p in programOptions" :key="p" :value="p">
                {{ p }}
              </option>
            </select>
          </label>
          <p class="sm:col-span-2 text-xs text-slate-400">
            Username and email can't be changed.
          </p>
          <div class="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              :disabled="savingProfile || !profileChanged"
              class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00733f] to-[#2e9b5f] text-white font-bold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="savingProfile" class="w-4 h-4 animate-spin" />
              <Check v-else class="w-4 h-4" />
              {{ savingProfile ? "Saving…" : "Save changes" }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <!-- ===================== MY POSTS TAB ===================== -->
      <section v-else class="mt-5">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="f in filters"
              :key="f.id"
              @click="filter = f.id"
              class="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all"
              :class="
                filter === f.id
                  ? 'bg-[#00733f] text-white border-[#00733f]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#00733f]'
              "
            >
              {{ f.label }} ({{ countFor(f.id) }})
            </button>
          </div>
          <div class="flex gap-2">
            <div class="relative flex-1 sm:w-56">
              <Search
                class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                v-model="search"
                type="search"
                placeholder="Search my posts"
                aria-label="Search my posts"
                class="w-full pl-9 pr-3 py-2 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#00733f]"
              />
            </div>
            <button
              @click="router.push({ name: 'MarketplacePost' })"
              class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff8c42] text-[#333] text-sm font-bold whitespace-nowrap hover:shadow-lg"
            >
              <PlusCircle class="w-4 h-4" /> New post
            </button>
          </div>
        </div>

        <div v-if="loadingPosts" class="py-16 text-center text-slate-500">
          <Loader2 class="w-8 h-8 animate-spin mx-auto mb-3 text-[#00733f]" />
          Loading your posts…
        </div>

        <div
          v-else-if="posts.length === 0"
          class="py-16 text-center bg-white rounded-3xl border border-slate-200"
        >
          <Package class="w-14 h-14 text-[#a7d49b] mx-auto mb-3" />
          <p class="font-black text-[#333] text-lg">You haven't posted anything yet</p>
          <p class="text-sm text-slate-500 mb-5">Your listings will show up here.</p>
          <button
            @click="router.push({ name: 'MarketplacePost' })"
            class="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#ff8c42] text-[#333] font-bold"
          >
            Post your first item
          </button>
        </div>

        <p
          v-else-if="visiblePosts.length === 0"
          class="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200"
        >
          No posts match this filter.
        </p>

        <div v-else class="grid sm:grid-cols-2 gap-4">
          <article
            v-for="p in visiblePosts"
            :key="p.id"
            class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div class="flex gap-4 p-4">
              <div
                class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center relative"
              >
                <img
                  v-if="p.thumbnailUrl"
                  :src="p.thumbnailUrl"
                  :alt="p.title"
                  class="w-full h-full object-cover"
                  :class="p.status === 'TRADED' ? 'grayscale opacity-70' : ''"
                  loading="lazy"
                />
                <Package v-else class="w-8 h-8 text-[#a7d49b]" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="font-black text-[#333] leading-tight line-clamp-2">
                    {{ p.title }}
                  </h4>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide flex-shrink-0"
                    :class="
                      p.status === 'TRADED'
                        ? 'bg-slate-700 text-white'
                        : 'bg-[#a7d49b]/40 text-[#00733f]'
                    "
                    >{{ p.status === "TRADED" ? "Traded" : "Available" }}</span
                  >
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  {{ conditionLabel(p.condition) }}
                  <span v-if="p.category">· {{ p.category }}</span>
                  · {{ formatDate(p.createdAt) }}
                </p>
                <p
                  v-if="p.status === 'TRADED'"
                  class="text-xs text-slate-500 mt-1"
                >
                  Traded<span v-if="p.tradedWithUsername">
                    with <b>@{{ p.tradedWithUsername }}</b></span
                  ><span v-if="p.tradedAt"> on {{ formatDate(p.tradedAt) }}</span>
                </p>
                <div class="flex gap-3 mt-2 text-xs font-semibold text-slate-500">
                  <span class="flex items-center gap-1" title="Comments"
                    ><MessageCircle class="w-3.5 h-3.5" /> {{ p.commentCount }}</span
                  >
                  <span class="flex items-center gap-1" title="Likes"
                    ><Heart class="w-3.5 h-3.5" /> {{ p.likeCount }}</span
                  >
                  <span class="flex items-center gap-1" title="Chats"
                    ><MessagesSquare class="w-3.5 h-3.5" /> {{ p.chatCount }}</span
                  >
                </div>
              </div>
            </div>

            <div
              class="mt-auto grid grid-cols-4 border-t border-slate-100 text-xs font-bold"
            >
              <button
                @click="viewPost(p)"
                class="py-3 flex flex-col items-center gap-1 text-slate-600 hover:bg-slate-50"
              >
                <Eye class="w-4 h-4" /> View
              </button>
              <button
                @click="openEditPost(p)"
                class="py-3 flex flex-col items-center gap-1 text-amber-700 hover:bg-amber-50"
              >
                <Pencil class="w-4 h-4" /> Edit
              </button>
              <button
                @click="toggleStatus(p)"
                :disabled="busyPostId === p.id"
                class="py-3 flex flex-col items-center gap-1 text-[#00733f] hover:bg-[#00733f]/5 disabled:opacity-50"
              >
                <Undo2 v-if="p.status === 'TRADED'" class="w-4 h-4" />
                <Repeat v-else class="w-4 h-4" />
                {{ p.status === "TRADED" ? "Reopen" : "Traded" }}
              </button>
              <button
                @click="removePost(p)"
                :disabled="busyPostId === p.id"
                class="py-3 flex flex-col items-center gap-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 class="w-4 h-4" /> Delete
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>

    <!-- Edit post modal -->
    <div
      v-if="editingPost"
      class="fixed inset-0 z-[950] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      @click.self="editingPost = null"
    >
      <form
        @submit.prevent="savePost"
        class="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-black text-[#333]">Edit post</h3>
          <button
            type="button"
            @click="editingPost = null"
            class="p-1.5 rounded-full hover:bg-slate-100"
            aria-label="Close"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4">
          <label class="block">
            <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5">Title</span>
            <input
              v-model="postForm.title"
              required
              maxlength="120"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none"
            />
          </label>
          <label class="block">
            <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5">Description</span>
            <textarea
              v-model="postForm.description"
              rows="4"
              maxlength="5000"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:bg-white focus:border-[#00733f] outline-none resize-y"
            ></textarea>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5">Category</span>
              <select
                v-model="postForm.category"
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none"
              >
                <option value="">General</option>
                <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
              </select>
            </label>
            <label class="block">
              <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5">Condition</span>
              <select
                v-model="postForm.condition"
                required
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none"
              >
                <option v-for="c in conditionOptions" :key="c.value" :value="c.value">
                  {{ c.label }}
                </option>
              </select>
            </label>
          </div>
          <label class="block">
            <span class="block text-[11px] font-black uppercase text-slate-400 mb-1.5">Meetup location</span>
            <input
              v-model="postForm.meetupLocation"
              maxlength="120"
              placeholder="e.g. Near the Gazebo"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold focus:bg-white focus:border-[#00733f] outline-none"
            />
          </label>
          <p class="text-xs text-slate-400">Photos can't be changed here.</p>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            type="submit"
            :disabled="savingPost || !postForm.title.trim()"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#00733f] to-[#2e9b5f] text-white font-bold disabled:opacity-50"
          >
            <Loader2 v-if="savingPost" class="w-4 h-4 animate-spin" />
            {{ savingPost ? "Saving…" : "Save post" }}
          </button>
          <button
            type="button"
            @click="editingPost = null"
            class="px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  Eye,
  Heart,
  Loader2,
  LogOut,
  MessageCircle,
  MessagesSquare,
  Package,
  Pencil,
  PlusCircle,
  Repeat,
  Search,
  Trash2,
  Undo2,
  User as UserIcon,
  LayoutGrid,
  X,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import NotificationBell from "@/components/NotificationBell.vue";
import {
  deletePost,
  getMyPosts,
  updatePost,
  updatePostStatus,
  type MyPost,
} from "@/api/items";
import type { Item } from "@/types/item";

type Tab = "profile" | "posts";
type Filter = "ALL" | "AVAILABLE" | "TRADED";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const tabs = [
  { id: "profile" as Tab, label: "Profile", icon: UserIcon },
  { id: "posts" as Tab, label: "My Posts", icon: LayoutGrid },
];
const tab = ref<Tab>(route.query.tab === "posts" ? "posts" : "profile");

function setTab(t: Tab) {
  tab.value = t;
  router.replace({ query: t === "posts" ? { tab: "posts" } : {} });
}

// ------------------------------------------------------------ toast

const toast = reactive({ text: "", kind: "success" as "success" | "error" });
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(text: string, kind: "success" | "error" = "success") {
  toast.text = text;
  toast.kind = kind;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.text = ""), 3500);
}

// ------------------------------------------------------------ profile

const displayName = computed(() => {
  const u = authStore.user;
  const full = `${u?.firstName || ""} ${u?.lastName || ""}`.trim();
  return full || u?.username || "User";
});

const detailRows = computed(() => [
  { label: "Username", value: authStore.user?.username },
  { label: "Email", value: authStore.user?.email },
  { label: "First name", value: authStore.user?.firstName },
  { label: "Last name", value: authStore.user?.lastName },
  { label: "Program", value: authStore.user?.program },
  { label: "Role", value: authStore.user?.role || "USER" },
]);

const BASE_PROGRAMS = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Business",
  "Engineering",
  "Other",
];
/** Keep the user's current program selectable even if it's not in the list. */
const programOptions = computed(() => {
  const current = authStore.user?.program;
  return current && !BASE_PROGRAMS.includes(current)
    ? [current, ...BASE_PROGRAMS]
    : BASE_PROGRAMS;
});

const isEditing = ref(false);
const savingProfile = ref(false);
const form = reactive({ firstName: "", lastName: "", program: "" });

function fillForm() {
  form.firstName = authStore.user?.firstName || "";
  form.lastName = authStore.user?.lastName || "";
  form.program = authStore.user?.program || "";
}

const profileChanged = computed(
  () =>
    form.firstName.trim() !== (authStore.user?.firstName || "") ||
    form.lastName.trim() !== (authStore.user?.lastName || "") ||
    form.program !== (authStore.user?.program || ""),
);

function startEdit() {
  fillForm();
  isEditing.value = true;
}

function cancelEdit() {
  fillForm();
  isEditing.value = false;
}

async function saveProfile() {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    showToast("First and last name are required.", "error");
    return;
  }
  savingProfile.value = true;
  try {
    await authStore.updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      program: form.program,
    });
    isEditing.value = false;
    showToast("Profile updated.");
  } catch {
    showToast(authStore.error || "Failed to update profile.", "error");
  } finally {
    savingProfile.value = false;
  }
}

function handleLogout() {
  authStore.logout();
  router.push({ name: "Home" });
}

// ------------------------------------------------------------ my posts

const posts = ref<MyPost[]>([]);
const postsLoaded = ref(false);
const loadingPosts = ref(false);
const busyPostId = ref<number | null>(null);
const filter = ref<Filter>("ALL");
const search = ref("");

const filters = [
  { id: "ALL" as Filter, label: "All" },
  { id: "AVAILABLE" as Filter, label: "Available" },
  { id: "TRADED" as Filter, label: "Traded" },
];

function countFor(f: Filter) {
  return f === "ALL"
    ? posts.value.length
    : posts.value.filter((p) => p.status === f).length;
}

const visiblePosts = computed(() => {
  const q = search.value.trim().toLowerCase();
  return posts.value.filter(
    (p) =>
      (filter.value === "ALL" || p.status === filter.value) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)),
  );
});

async function loadPosts() {
  if (!authStore.token) return;
  loadingPosts.value = true;
  try {
    posts.value = await getMyPosts(authStore.token);
    postsLoaded.value = true;
  } catch (e: any) {
    showToast(e?.message || "Failed to load your posts.", "error");
  } finally {
    loadingPosts.value = false;
  }
}

function replacePost(updated: MyPost) {
  posts.value = posts.value.map((p) => (p.id === updated.id ? updated : p));
}

function viewPost(p: MyPost) {
  router.push({ name: "Marketplace", query: { item: String(p.id) } });
}

async function toggleStatus(p: MyPost) {
  if (!authStore.token) return;
  const next: Item["status"] = p.status === "TRADED" ? "AVAILABLE" : "TRADED";
  if (
    next === "TRADED" &&
    !confirm(`Mark "${p.title}" as traded? People will no longer be able to start new chats about it.`)
  )
    return;
  busyPostId.value = p.id;
  try {
    replacePost(await updatePostStatus(p.id, next, authStore.token));
    showToast(next === "TRADED" ? "Marked as traded." : "Post is available again.");
  } catch (e: any) {
    showToast(e?.message || "Failed to update status.", "error");
  } finally {
    busyPostId.value = null;
  }
}

async function removePost(p: MyPost) {
  if (!authStore.token) return;
  if (
    !confirm(
      `Delete "${p.title}"?\n\nIts comments, likes and chats will be deleted too. This can't be undone.`,
    )
  )
    return;
  busyPostId.value = p.id;
  try {
    await deletePost(p.id, authStore.token);
    posts.value = posts.value.filter((x) => x.id !== p.id);
    showToast("Post deleted.");
  } catch (e: any) {
    showToast(e?.message || "Failed to delete post.", "error");
  } finally {
    busyPostId.value = null;
  }
}

// Edit post modal
const editingPost = ref<MyPost | null>(null);
const savingPost = ref(false);
const postForm = reactive({
  title: "",
  description: "",
  category: "",
  condition: "USED" as Item["condition"],
  meetupLocation: "",
});

const BASE_CATEGORIES = ["Academic", "Electronics", "Fashion"];
const categoryOptions = computed(() => {
  const current = editingPost.value?.category;
  return current && !BASE_CATEGORIES.includes(current)
    ? [current, ...BASE_CATEGORIES]
    : BASE_CATEGORIES;
});

const conditionOptions: { value: Item["condition"]; label: string }[] = [
  { value: "NEW", label: "Brand New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "USED", label: "Used (Good)" },
  { value: "DAMAGED", label: "Damaged" },
];

function conditionLabel(c: Item["condition"]) {
  return conditionOptions.find((o) => o.value === c)?.label || c;
}

function openEditPost(p: MyPost) {
  editingPost.value = p;
  postForm.title = p.title;
  postForm.description = p.description || "";
  postForm.category = p.category || "";
  postForm.condition = p.condition;
  postForm.meetupLocation = p.meetupLocation || "";
}

async function savePost() {
  if (!editingPost.value || !authStore.token) return;
  savingPost.value = true;
  try {
    const updated = await updatePost(
      editingPost.value.id,
      {
        title: postForm.title.trim(),
        description: postForm.description,
        category: postForm.category,
        condition: postForm.condition,
        meetupLocation: postForm.meetupLocation,
      },
      authStore.token,
    );
    replacePost(updated);
    editingPost.value = null;
    showToast("Post updated.");
  } catch (e: any) {
    showToast(e?.message || "Failed to save post.", "error");
  } finally {
    savingPost.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ------------------------------------------------------------ init

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: "Home", query: { modal: "login" } });
    return;
  }
  try {
    await authStore.fetchProfile();
  } catch {
    showToast("Failed to load profile. Please refresh.", "error");
  }
  if (tab.value === "posts") loadPosts();
});

// Load posts the first time the tab is opened.
watch(tab, (t) => {
  if (t === "posts" && !postsLoaded.value) loadPosts();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
