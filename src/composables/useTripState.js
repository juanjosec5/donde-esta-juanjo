import { computed, inject } from "vue";
import { segments, reunion } from "../data/trip";
import { parseDay } from "../lib/format";

const NOW = Symbol.for("trip.now");

const START = parseDay(segments[0].start);
const END = new Date(reunion.iso);

export function useTripState() {
  const now = inject(NOW);
  const at = computed(() => new Date(now.value));

  // Last segment whose [start, end] window contains today (end day inclusive).
  const currentIndex = computed(() => {
    const t = at.value.getTime();
    if (t < START.getTime()) return -1;
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
    const p = (at.value.getTime() - START.getTime()) / (END.getTime() - START.getTime());
    return Math.min(Math.max(p, 0), 1);
  });

  const started = computed(() => at.value.getTime() >= START.getTime());

  return { currentIndex, currentSegment, progress, started };
}
