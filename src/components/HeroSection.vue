<script setup lang="ts">
import { ShoppingCart, Plus, ShieldCheck } from "lucide-vue-next";
import { useAuthNavigation } from "@/composables/useAuthNavigation";

const { navigateTo } = useAuthNavigation();

const handleBrowse = () => navigateTo("browse");
const handlePost = () => navigateTo("post");
</script>

<template>
  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8FAFC] px-6 py-20"
  >
    <div
      class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
    >
      <div
        class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#00733F]/20 blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-[#FFD700]/10 blur-[100px]"
      ></div>
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="
          background-image: radial-gradient(#00733f 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        "
      ></div>
    </div>

    <div class="relative max-w-7xl mx-auto w-full z-10 text-center">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#00733F]/20 shadow-sm mb-10 animate-fade-in"
      >
        <span class="flex h-2 w-2 rounded-full bg-[#00733F]"></span>
        <span class="text-sm font-bold tracking-wide text-[#00733F] uppercase">
          DLSAU GAWT Exclusive
        </span>
        <div
          class="ml-2 px-2 py-0.5 bg-[#FFD700] text-[10px] font-black text-[#00733F] rounded-md"
        >
          V1.0
        </div>
      </div>

      <h1
        class="text-5xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] leading-[1.1] mb-8 tracking-tight"
      >
        Campus <span class="text-[#00733F]">Trading</span><br />
        <span class="relative inline-block mt-2">
          Redefined.
          <svg
            class="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 358 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9C118.5 -1.5 238.5 -1.5 355 9"
              stroke="#FFD700"
              stroke-width="6"
              stroke-linecap="round"
            />
          </svg>
        </span>
      </h1>

      <p
        class="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-12"
      >
        The official marketplace for the Lasallian community. Securely trade
        <span class="text-[#00733F] font-bold">textbooks</span>,
        <span class="text-[#00733F] font-bold">uniforms</span>, and
        <span class="text-[#00733F] font-bold">essentials</span> with verified
        students.
      </p>

      <div class="flex flex-col sm:flex-row gap-5 justify-center items-center">
        <button
          @click="handleBrowse"
          class="group relative px-10 py-5 bg-[#00733F] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#00733F]/20"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          ></div>
          <div class="flex items-center gap-3">
            <ShoppingCart class="w-5 h-5" />
            Browse Items
          </div>
        </button>

        <button
          @click="handlePost"
          class="px-10 py-5 bg-white border-2 border-slate-200 text-[#1A1A1A] rounded-2xl font-bold text-lg hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition-all flex items-center gap-3"
        >
          <Plus class="w-5 h-5 text-[#00733F]" />
          Post an Item
        </button>
      </div>

      <div
        class="mt-16 pt-10 border-t border-slate-200/60 flex flex-wrap justify-center gap-8 text-slate-400"
      >
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-5 h-5" />
          <span class="text-sm font-semibold italic">
            Verified dlsau.edu.ph Accounts Only
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* Custom shadow for the gold underline */
span svg path {
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
}
</style>
