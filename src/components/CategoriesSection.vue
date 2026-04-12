<script setup lang="ts">
defineProps<{
  categories: {
    icon: any;
    name: string;
    color: string;
  }[];
}>();
</script>

<template>
  <section
    class="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#F5F5F5] to-[#E2E8F0]"
  >
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-20 lg:mb-32">
        <h2
          class="text-5xl lg:text-7xl font-black bg-gradient-to-r from-[#FFD700] via-[#FF8C42] to-[#FFD700] bg-clip-text text-transparent drop-shadow-xl mb-6 leading-tight"
        >
          Popular Categories
        </h2>
        <p class="text-2xl text-[#64748B] font-normal max-w-2xl mx-auto">
          What DLSAU students are buying & selling right now
        </p>
      </div>
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12"
      >
        <div
          v-for="category in categories"
          :key="category.name"
          class="bg-white rounded-3xl p-10 cursor-pointer group shadow-xl border border-transparent hover:border-[#00733F]/30 hover:shadow-2xl hover:-translate-y-12 transition-all duration-500 overflow-hidden relative"
        >
          <div
            :style="{
              backgroundImage: `linear-gradient(135deg, ${category.color}22, ${category.color}44)`,
            }"
            class="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-[5deg] group-hover:shadow-[0_20px_40px_rgba(0,119,63,0.2)] transition-all duration-500 border-2 border-white/30"
          >
            <component
              :is="category.icon"
              class="w-12 h-12 lg:w-14 lg:h-14 text-[#333333] drop-shadow-lg"
            />
          </div>
          <h3
            class="text-2xl font-black text-[#333333] group-hover:text-white group-hover:drop-shadow-lg transition-colors duration-300 text-center leading-tight"
          >
            {{ category.name }}
          </h3>
          <div
            class="absolute inset-0 bg-gradient-to-r from-[#00733F] to-[#A7D49B] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -m-px"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
