<script setup>
import { computed } from "vue";
import { useLocale } from "../composables/useLocale";

const { locale, t, toggle } = useLocale();

// show the language you'd switch TO
const other = computed(() => (locale.value === "es" ? "EN" : "ES"));
</script>

<template>
  <button
    class="ctl"
    type="button"
    :aria-label="t('toggle.switchLang')"
    :title="t('toggle.switchLang')"
    @click="toggle"
  >
    {{ other }}
  </button>
</template>

<style scoped>
.ctl {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--edge);
  border-radius: 999px;
  background: var(--shell);
  color: var(--ink-soft);
  box-shadow: var(--card-shadow);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.ctl:hover {
  color: var(--ink);
  border-color: var(--ink-soft);
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .ctl {
    transition: none;
  }
}
</style>
