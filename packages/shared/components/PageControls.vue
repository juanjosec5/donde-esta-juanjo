<script setup>
import { inject } from "vue";
import { EMBEDDED } from "../lib/keys.js";
import LangToggle from "./LangToggle.vue";
import ThemeToggle from "./ThemeToggle.vue";

// `theme` — show the black-and-white toggle (hidden where the palette is
// hand-tuned, e.g. the landing chooser).
defineProps({ theme: { type: Boolean, default: true } });

const embedded = inject(EMBEDDED, false);
</script>

<template>
  <div v-if="!embedded" class="page-controls">
    <LangToggle />
    <ThemeToggle v-if="theme" />
  </div>
</template>

<style scoped>
.page-controls {
  position: fixed;
  top: calc(0.9rem + env(safe-area-inset-top, 0px));
  right: calc(0.9rem + env(safe-area-inset-right, 0px));
  z-index: 30;
  display: flex;
  gap: 0.45rem;
}
</style>
