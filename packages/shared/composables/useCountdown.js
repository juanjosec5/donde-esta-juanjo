import { computed, inject } from "vue";
import { NOW } from "../lib/keys.js";

export function useCountdown(targetIso, nowRef) {
  const now = nowRef || inject(NOW);
  const target = new Date(targetIso).getTime();
  const valid = Number.isFinite(target);

  const diff = computed(() => (valid ? target - now.value : 0));
  const done = computed(() => valid && diff.value <= 0);

  const parts = computed(() => {
    const d = valid ? Math.max(diff.value, 0) : 0;
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  });

  return { parts, done, diff };
}
