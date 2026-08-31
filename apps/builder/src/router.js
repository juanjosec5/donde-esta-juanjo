import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "./store.js";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "pages", component: () => import("./views/PagesList.vue"), meta: { auth: true } },
    { path: "/p/:id", name: "editor", component: () => import("./views/PageEditor.vue"), props: true, meta: { auth: true } },
    { path: "/sign-in", name: "sign-in", component: () => import("./views/SignIn.vue") },
  ],
});

router.beforeEach((to) => {
  const auth = useAuth();
  if (to.meta.auth && auth.ready && !auth.user) return { name: "sign-in" };
});
