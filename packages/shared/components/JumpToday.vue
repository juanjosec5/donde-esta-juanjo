<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import { scrollToToday } from "../lib/scrollToToday";
import { EMBEDDED } from "../lib/keys.js";

const embedded = inject(EMBEDDED, false);

// Show the pill only when the current-day card is off-screen.
const shown = ref(false);
let io;

onMounted(() => {
  const target = document.getElementById("today");
  if (!target) return;
  io = new IntersectionObserver(
    ([entry]) => {
      shown.value = !entry.isIntersecting;
    },
    { rootMargin: "-15% 0px -15% 0px" },
  );
  io.observe(target);
});

onUnmounted(() => io?.disconnect());
</script>

<template>
  <button
    class="jump"
    :class="{ 'is-shown': shown, embedded }"
    :tabindex="shown ? 0 : -1"
    :aria-hidden="!shown"
    @click="scrollToToday"
  >
    <span class="arrow" aria-hidden="true">↓</span>
    where he is now
  </button>
</template>

<style scoped>
.jump {
  position: fixed;
  left: 50%;
  bottom: calc(1.1rem + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.15rem;
  border: 1px solid var(--edge);
  border-radius: 999px;
  background: var(--shell);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  box-shadow: var(--card-shadow);

  opacity: 0;
  transform: translate(-50%, 20px);
  pointer-events: none;
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.jump.is-shown {
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
}
.jump.embedded {
  position: absolute;
}
.jump:hover {
  border-color: var(--coral);
}

.arrow {
  color: var(--coral);
  animation: nudge 1.6s ease-in-out infinite;
}
@keyframes nudge {
  50% { transform: translateY(2px); }
}

@media (prefers-reduced-motion: reduce) {
  .jump {
    transition: opacity 0.2s ease;
    transform: translate(-50%, 0);
  }
  .arrow {
    animation: none;
  }
}
</style>
