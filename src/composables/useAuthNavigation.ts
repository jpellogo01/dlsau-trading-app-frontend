import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export function useAuthNavigation() {
  const router = useRouter();
  const authStore = useAuthStore();

  /**
   * Authentication-aware navigation for Vue components
   * @param page - "browse" or "post"
   */
  const navigateTo = (page: string) => {
    if (!authStore.isAuthenticated) {
      // Matches existing app pattern
      router.push({ name: "Home", query: { modal: "login" } });
      return;
    }

    // Route mappings matching router/index.ts
    const routes: Record<string, string> = {
      browse: "/marketplace",
      post: "/marketplace/post",
    };

    const targetRoute = routes[page] || "/";
    router.push(targetRoute);
  };

  return {
    navigateTo,
  };
}
