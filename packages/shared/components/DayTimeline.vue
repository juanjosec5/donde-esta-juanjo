<script setup>
import {
  computed,
  inject,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { PAGE, NOW } from "../lib/keys.js";
import { useTripState } from "../composables/useTripState";
import { useLocale } from "../composables/useLocale";
import { dateRange, nightCount, parseDay } from "../lib/format";

const page = inject(PAGE);
const now = inject(NOW);
const segments = page.segments;

const { t, locale } = useLocale();

const { currentIndex, started } = useTripState(segments, page.reunion.iso);

// The card the "jump to today" controls scroll to (first stop before the trip starts).
const anchorIndex = computed(() => Math.max(currentIndex.value, 0));

/* --- "today" dot + rail fill ---------------------------------------
 * The glowing marker rides down the current stop's card as its days pass,
 * and the coral rail fill tracks it. `--day-through` (0→1) drives both via
 * CSS calc; the card's measured box is only re-read on layout changes. */
const rootEl = ref(null);
const curTop = ref(0);
const curHeight = ref(0);

const dayThrough = computed(() => {
  const i = currentIndex.value;
  if (i < 0) return 0;
  const s = segments[i];
  const a = parseDay(s.start).getTime();
  const e = parseDay(s.end).getTime() + 86400000; // end day inclusive
  if (e <= a) return 1;
  return Math.min(Math.max((now.value - a) / (e - a), 0), 1);
});

function measureCurrent() {
  const root = rootEl.value;
  if (!root) return;
  const li = root.querySelectorAll(".entry")[Math.max(currentIndex.value, 0)];
  if (!li) return;
  curTop.value = li.offsetTop;
  curHeight.value = li.offsetHeight;
}

onMounted(async () => {
  await nextTick();
  measureCurrent();
  document.fonts?.ready.then(measureCurrent);
  window.addEventListener("resize", measureCurrent, { passive: true });
});
onUnmounted(() => window.removeEventListener("resize", measureCurrent));
watch(currentIndex, () => nextTick(measureCurrent));

/* --- day-ruler -------------------------------------------------------
 * The whole rail gets one notch a day. The coral band runs from
 * `target.countFrom` (the homeward stretch) to today — earlier days sit
 * on the ruler but aren't counted. A gauge, not aligned to the cards. */
const lastSeg = segments[segments.length - 1];
const tripStart = parseDay(segments[0].start);
const rulerEnd = parseDay(lastSeg.end || lastSeg.start);
const countFrom = page.reunion.countFrom ? parseDay(page.reunion.countFrom) : null;

const showRuler = rulerEnd > tripStart;
const rulerDays = Math.max(Math.round((rulerEnd - tripStart) / 86400000), 1);

const span = rulerEnd - tripStart;
const frac = (ts) => Math.min(Math.max((ts - tripStart.getTime()) / span, 0), 1);

// Coral band: countFrom → now (0 before the homeward stretch begins).
const litFrom = `${(frac((countFrom ?? rulerEnd).getTime()) * 100).toFixed(2)}%`;
const litTo = computed(() => {
  const from = frac((countFrom ?? rulerEnd).getTime());
  return `${(Math.max(frac(now.value), from) * 100).toFixed(2)}%`;
});

function state(i) {
  if (!started.value) return "future";
  if (i < currentIndex.value) return "past";
  if (i === currentIndex.value) return "current";
  return "future";
}

function nightsText(s) {
  const n = nightCount(s.start, s.end);
  return n === 0 ? t("timeline.dayTrip") : t("timeline.nights", n);
}
const range = (s) => dateRange(s.start, s.end, locale.value);
</script>

<template>
  <section
    ref="rootEl"
    class="timeline"
    :style="{
      '--cur-top': curTop + 'px',
      '--cur-height': curHeight + 'px',
      '--day-through': dayThrough,
    }"
  >
    <div class="rail" aria-hidden="true"><span class="rail-fill" /></div>

    <div
      v-if="showRuler"
      class="ruler"
      aria-hidden="true"
      :style="{
        '--ruler-days': rulerDays,
        '--lit-from': litFrom,
        '--lit-to': litTo,
      }"
    >
      <span class="tickset faint" />
      <span class="tickset lit" />
    </div>

    <ol>
      <li
        v-for="(s, i) in segments"
        :key="i"
        :id="i === anchorIndex ? 'today' : null"
        class="entry"
        :class="[state(i), s.type || 'stay', i % 2 ? 'right' : 'left']"
        v-reveal="{ delay: (i % 3) * 70 }"
      >
        <span
          v-if="state(i) === 'current'"
          class="marker"
          aria-hidden="true"
        />

        <div class="card">
          <template v-if="s.type === 'hop'">
            <p class="hop-line">
              <span class="emoji">{{ s.emoji }}</span>
              {{ s.city }}
              <span class="hop-code">{{ s.country }}</span>
            </p>
          </template>

          <template v-else>
            <span class="eyebrow">{{ s.country }}</span>
            <h3>{{ s.city }} <span class="emoji">{{ s.emoji }}</span></h3>
            <p class="when">{{ range(s) }} · {{ nightsText(s) }}</p>
            <span v-if="state(i) === 'current'" class="badge">{{ t('timeline.current') }}</span>
            <span v-else-if="s.type === 'reunion'" class="badge gold">{{ t('timeline.finish') }}</span>
          </template>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.timeline {
  position: relative;
  margin: 0 auto;
  max-width: 900px;
  padding: 1rem 0 2rem;
}

/* rail ---------------------------------------------------------------- */
.rail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 22px;
  width: 3px;
  background: var(--edge);
  border-radius: 3px;
}
.rail-fill {
  position: absolute;
  inset: 0 0 auto 0;
  /* reach the centre of the "today" marker: card top + marker offset,
     plus how far the current day sits through the stop */
  height: calc(
    var(--cur-top, 0px) + 1.4rem + 8.5px +
      var(--day-through, 0) * (var(--cur-height, 0px) - 2.8rem)
  );
  background: var(--accent-fill);
  border-radius: 3px;
  transition: height 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

/* day-ruler — one crossbar a day down the whole rail ----------------- */
.ruler {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 23px; /* centre of the rail (left:22 + width:3 / 2) */
  width: 11px;
  transform: translateX(-50%);
  pointer-events: none;
}
.tickset {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    currentColor 0 2px,
    transparent 2px calc(100% / var(--ruler-days, 20))
  );
}
.tickset.faint {
  color: var(--ink-soft);
  opacity: 0.4;
}
.tickset.lit {
  color: var(--coral);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0 var(--lit-from, 0%),
    #000 var(--lit-from, 0%) var(--lit-to, 0%),
    transparent var(--lit-to, 0%)
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0 var(--lit-from, 0%),
    #000 var(--lit-from, 0%) var(--lit-to, 0%),
    transparent var(--lit-to, 0%)
  );
}

ol {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

/* entry ------------------------------------------------------------- */
.entry {
  position: relative;
  padding-left: 58px;
}

/* only the current stop shows a dot; the rest of the line is the day-ruler */
.marker {
  position: absolute;
  left: 15px;
  top: calc(1.4rem + var(--day-through, 0) * (100% - 2.8rem));
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--mint);
  border: 3px solid var(--mint);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--mint) 28%, transparent);
  animation: throb 2.2s ease-in-out infinite;
  transition: top 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 1;
}
@keyframes throb {
  50% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--mint) 0%, transparent); }
}

/* card ------------------------------------------------------------- */
.card {
  background: var(--shell);
  border: 1px solid var(--edge);
  border-radius: var(--radius);
  padding: 1.15rem 1.3rem;
  box-shadow: 0 14px 34px -26px color-mix(in srgb, var(--ink) 50%, transparent);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.card:hover {
  transform: translateY(-3px);
}
.entry.future .card {
  opacity: 0.62;
}
.entry.current .card {
  border-color: var(--mint);
  box-shadow: 0 18px 40px -22px color-mix(in srgb, var(--mint) 70%, transparent);
}
.entry.reunion .card {
  border-color: var(--gold);
  background: linear-gradient(
    160deg,
    var(--shell),
    color-mix(in srgb, var(--gold) 14%, transparent)
  );
}

h3 {
  font-size: clamp(1.3rem, 4vw, 1.7rem);
  margin: 0.35rem 0 0.2rem;
}
.emoji {
  font-family: var(--font-body);
}
.when {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-soft);
}

.badge {
  display: inline-block;
  margin-top: 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  background: var(--mint);
  color: color-mix(in srgb, var(--mint) 35%, #000);
}
.badge.gold {
  background: var(--gold);
  color: color-mix(in srgb, var(--gold) 32%, #000);
}

/* hop ------------------------------------------------------------- */
.entry.hop .card {
  background: transparent;
  border: 1px dashed var(--edge);
  box-shadow: none;
  padding: 0.7rem 1rem;
}
.hop-line {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--ink-soft);
}
.hop-code {
  opacity: 0.7;
  margin-left: 0.4rem;
}
.entry.hop .marker {
  width: 11px;
  height: 11px;
  left: 18px;
  border-width: 2px;
}

/* desktop: alternate sides -------------------------------------- */
@media (min-width: 760px) {
  .rail {
    left: 50%;
    transform: translateX(-50%);
  }
  .ruler {
    left: 50%;
  }
  .entry {
    width: 50%;
    padding-left: 0;
  }
  .entry.left {
    align-self: flex-start;
    padding-right: 42px;
    text-align: right;
  }
  .entry.right {
    align-self: flex-end;
    padding-left: 42px;
  }
  .entry.left .marker {
    left: auto;
    right: -8.5px;
  }
  .entry.right .marker {
    left: -8.5px;
  }
  .entry.left.hop .marker {
    right: -5.5px;
  }
  .entry.right.hop .marker {
    left: -5.5px;
  }
  .entry.left .card:hover {
    transform: translateY(-3px);
  }
  ol {
    gap: 2.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rail-fill,
  .card {
    transition: none;
  }
  .marker {
    animation: none;
    transition: none;
  }
}
</style>
