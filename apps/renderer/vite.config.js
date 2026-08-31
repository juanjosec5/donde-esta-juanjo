import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // @trip/shared ships raw .vue/.js source; keep esbuild's dep pre-bundler off it.
  optimizeDeps: { exclude: ["@trip/shared"] },
});
