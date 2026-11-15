import { defineStore, acceptHMRUpdate } from "pinia";
import { ref, computed } from "vue";
import authService from "@/api/auth";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  VerifyOTPRequest,
} from "@/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const registrationEmail = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isVerified = computed(() => user.value?.isVerified ?? false);

  async function initializeAuth() {
    if (token.value) {
      try {
        await fetchProfile();
      } catch (err) {
        console.error("Token invalid, logging out");
        logout();
      }
    }
  }

  // Token persistence handled in login/verifyOTP/logout + api interceptor

  async function login(credentials: LoginRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.login(credentials);
      token.value = response.token;
      user.value = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        program: response.program,
        role: response.role,
        isVerified: response.isVerified,
      };
      authService.setToken(response.token);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(data: RegisterRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.register(data);
      registrationEmail.value = data.email;
      // Store the OTP for display (in real app, OTP would be sent via email)
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function verifyOTP(data: VerifyOTPRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.verifyOTP(data);
      token.value = response.token;
      user.value = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        program: response.program,
        role: response.role,
        isVerified: response.isVerified,
      };
      authService.setToken(response.token);
      registrationEmail.value = null;
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || "OTP verification failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function resendOTP(email: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.resendOTP(email);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Failed to resend OTP";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProfile() {
    isLoading.value = true;
    error.value = null;
    try {
      const profile = await authService.getProfile();
      user.value = profile;
      return profile;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Failed to fetch profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(data: {
    firstName?: string;
    lastName?: string;
    program?: string;
  }) {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await authService.updateProfile(data);
      user.value = updated;
      return updated;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Failed to update profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    registrationEmail.value = null;
    error.value = null;
    authService.removeToken();
  }

  function clearError() {
    error.value = null;
  }

  return {
    user,
    token,
    isLoading,
    error,
    registrationEmail,
    isAuthenticated,
    isVerified,
    login,
    register,
    verifyOTP,
    resendOTP,
    fetchProfile,
    updateProfile,
    logout,
    clearError,
    initializeAuth,
  };
});

// Let the dev server hot-swap this store when the file changes (no stale actions).
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
