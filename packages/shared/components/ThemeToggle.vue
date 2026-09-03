<script setup>
import { useMono } from "../composables/useMono";
import { useLocale } from "../composables/useLocale";

const { mono, toggle } = useMono();
const { t } = useLocale();
</script>

<template>
  <button
    class="ctl"
    type="button"
    :aria-pressed="mono"
    :aria-label="mono ? t('toggle.colour') : t('toggle.bw')"
    :title="mono ? t('toggle.colour') : t('toggle.bw')"
    @click="toggle"
  >
    <svg
      v-if="mono"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <path
        d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
    <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M20 13.5A8 8 0 1 1 10.5 4a6.3 6.3 0 0 0 9.5 9.5z"
        fill="currentColor"
      />
    </svg>
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
