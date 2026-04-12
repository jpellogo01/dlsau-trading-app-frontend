<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
  >
    <div class="absolute inset-0" @click="closeModal"></div>

    <div
      class="relative w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border border-white/20"
    >
      <div class="relative p-8 bg-[#00733F] text-center overflow-hidden">
        <div
          class="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD700]/20 rounded-full blur-2xl"
        ></div>

        <div class="relative z-10">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20"
          >
            <ShoppingBag class="w-8 h-8 text-[#FFD700]" />
          </div>
          <h2 class="text-3xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p class="text-white/80 text-sm mt-1 font-medium">
            Log in to GAWT Campus Trading
          </p>
        </div>
      </div>

      <div class="p-8">
        <div
          v-if="authStore.error"
          class="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-shake"
        >
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span class="font-medium">{{ authStore.error }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2 ml-1"
              >Username</label
            >
            <div class="relative">
              <User
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              />
              <input
                v-model="username"
                type="text"
                placeholder="Student ID or Username"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2 ml-1"
              >Password</label
            >
            <div class="relative">
              <Lock
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-4 bg-[#00733F] text-white font-bold rounded-xl shadow-lg shadow-[#00733F]/20 hover:bg-[#005a32] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Loader2 v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 text-center">
          <p class="text-slate-500 text-sm font-medium">
            New to the campus marketplace?
            <button
              @click="switchToRegister"
              class="text-[#00733F] font-bold hover:underline underline-offset-4 ml-1"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  ShoppingBag,
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "switchToRegister"]);

const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const showPassword = ref(false);

async function handleLogin() {
  await authStore.login({ username: username.value, password: password.value });
  if (!authStore.error) emit("close");
}

const closeModal = () => emit("close");
const switchToRegister = () => emit("switchToRegister");

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      username.value = "";
      password.value = "";
      authStore.error = "";
    }
  },
);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
