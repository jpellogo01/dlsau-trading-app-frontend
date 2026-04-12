<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { LogIn, Shield } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

function goToLogin() {
  router.push({
    name: "Home",
    query: {
      modal: "login",
      redirect: (route.query.redirect as string) || "/",
    },
  });
}

function goHome() {
  router.push({ name: "Home" });
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-araneta-green via-araneta-green/80 to-araneta-gold flex items-center justify-center px-4"
  >
    <div class="max-w-md w-full">
      <!-- Auth Required Card -->
      <div
        class="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20 text-center shadow-2xl"
      >
        <!-- Icon -->
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 bg-araneta-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Shield class="w-10 h-10 sm:w-12 sm:h-12 text-araneta-gold" />
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-black text-white mb-4">
          Authentication Required
        </h1>

        <!-- Message -->
        <p
          class="text-white/80 mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed"
        >
          You need to be logged in to access this page. Please sign in to
          continue with your trading activities.
        </p>

        <!-- Actions -->
        <div class="space-y-4">
          <button
            @click="goToLogin"
            class="w-full px-6 sm:px-8 py-3 sm:py-4 bg-araneta-green text-white font-semibold rounded-lg hover:bg-araneta-green/90 transition transform hover:-translate-y-1 text-base sm:text-lg shadow-lg hover:shadow-glow-gold/25 flex items-center justify-center gap-2"
          >
            <LogIn class="w-5 h-5" />
            Sign In to Continue
          </button>

          <button
            @click="goHome"
            class="w-full px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-araneta-green transition transform hover:-translate-y-1 text-base sm:text-lg"
          >
            Go Back Home
          </button>
        </div>

        <!-- Additional Info -->
        <div class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20">
          <p class="text-white/60 text-sm">
            Don't have an account?
            <button
              @click="goToLogin"
              class="text-araneta-gold hover:text-araneta-gold/80 font-semibold underline ml-1"
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
