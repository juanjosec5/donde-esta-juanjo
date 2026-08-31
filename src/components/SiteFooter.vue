<script setup>
import { reunion, people } from "../data/trip";
import { useCountdown } from "../composables/useCountdown";

const { parts, done } = useCountdown();
</script>

<template>
  <footer class="foot">
    <p v-if="!done">
      {{ parts.days }} days, {{ parts.hours }} hours to
      {{ reunion.label }}.
    </p>
    <p v-else>Together in {{ reunion.city }}. That's the whole story.</p>
    <p class="made">made with a lot of missing you · {{ reunion.dateLabel }}</p>
  </footer>
</template>

<style scoped>
.foot {
  text-align: center;
  padding: 3rem 1.5rem 4rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink-soft);
  line-height: 1.9;
}
.made {
  opacity: 0.7;
}
</style>
