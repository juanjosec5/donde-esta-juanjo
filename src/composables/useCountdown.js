import { computed, inject } from "vue";
import { reunion } from "../data/trip";

const NOW = Symbol.for("trip.now");

export function useCountdown() {
  const now = inject(NOW);
  const target = new Date(reunion.iso).getTime();

  const diff = computed(() => target - now.value);
  const done = computed(() => diff.value <= 0);

  const parts = computed(() => {
    const d = Math.max(diff.value, 0);
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  });

  return { parts, done, diff };
}

export { NOW };
