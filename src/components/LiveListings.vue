<template>
  <section class="px-4 md:px-8 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
    <div
      class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="w-8 h-1 bg-[#00733F] rounded-full"></span>
          <span
            class="text-[#00733F] font-black uppercase tracking-[0.3em] text-xs"
            >Marketplace</span
          >
        </div>
        <h2
          class="text-4xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-none"
        >
          Live
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-[#00733F] to-[#A7D49B]"
            >Listings</span
          >
        </h2>
        <p class="text-lg text-slate-500 font-medium">
          From DLSAU students near you
        </p>
      </div>

      <div
        class="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-600 font-bold text-sm"
      >
        <div class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00733F] opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-[#00733F]"
          ></span>
        </div>
        Real-time Updates
      </div>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-[500px] bg-slate-100 rounded-[3rem] animate-pulse"
      ></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div v-for="item in items" :key="item.id" class="group relative">
        <div
          class="absolute -inset-2 bg-gradient-to-b from-[#00733F]/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <div
          class="relative bg-white border border-slate-100 rounded-[2.5rem] p-3 transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,115,63,0.2)] group-hover:-translate-y-3"
        >
          <div
            class="relative aspect-square rounded-[2rem] overflow-hidden shadow-sm bg-slate-50"
          >
            <img
              v-if="item.thumbnailUrl"
              :src="item.thumbnailUrl"
              class="w-full h-full object-cover transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300"
            >
              <Package class="w-16 h-16" />
            </div>

            <div class="absolute top-4 left-4 flex gap-2">
              <div
                class="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2"
              >
                <div
                  class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                ></div>
                <span
                  class="text-[10px] font-black uppercase tracking-widest text-white"
                  >{{ item.condition }}</span
                >
              </div>
            </div>

            <div
              class="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div
                class="w-full py-3 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-between px-4 shadow-xl border border-white"
              >
                <span
                  class="text-xs font-bold text-slate-400 uppercase tracking-tighter"
                  >Current Price</span
                >
                <span class="text-xl font-black text-[#00733F]">
                  {{ item.price ? `₱${item.price.toLocaleString()}` : "FREE" }}
                </span>
              </div>
            </div>

            <button
              @click.stop="$emit('action', item, 'like')"
              class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all shadow-lg active:scale-90"
            >
              <Heart
                class="w-5 h-5 fill-current"
                :class="{ 'text-red-500': item.isLiked }"
              />
            </button>
          </div>

          <div class="p-5 pt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00733F] to-[#A7D49B] p-[2px]"
                >
                  <div
                    class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden"
                  >
                    <User class="w-4 h-4 text-[#00733F]" />
                  </div>
                </div>
                <div class="flex flex-col">
                  <span
                    class="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-0.5"
                    >Seller</span
                  >
                  <span class="text-xs font-bold text-slate-800 leading-none">{{
                    item.user.username
                  }}</span>
                </div>
              </div>
              <div
                class="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest"
              >
                {{ item.category || "General" }}
              </div>
            </div>

            <div class="space-y-2 mb-6">
              <h3
                class="text-2xl font-[1000] text-slate-900 leading-tight line-clamp-1 group-hover:text-[#00733F] transition-colors"
              >
                {{ item.title }}
              </h3>
              <p
                class="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed h-[40px]"
              >
                {{
                  item.description ||
                  "Inquire for details about this campus listing."
                }}
              </p>
            </div>

            <div
              class="flex items-center justify-between pt-5 border-t border-slate-50"
            >
              <div class="flex flex-col">
                <span
                  class="text-[10px] font-bold text-slate-300 uppercase tracking-wider"
                  >Posted Date</span
                >
                <span class="text-xs font-black text-slate-500 uppercase">{{
                  formatDate(item.createdAt)
                }}</span>
              </div>

              <button
                @click="$emit('action', item, 'contact')"
                class="relative px-6 py-3 bg-[#00733F] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] overflow-hidden group/btn hover:shadow-[0_10px_20px_-5px_rgba(0,115,63,0.4)] transition-all active:scale-95"
              >
                <span class="relative z-10">Message</span>
                <div
                  class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Package, User, Heart } from "lucide-vue-next";
import type { Item } from "@/types/item";

defineProps<{
  items: Item[];
  loading: boolean;
}>();

defineEmits(["action"]);

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<style scoped>
.cubic-bezier {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
