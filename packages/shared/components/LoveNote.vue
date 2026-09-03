<script setup>
import { ref, inject } from "vue";
import { PAGE } from "../lib/keys.js";

const note = inject(PAGE).note;
const open = ref(false);
</script>

<template>
  <div class="note" :class="{ open }">
    <button
      class="flap"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="stamp" aria-hidden="true">✈︎</span>
      <span class="flap-text">
        {{ open ? note.openLabel : note.label }}
      </span>
      <span class="hint">{{ open ? "" : note.hint }}</span>
    </button>

    <Transition name="unfold">
      <div v-if="open" class="paper">
        <p>{{ note.body }}</p>
        <div v-if="note.hearts" class="hearts" aria-hidden="true">
          <i v-for="n in 9" :key="n" :style="{ '--i': n }">♥</i>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.note {
  width: min(560px, 100%);
  margin: 0 auto;
}

.flap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.5rem;
  background: linear-gradient(160deg, var(--peach), var(--coral));
  color: #5c3a3f;
  border: none;
  border-radius: var(--radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.3s ease;
}
.flap:hover {
  transform: translateY(-2px);
}
.flap::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 62%;
  background: rgba(255, 255, 255, 0.16);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top;
}
.note.open .flap::before {
  transform: scaleY(-1) translateY(30%);
}

.stamp {
  position: absolute;
  top: 0.7rem;
  right: 0.9rem;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1.5px dashed rgba(92, 58, 63, 0.5);
  border-radius: 5px;
  font-size: 0.9rem;
}
.flap-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.3rem;
  z-index: 1;
}
.hint {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.8;
  z-index: 1;
}

.paper {
  position: relative;
  margin-top: -12px;
  padding: 2rem 1.6rem 1.7rem;
  background: var(--shell);
  border: 1px solid var(--edge);
  border-radius: 0 0 var(--radius) var(--radius);
  box-shadow: var(--card-shadow);
}
.paper p {
  white-space: pre-line;
  font-size: 1.05rem;
  line-height: 1.8;
}

.hearts {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.hearts i {
  position: absolute;
  left: calc(8% + var(--i) * 10%);
  bottom: -20px;
  color: var(--gold);
  font-size: calc(0.7rem + var(--i) * 0.05rem);
  animation: rise 3s ease-in calc(var(--i) * 0.18s) forwards;
  opacity: 0;
}
@keyframes rise {
  10% { opacity: 0.9; }
  100% {
    transform: translateY(-220px) rotate(25deg);
    opacity: 0;
  }
}

.unfold-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top;
}
.unfold-enter-from {
  opacity: 0;
  transform: scaleY(0.6) translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .flap::before,
  .flap,
  .unfold-enter-active {
    transition: none;
  }
  .hearts {
    display: none;
  }
}
</style>
