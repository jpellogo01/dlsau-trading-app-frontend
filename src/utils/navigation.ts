/**
 * Authentication-aware navigation utility
 * Framework-agnostic vanilla JS implementation
 *
 * USAGE:
 * // In HTML button
 * <button onclick="navigateTo('browse')">Browse Marketplace</button>
 * <button onclick="navigateTo('post')">Post Item</button>
 *
 * // Or attach to event listeners
 * document.getElementById('browse-btn').addEventListener('click', () => navigateTo('browse'));
 */

interface RouteMap {
  [key: string]: string;
}

/**
 * Check if user is authenticated (vanilla JS version)
 * Checks for token in localStorage (matches app's auth pattern)
 */
function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

/**
 * Get login redirect URL matching app pattern
 */
function getLoginUrl(): string {
  // Matches Home.vue modal pattern and router guard
  return "/ ?modal=login";
}

/**
 * Core navigation logic using switch for readability
 */
function getTargetUrl(page: string): string {
  const routes: RouteMap = {
    browse: "/marketplace", // Browse items
    post: "/marketplace/post", // Post new item
    // Add more mappings as needed
    // 'profile': '/profile',
  };

  return routes[page] || "/";
}

/**
 * Main navigation function
 * @param page - Target page identifier ("browse", "post")
 * Redirects unauthenticated to login, authenticated to page route
 */
function navigateTo(page: string): void {
  if (!isAuthenticated()) {
    // Unauthenticated: redirect to login modal on home
    window.location.href = getLoginUrl();
    return;
  }

  // Authenticated: go to dedicated page
  const targetUrl = getTargetUrl(page);
  window.location.href = targetUrl;
}

// Export for module usage (if using import)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { navigateTo, isAuthenticated };
}

// Expose globally for direct script usage
(window as any).navigateTo = navigateTo;

/**
 * VUE 3 INTEGRATION (Composables)
 *
 * In Vue components:
 * import { useRouter } from 'vue-router';
 * import { useAuthStore } from '@/stores/auth';
 *
 * const router = useRouter();
 * const authStore = useAuthStore();
 *
 * function navigateTo(page: string) {
 *   if (!authStore.isAuthenticated) {
 *     router.push({ name: 'Home', query: { modal: 'login' } });
 *     return;
 *   }
 *
 *   const routes = {
 *     'browse': { name: 'Marketplace' },
 *     'post': { name: 'MarketplacePost' },
 *   };
 *
 *   router.push(routes[page] || '/');
 * }
 *
 * USAGE IN TEMPLATE:
 * <button @click="navigateTo('browse')">Browse Items</button>
 * <button @click="navigateTo('post')">Post Item</button>
 *
 * Or for cleaner composable:
 *
 * // composables/useAuthNavigation.ts
 * import { useRouter } from 'vue-router';
 * import { useAuthStore } from '@/stores/auth';
 *
 * export function useAuthNavigation() {
 *   const router = useRouter();
 *   const authStore = useAuthStore();
 *
 *   const navigateTo = (page: string) => {
 *     if (!authStore.isAuthenticated) {
 *       router.push({ name: 'Home', query: { modal: 'login' } });
 *       return;
 *     }
 *
 *     const routes = {
 *       browse: '/marketplace',
 *       post: '/marketplace/post',
 *     };
 *
 *     router.push(routes[page] || '/');
 *   };
 *
 *   return { navigateTo };
 * }
 *
 * // In component: const { navigateTo } = useAuthNavigation();
 */
