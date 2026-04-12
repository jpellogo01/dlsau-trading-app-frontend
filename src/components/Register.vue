<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
  >
    <!-- Overlay -->
    <div class="absolute inset-0" @click="closeModal"></div>

    <!-- Modal -->
    <div
      class="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-white/20"
    >
      <!-- Progress Bar -->
      <div
        class="absolute top-0 left-0 w-full h-2 bg-slate-100 overflow-hidden"
      >
        <div
          class="h-full bg-gradient-to-r from-[#00733F] via-[#A7D49B] to-[#00733F] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative shadow-[0_0_15px_rgba(0,115,63,0.4)] progress-bar-shine"
          :style="{ width: isFormStep ? '50%' : '100%' }"
        >
          <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      <!-- Header -->
      <div
        class="relative p-8 pb-4 flex justify-between items-start overflow-hidden"
      >
        <div
          class="absolute -top-10 -left-10 w-40 h-40 bg-[#00733F]/5 rounded-full blur-3xl pointer-events-none"
        ></div>

        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-1.5">
            <div
              v-if="isOtpStep"
              class="w-2 h-2 rounded-full bg-[#00733F] animate-ping"
            ></div>
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-[#00733F]/60"
            >
              Step {{ isFormStep ? "01" : "02" }} of 02
            </span>
          </div>
          <h2
            class="text-3xl font-[1000] text-slate-900 tracking-tight leading-none"
          >
            {{ isFormStep ? "Join the Team" : "Verify Identity" }}
          </h2>
          <p class="text-slate-500 text-sm font-medium mt-2">
            {{
              isFormStep
                ? "Create your DLSAU trading account"
                : `We sent a code to ${emailForOtp}`
            }}
          </p>
        </div>

        <button
          @click="closeModal"
          class="relative z-10 p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-8 pt-0 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <!-- Registration Error -->
        <div
          v-if="registerError"
          class="flex items-center gap-3 p-4 mb-6 bg-orange-50 border border-orange-100 rounded-2xl text-orange-700 text-sm font-bold animate-shake"
        >
          <AlertCircle class="w-5 h-5 shrink-0" />
          {{ registerError }}
        </div>

        <!-- OTP Error -->
        <div
          v-if="otpError"
          class="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold animate-shake"
        >
          <AlertCircle class="w-5 h-5 shrink-0" />
          {{ otpError }}
        </div>

        <!-- OTP Dev Note -->
        <div
          v-if="isOtpStep"
          class="p-3 mb-6 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl text-[#00733F] text-[10px] uppercase font-black text-center tracking-widest"
        >
          Dev Note: Check console or response for OTP
        </div>

        <!-- Registration Form -->
        <form
          v-if="isFormStep"
          @submit.prevent="handleRegister"
          class="space-y-5"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 uppercase ml-1"
                >Username</label
              >
              <input
                v-model="username"
                type="text"
                placeholder="jp_dev"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all outline-none font-medium"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 uppercase ml-1"
                >DLSAU Email</label
              >
              <input
                v-model="email"
                type="email"
                placeholder="name@dlsau.edu.ph"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-black text-slate-700 uppercase ml-1"
              >Password</label
            >
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all outline-none font-medium"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-2 hover:text-slate-600"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 uppercase ml-1"
                >First Name</label
              >
              <input
                v-model="firstName"
                type="text"
                placeholder="John"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all outline-none font-medium"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-black text-slate-700 uppercase ml-1"
                >Last Name</label
              >
              <input
                v-model="lastName"
                type="text"
                placeholder="Pellogo"
                required
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-black text-slate-700 uppercase ml-1"
              >Academic Program</label
            >
            <select
              v-model="program"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#00733F]/10 focus:border-[#00733F] transition-all outline-none font-medium text-slate-700"
            >
              <option value="" disabled>Select your program</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="Business">Business</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-4 bg-[#00733F] text-white font-black rounded-xl shadow-xl shadow-[#00733F]/20 hover:bg-[#005a32] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            <Loader2 v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
            <span v-else>Continue to Verification</span>
            <ArrowRight
              v-if="!authStore.isLoading"
              class="w-4 h-4 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <!-- OTP Form -->
        <form
          v-else
          @submit.prevent="handleVerifyOtp"
          class="space-y-8 py-4 animate-fade-in"
        >
          <div class="text-center space-y-4">
            <div class="flex justify-center gap-3">
              <input
                v-model="otp"
                type="text"
                maxlength="6"
                placeholder="000000"
                class="w-full max-w-[240px] px-4 py-5 text-4xl font-black text-center tracking-[0.4em] bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10 transition-all outline-none text-[#00733F]"
              />
            </div>
            <p class="text-sm font-medium text-slate-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div class="space-y-3">
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-4 bg-[#FFD700] text-[#00733F] font-black rounded-xl shadow-xl shadow-[#FFD700]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 class="w-5 h-5" />
              Verify & Complete
            </button>
            <button
              type="button"
              @click="handleResendOtp"
              :disabled="authStore.isLoading"
              class="w-full py-2 text-sm font-bold text-[#00733F] hover:bg-[#00733F]/5 rounded-lg transition-colors"
            >
              Didn't get a code? <span class="underline">Resend</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-slate-100 text-center">
          <p class="text-slate-500 text-sm font-medium">
            Already a member?
            <button
              @click="switchToLogin"
              class="text-[#00733F] font-bold hover:underline ml-1"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  X,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "switchToLogin"]);
const authStore = useAuthStore();

// Form state
const step = ref<"form" | "otp">("form");
const username = ref("");
const password = ref("");
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const program = ref("");
const otp = ref("");
const showPassword = ref(false);

// Error state
const registerError = ref<string | null>(null);
const otpError = ref<string | null>(null);

const isFormStep = computed(() => step.value === "form");
const isOtpStep = computed(() => step.value === "otp");
const emailForOtp = computed(() => authStore.registrationEmail || email.value);

// --- Handlers ---
async function handleRegister() {
  try {
    registerError.value = null;
    await authStore.register({
      username: username.value,
      password: password.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      program: program.value,
      role: "USER",
    });
    step.value = "otp";
  } catch (err: any) {
    registerError.value =
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred.";
  }
}

async function handleVerifyOtp() {
  try {
    otpError.value = null;
    await authStore.verifyOTP({ email: emailForOtp.value, otp: otp.value });
    emit("close");
  } catch (err: any) {
    otpError.value =
      err.response?.data?.error || err.message || "OTP verification failed.";
  }
}

const handleResendOtp = () => authStore.resendOTP(emailForOtp.value);
const switchToLogin = () => emit("switchToLogin");

const closeModal = () => {
  emit("close");
  setTimeout(() => {
    step.value = "form";
    registerError.value = null;
    otpError.value = null;
  }, 300);
};

// Reset form when modal opens
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      step.value = "form";
      username.value = "";
      password.value = "";
      email.value = "";
      firstName.value = "";
      lastName.value = "";
      program.value = "";
      otp.value = "";
      registerError.value = null;
      otpError.value = null;
      authStore.clearError();
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
.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.progress-bar-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: bar-shine 2s infinite;
}
@keyframes bar-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #00733f40;
}
</style>
