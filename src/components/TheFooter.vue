<template>
  <footer
    class="relative bg-white border-t border-slate-200 pt-20 pb-10 overflow-hidden"
  >
    <div
      class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#00733F]/5 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <ShoppingBag class="w-8 h-8 text-[#00733F]" />
            <div class="flex flex-col">
              <span
                class="text-xl font-[1000] tracking-tighter text-[#00733F] leading-none"
                >GAWT</span
              >
              <span
                class="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]"
                >Campus Trading</span
              >
            </div>
          </div>
          <p
            class="text-slate-500 text-sm leading-relaxed max-w-xs font-medium"
          >
            The exclusive marketplace for De La Salle Araneta University
            students. Trade, sell, and connect safely within your campus.
          </p>
          <div class="flex items-center gap-4">
            <a
              v-for="icon in socialIcons"
              :key="icon.name"
              href="#"
              class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#00733F] hover:text-white transition-all duration-300"
            >
              <component :is="icon.component" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4
            class="text-slate-900 font-black uppercase tracking-widest text-xs mb-6"
          >
            Marketplace
          </h4>
          <ul class="space-y-4">
            <li v-for="link in marketplaceLinks" :key="link">
              <a
                href="#"
                class="text-slate-500 hover:text-[#00733F] text-sm font-bold transition-colors"
                >{{ link }}</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="text-slate-900 font-black uppercase tracking-widest text-xs mb-6"
          >
            Support
          </h4>
          <ul class="space-y-4">
            <li v-for="link in supportLinks" :key="link">
              <a
                href="#"
                class="text-slate-500 hover:text-[#00733F] text-sm font-bold transition-colors"
                >{{ link }}</a
              >
            </li>
          </ul>
        </div>

        <div class="relative group">
          <div
            class="absolute -inset-4 bg-gradient-to-br from-[#00733F]/10 to-[#FFD700]/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
          <div
            class="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00733F]"
              >
                <MapPin class="w-5 h-5" />
              </div>
              <span class="text-xs font-black text-slate-700"
                >DLSAU Campus</span
              >
            </div>
            <p
              class="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tighter"
            >
              Victoneta Ave, Malabon, <br />
              Metro Manila, Philippines
            </p>
            <button
              class="w-full py-3 bg-white text-[#00733F] border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#00733F] transition-all"
            >
              Get Directions
            </button>
          </div>
        </div>
      </div>

      <div
        class="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <p
          class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          © 2026 GAWT TRADING. Built for DLSAU Developers.
        </p>
        <div class="flex items-center gap-8">
          <a
            href="#"
            class="text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest"
            >Privacy Policy</a
          >
          <a
            href="#"
            class="text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest"
            >Terms of Service</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  ShoppingBag,
  Facebook,
  Twitter,
  Instagram,
  Github,
  MapPin,
} from "lucide-vue-next";

const socialIcons = [
  { name: "Facebook", component: Facebook },
  { name: "Twitter", component: Twitter },
  { name: "Instagram", component: Instagram },
  { name: "Github", component: Github },
];

const marketplaceLinks = [
  "Books & Supplies",
  "Uniforms",
  "Gadgets",
  "Pet Supplies",
  "Fashion",
];
const supportLinks = [
  "Safety Guidelines",
  "Trading FAQ",
  "Contact Admin",
  "Report Listing",
];
</script>
