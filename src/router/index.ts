import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Home from "@/components/Home.vue";
import Login from "@/components/Login.vue";
import Profile from "@/components/Profile.vue";
import AuthRequired from "@/components/AuthRequired.vue";

// Define routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/auth-required",
    name: "AuthRequired",
    component: AuthRequired,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/marketplace",
    name: "Marketplace",
    component: () => import("@/components/Marketplace.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/marketplace/post",
    name: "MarketplacePost",
    component: () => import("@/components/MarketplacePost.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/chats/:id?",
    name: "Chats",
    component: () => import("@/components/Chat.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Auth guard
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: "Home",
      query: { modal: "login", redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
