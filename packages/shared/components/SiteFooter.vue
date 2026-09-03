<script setup>
import { inject } from "vue";
import { PAGE } from "../lib/keys.js";
import { useCountdown } from "../composables/useCountdown";
import { useLocale } from "../composables/useLocale";

const page = inject(PAGE);
const reunion = page.reunion;
const branding = page.branding;
const { parts, done } = useCountdown(reunion.iso);
const { t } = useLocale();
</script>

<template>
  <footer class="foot">
    <p v-if="!done">{{ t('footer.countdown', parts.days, parts.hours, reunion.label) }}</p>
    <p v-else>{{ t('footer.together', reunion.city) }}</p>
    <p class="made">
      <template v-if="branding.credit">{{ branding.credit }} · </template>{{ reunion.dateLabel }}
    </p>
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
