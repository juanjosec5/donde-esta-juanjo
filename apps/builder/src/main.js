import { createApp } from "vue";
import { createPinia } from "pinia";
import { reveal } from "@trip/shared";
import "@trip/shared/styles/base.css";
import "./styles.css";
import App from "./App.vue";
import { router } from "./router.js";
import { useAuth } from "./store.js";

const app = createApp(App);
app.use(createPinia());
app.directive("reveal", reveal);

useAuth()
  .init()
  .finally(() => {
    app.use(router);
    app.mount("#app");
  });
