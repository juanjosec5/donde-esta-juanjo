import { computed, inject } from "vue";
import { NOW } from "../lib/keys.js";
import { parseDay } from "../lib/format.js";

/**
 * @param {{start:string,end:string}[]} segments  render-model segments, in order
 * @param {string} targetIso                      the reunion moment
 * @param {import('vue').Ref<number>} [nowRef]     shared clock; falls back to inject(NOW)
 */
export function useTripState(segments, targetIso, nowRef) {
  const now = nowRef || inject(NOW);
  const at = computed(() => new Date(now.value));

  const start = parseDay(segments[0].start).getTime();
  const end = new Date(targetIso).getTime();

  // Last segment whose [start, end] window contains today (end day inclusive).
  const currentIndex = computed(() => {
    const t = at.value.getTime();
    if (t < start) return -1;
    for (let i = segments.length - 1; i >= 0; i--) {
      const s = parseDay(segments[i].start).getTime();
      const e = parseDay(segments[i].end);
      e.setDate(e.getDate() + 1); // make the end day inclusive
      if (t >= s && t < e.getTime()) return i;
    }
    return segments.length - 1;
  });

  const currentSegment = computed(
    () => segments[Math.max(currentIndex.value, 0)],
  );

  // 0..1 fraction of the whole trip elapsed, by time.
  const progress = computed(() => {
    const p = (at.value.getTime() - start) / (end - start);
    return Math.min(Math.max(p, 0), 1);
  });

  const started = computed(() => at.value.getTime() >= start);

  return { currentIndex, currentSegment, progress, started };
}
