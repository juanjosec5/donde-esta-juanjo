import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { reveal } from "@trip/shared";
import "@trip/shared/styles/base.css";
import App from "./App.vue";
import { routes } from "./router.js";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).directive("reveal", reveal).mount("#app");
