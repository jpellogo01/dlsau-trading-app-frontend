<template>
  <div class="min-h-screen bg-[#FDFDFD] font-sans text-slate-900">
    <div class="h-2 bg-[#00733F] w-full"></div>

    <main class="max-w-5xl mx-auto px-4 py-6 md:py-12">
      <div
        class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
      >
        <div class="space-y-1">
          <button
            @click="$router.back()"
            class="flex items-center gap-2 text-[#00733F] font-bold text-sm hover:translate-x-1 transition-transform mb-4"
          >
            <ArrowLeft class="w-4 h-4" /> Back to Market
          </button>
          <h1
            class="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none"
          >
            Post an <span class="text-[#00733F]">Item.</span>
          </h1>
          <p class="text-slate-500 font-medium">
            Safe and easy trading for the DLSAU community.
          </p>
        </div>

        <div
          class="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400"
        >
          <span :class="thumbnailFile ? 'text-[#00733F]' : ''">Media</span>
          <div class="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#00733F] transition-all"
              :style="{ width: thumbnailFile ? '100%' : '0%' }"
            ></div>
          </div>
          <span :class="isFormValid ? 'text-[#00733F]' : ''">Post</span>
        </div>
      </div>

      <Transition name="fade">
        <div
          v-if="successMessage"
          class="bg-white border-2 border-[#00733F] rounded-3xl p-10 text-center shadow-xl"
        >
          <div
            class="w-16 h-16 bg-[#00733F] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3"
          >
            <CheckCircle class="w-10 h-10" />
          </div>
          <h2 class="text-2xl font-black text-slate-900 mb-2">Item Posted!</h2>
          <p class="text-slate-500 mb-8">{{ successMessage }}</p>
          <button
            @click="resetForm"
            class="w-full md:w-auto px-10 py-4 bg-[#00733F] text-white rounded-xl font-bold hover:bg-[#005a32] transition-colors"
          >
            Post Another Item
          </button>
        </div>
      </Transition>

      <form
        v-if="!successMessage"
        @submit.prevent="handleSubmit"
        class="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div class="lg:col-span-7 space-y-6">
          <section
            class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <h3
              class="text-xs font-black uppercase tracking-widest text-[#00733F] mb-6"
            >
              Listing Details
            </h3>

            <div class="space-y-5">
              <div class="group">
                <label
                  class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                  >Item Title *</label
                >
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="What are you trading?"
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                    >Category</label
                  >
                  <select
                    v-model="form.category"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold appearance-none"
                  >
                    <option value="">General</option>
                    <option value="Academic">Academic Gear</option>
                    <option value="Academic">School Supplies</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion/Uniforms</option></select
                  >cd
                </div>
                <div>
                  <label
                    class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                    >Condition *</label
                  >
                  <select
                    v-model="form.condition"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold"
                    required
                  >
                    <option value="" disabled>Select Condition</option>
                    <option value="NEW">Brand New</option>
                    <option value="USED">Used (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                  >Description</label
                >
                <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="Tell us more about the item..."
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          <section
            class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <h3
              class="text-xs font-black uppercase tracking-widest text-[#00733F] mb-6"
            >
              Trade & Pickup
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                  >Meetup Location</label
                >
                <div class="relative">
                  <MapPin
                    class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00733F]"
                  />
                  <input
                    v-model="form.meetupLocation"
                    type="text"
                    placeholder="e.g. Near the Gazebo"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <div>
                <label
                  class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                  >Preference</label
                >
                <select
                  v-model="form.tradeOption"
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold"
                  required
                >
                  <option value="SELL">Sell Only</option>
                  <option value="SELL">For Donation</option>
                  <option value="TRADE">Trade Only</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              <div class="relative">
                <label
                  class="block text-[11px] font-black uppercase text-slate-400 mb-2 ml-1"
                  >Asking Price (Optional)</label
                >
                <span
                  class="absolute left-5 bottom-[18px] font-bold text-slate-400"
                  >₱</span
                >
                <input
                  v-model.number="form.price"
                  type="number"
                  placeholder="0.00"
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-5 py-4 focus:bg-white focus:border-[#00733F] outline-none transition-all font-bold"
                />
              </div>
            </div>
          </section>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <section
            class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
          >
            <h3
              class="text-xs font-black uppercase tracking-widest text-[#00733F] mb-6"
            >
              Media
            </h3>

            <div class="relative group mb-4">
              <input
                ref="thumbnailRef"
                @change="handleThumbnail"
                type="file"
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div
                class="aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center transition-all group-hover:border-[#00733F] group-hover:bg-[#00733F]/5"
              >
                <div v-if="!thumbnailFile" class="text-center">
                  <Camera class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p class="text-[11px] font-black uppercase text-slate-400">
                    Cover Photo *
                  </p>
                </div>
                <div v-else class="text-center px-4">
                  <Check class="w-8 h-8 text-[#00733F] mx-auto mb-2" />
                  <p class="text-sm font-bold text-slate-800 truncate">
                    {{ thumbnailFile.name }}
                  </p>
                </div>
              </div>
            </div>

            <div class="relative group">
              <input
                ref="additionalRef"
                @change="handleAdditional"
                type="file"
                multiple
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                class="w-full py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 transition-all group-hover:bg-slate-100"
              >
                <Plus class="w-4 h-4 text-[#00733F]" />
                <span
                  class="text-xs font-black uppercase tracking-widest text-slate-600"
                >
                  {{
                    additionalFiles.length > 0
                      ? `${additionalFiles.length} Added`
                      : "Add More Images"
                  }}
                </span>
              </div>
            </div>
          </section>

          <div class="sticky bottom-6 lg:relative">
            <div
              v-if="errorMessage"
              class="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-4 border border-red-100"
            >
              {{ errorMessage }}
            </div>

            <button
              :disabled="isSubmitting || !isFormValid"
              type="submit"
              class="w-full py-5 bg-[#00733F] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:bg-[#005a32] hover:-translate-y-1 transition-all active:scale-95 disabled:grayscale disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
              <span v-else>Confirm Listing</span>
            </button>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { postItem } from "@/api/items";
import {
  ArrowLeft,
  Camera,
  MapPin,
  CheckCircle,
  Plus,
  Check,
  Loader2,
} from "lucide-vue-next";

// Logic remains consistent with your previous setup to ensure backend compatibility
const router = useRouter();
const authStore = useAuthStore();
const thumbnailRef = ref<HTMLInputElement | null>(null);
const additionalRef = ref<HTMLInputElement | null>(null);

const form = reactive({
  title: "",
  description: "",
  category: "",
  price: null as number | null,
  isNegotiable: false,
  tradeOption: "BOTH",
  condition: "",
  meetupLocation: "",
});

const thumbnailFile = ref<File | null>(null);
const additionalFiles = ref<File[]>([]);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const isFormValid = computed(() => {
  return (
    form.title.trim() &&
    form.tradeOption &&
    form.condition &&
    thumbnailFile.value
  );
});

const handleThumbnail = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.[0]) {
    if (target.files[0].size > 5 * 1024 * 1024) {
      errorMessage.value = "Image must be under 5MB";
      return;
    }
    thumbnailFile.value = target.files[0];
    errorMessage.value = "";
  }
};

const handleAdditional = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    additionalFiles.value = Array.from(target.files).filter(
      (f) => f.size <= 5 * 1024 * 1024,
    );
  }
};

const handleSubmit = async () => {
  if (!authStore.token || !isFormValid.value) return;
  isSubmitting.value = true;
  errorMessage.value = "";

  const formData = new FormData();
  Object.entries(form).forEach(([key, val]) => {
    if (val !== null) formData.append(key, val.toString());
  });

  if (thumbnailFile.value) formData.append("thumbnail", thumbnailFile.value);
  additionalFiles.value.forEach((file) =>
    formData.append("additionalImages", file),
  );

  try {
    await postItem(formData, authStore.token);
    successMessage.value = "Your item has been listed for the DLSAU community.";
  } catch (error: any) {
    errorMessage.value =
      "There was an error posting your item. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    title: "",
    description: "",
    category: "",
    price: null,
    condition: "",
    meetupLocation: "",
  });
  thumbnailFile.value = null;
  additionalFiles.value = [];
  successMessage.value = "";
};

if (!authStore.isAuthenticated) router.push("/login");
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for cleaner look */
textarea::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
