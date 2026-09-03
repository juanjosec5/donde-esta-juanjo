<script setup>
import { inject } from "vue";
import { EMBEDDED } from "../lib/keys.js";

// Purely decorative drifting atmosphere behind the whole page.
const embedded = inject(EMBEDDED, false);

const blobs = [
  { c: "var(--peach)",  s: 46, x: -8,  y: 4,  d: 34, delay: 0 },
  { c: "var(--orchid)", s: 40, x: 78,  y: 12, d: 42, delay: -8 },
  { c: "var(--sky)",    s: 52, x: 60,  y: 68, d: 38, delay: -18 },
  { c: "var(--coral)",  s: 34, x: 4,   y: 78, d: 46, delay: -26 },
];
</script>

<template>
  <div class="sky" :class="{ embedded }" aria-hidden="true">
    <span
      v-for="(b, i) in blobs"
      :key="i"
      class="blob"
      :style="{
        '--c': b.c,
        '--size': b.s + 'vmax',
        left: b.x + 'vw',
        top: b.y + 'vh',
        animationDuration: b.d + 's',
        animationDelay: b.delay + 's',
      }"
    />
    <div class="grain" />
  </div>
</template>

<style scoped>
.sky {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background:
    radial-gradient(
      120% 80% at 50% -10%,
      color-mix(in srgb, var(--peach) 50%, transparent),
      transparent 60%
    ),
    linear-gradient(180deg, var(--cream), var(--shell) 55%, var(--cream));
}
.sky.embedded {
  position: absolute;
}

.blob {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--c);
  border-radius: 46% 54% 62% 38% / 54% 42% 58% 46%;
  filter: blur(60px);
  opacity: 0.42;
  animation-name: drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes drift {
  from {
    transform: translate3d(-4%, -3%, 0) rotate(0deg) scale(1);
  }
  to {
    transform: translate3d(6%, 8%, 0) rotate(28deg) scale(1.12);
  }
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>
