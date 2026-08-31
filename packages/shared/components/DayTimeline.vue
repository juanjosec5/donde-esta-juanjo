<script setup>
import { computed, inject } from "vue";
import { PAGE } from "../lib/keys.js";
import { useTripState } from "../composables/useTripState";
import { dateRange, nightCount } from "../lib/format";

const page = inject(PAGE);
const segments = page.segments;

const { currentIndex, progress, started } = useTripState(segments, page.reunion.iso);

// The card the "jump to today" controls scroll to (first stop before the trip starts).
const anchorIndex = computed(() => Math.max(currentIndex.value, 0));

function state(i) {
  if (!started.value) return "future";
  if (i < currentIndex.value) return "past";
  if (i === currentIndex.value) return "current";
  return "future";
}

function nightsText(s) {
  const n = nightCount(s.start, s.end);
  if (n === 0) return "day trip";
  return `${n} ${n === 1 ? "night" : "nights"}`;
}
</script>

<template>
  <section class="timeline" :style="{ '--progress': progress }">
    <div class="rail" aria-hidden="true"><span class="rail-fill" /></div>

    <ol>
      <li
        v-for="(s, i) in segments"
        :key="i"
        :id="i === anchorIndex ? 'today' : null"
        class="entry"
        :class="[state(i), s.type || 'stay', i % 2 ? 'right' : 'left']"
        v-reveal="{ delay: (i % 3) * 70 }"
      >
        <span class="marker" aria-hidden="true" />

        <div class="card">
          <template v-if="s.type === 'hop'">
            <p class="hop-line">
              <span class="emoji">{{ s.emoji }}</span>
              {{ s.city }}
              <span class="hop-code">{{ s.country }}</span>
            </p>
            <p class="blurb">{{ s.blurb }}</p>
          </template>

          <template v-else>
            <span class="eyebrow">{{ s.country }}</span>
            <h3>{{ s.city }} <span class="emoji">{{ s.emoji }}</span></h3>
            <p class="when">{{ dateRange(s.start, s.end) }} · {{ nightsText(s) }}</p>
            <p class="blurb">{{ s.blurb }}</p>
            <span v-if="state(i) === 'current'" class="badge">where he is right now</span>
            <span v-else-if="s.type === 'reunion'" class="badge gold">the finish line</span>
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
  height: calc(var(--progress, 0) * 100%);
  background: linear-gradient(var(--coral), var(--orchid));
  border-radius: 3px;
  transition: height 1.2s cubic-bezier(0.22, 1, 0.36, 1);
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

.marker {
  position: absolute;
  left: 15px;
  top: 1.4rem;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--shell);
  border: 3px solid var(--ink-soft);
  z-index: 1;
}
.entry.past .marker {
  background: var(--coral);
  border-color: var(--coral);
}
.entry.current .marker {
  background: var(--mint);
  border-color: var(--mint);
  box-shadow: 0 0 0 6px rgba(127, 216, 180, 0.28);
  animation: throb 2.2s ease-in-out infinite;
}
.entry.reunion .marker {
  background: var(--gold);
  border-color: var(--gold);
}
@keyframes throb {
  50% { box-shadow: 0 0 0 12px rgba(127, 216, 180, 0); }
}

/* card ------------------------------------------------------------- */
.card {
  background: var(--shell);
  border: 1px solid var(--edge);
  border-radius: var(--radius);
  padding: 1.15rem 1.3rem;
  box-shadow: 0 14px 34px -26px rgba(94, 67, 75, 0.5);
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
  box-shadow: 0 18px 40px -22px rgba(127, 216, 180, 0.7);
}
.entry.reunion .card {
  border-color: var(--gold);
  background: linear-gradient(160deg, var(--shell), rgba(244, 183, 64, 0.14));
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
.blurb {
  margin-top: 0.5rem;
  color: var(--ink);
}
.entry.future .blurb {
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
  color: #204a3a;
}
.badge.gold {
  background: var(--gold);
  color: #5c4300;
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
.entry.hop .blurb {
  font-size: 0.85rem;
  color: var(--ink-soft);
  font-style: italic;
  margin-top: 0.2rem;
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
  .entry.current .marker {
    animation: none;
  }
}
</style>
