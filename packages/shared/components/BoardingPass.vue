<script setup>
import { ref, computed, inject, onMounted, watch } from "vue";
import { PAGE } from "../lib/keys.js";
import { useCountdown } from "../composables/useCountdown";
import { useTripState } from "../composables/useTripState";
import { useLocale } from "../composables/useLocale";
import { pad2 } from "../lib/format";

const { t } = useLocale();

const page = inject(PAGE);
const people = page.people;
const reunion = page.reunion;
const branding = page.branding;

const { parts, done } = useCountdown(reunion.iso);
const { currentSegment, started } = useTripState(page.segments, reunion.iso);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const shownDays = ref(reduced ? parts.value.days : 0);
const introDone = ref(reduced);

onMounted(() => {
  if (reduced) return;
  const to = parts.value.days;
  const dur = 1500;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    shownDays.value = Math.round(to * eased);
    if (p < 1) requestAnimationFrame(step);
    else introDone.value = true;
  };
  requestAnimationFrame(step);
});

watch(
  () => parts.value.days,
  (d) => {
    if (introDone.value) shownDays.value = d;
  },
);

const clock = computed(
  () => `${pad2(parts.value.hours)}:${pad2(parts.value.minutes)}:${pad2(parts.value.seconds)}`,
);

const first = page.segments[0] ?? {};
const fromLabel = computed(() =>
  started.value ? currentSegment.value.city : first.city ?? "",
);
const fromEmoji = computed(() =>
  started.value ? currentSegment.value.emoji : first.emoji ?? "",
);

const flyingTo = computed(() => people.home);

// Deterministic barcode.
const bars = Array.from({ length: 41 }, (_, i) => {
  const seed = Math.sin(i * 12.9898) * 43758.5453;
  return 1 + Math.floor((seed - Math.floor(seed)) * 4);
});
</script>

<template>
  <article class="pass" :class="{ done }">
    <div class="pass-main">
      <div class="pass-row">
        <span class="eyebrow">{{ t('bp.title') }}</span>
        <span class="code">{{ reunion.passCode }}</span>
      </div>

      <div class="fields">
        <div class="field">
          <span class="k">{{ t('bp.passenger') }}</span>
          <span class="v">{{ people.traveler }}</span>
        </div>
        <div class="field ar">
          <span class="k">{{ t('bp.flyingTo') }}</span>
          <span class="v">{{ flyingTo }} <span v-if="branding.heart" class="heart">♥</span></span>
        </div>
        <div class="field">
          <span class="k">{{ t('bp.rightNow') }}</span>
          <span class="v">{{ fromLabel }} <span class="fe">{{ fromEmoji }}</span></span>
        </div>
        <div class="field ar">
          <span class="k">{{ t('bp.gate') }}</span>
          <span class="v">{{ reunion.gate }}</span>
        </div>
      </div>
    </div>

    <div class="perf" aria-hidden="true">
      <span class="notch l" />
      <span class="notch r" />
    </div>

    <div class="pass-stub">
      <template v-if="!done">
        <span class="eyebrow">{{ t('bp.homeIn') }}</span>
        <div class="counter">
          <span v-if="!introDone" class="num">{{ shownDays }}</span>
          <Transition v-else name="tick" mode="out-in">
            <span :key="shownDays" class="num">{{ shownDays }}</span>
          </Transition>
          <span class="unit">{{ t('bp.days', shownDays) }}</span>
        </div>
        <div class="fine">
          <span class="clock">{{ clock }}</span>
          <span class="dot">•</span>
          <span>{{ t('bp.arrivals', reunion.dateLabel) }}</span>
        </div>
      </template>

      <template v-else>
        <span class="eyebrow">{{ t('bp.status') }}</span>
        <div class="counter">
          <span class="num home">{{ t('bp.home') }}</span>
        </div>
        <div class="fine">
          <span>{{ t('bp.pointedHere') }}</span>
        </div>
        <div class="confetti" aria-hidden="true">
          <i v-for="n in 24" :key="n" :style="{ '--i': n }" />
        </div>
      </template>

      <div class="barcode" aria-hidden="true">
        <i v-for="(w, i) in bars" :key="i" :style="{ flexGrow: w }" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.pass {
  --pad: clamp(1.4rem, 4vw, 2.6rem);
  width: min(560px, 100%);
  background: var(--shell);
  border-radius: var(--radius);
  box-shadow: var(--card-shadow);
  transform: rotate(-1.4deg);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  animation: land 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.pass:hover {
  transform: rotate(0deg);
}

@keyframes land {
  from {
    opacity: 0;
    transform: translateY(40px) rotate(-6deg);
  }
}

.pass-main {
  padding: var(--pad);
}

.pass-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}
.code {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--ink-soft);
}

.fields {
  margin-top: 1.6rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.15rem 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  min-width: 0;
}
.field.ar {
  text-align: right;
}
.k {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.v {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 3.4vw, 1.5rem);
  font-weight: 700;
}
.heart {
  color: var(--coral);
}
.fe {
  font-size: 0.9em;
}

/* perforation ------------------------------------------------------------- */
.perf {
  position: relative;
  height: 0;
  border-top: 2px dashed var(--edge);
  margin: 0 calc(var(--pad) * 0.55);
}
.notch {
  position: absolute;
  top: 50%;
  width: 26px;
  height: 26px;
  background: var(--cream);
  border-radius: 50%;
  transform: translateY(-50%);
}
.notch.l {
  left: calc(var(--pad) * -0.55 - 13px);
}
.notch.r {
  right: calc(var(--pad) * -0.55 - 13px);
}

/* stub ------------------------------------------------------------------- */
.pass-stub {
  position: relative;
  padding: calc(var(--pad) * 0.9) var(--pad) var(--pad);
  overflow: hidden;
}

.counter {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  margin-top: 0.35rem;
}
.num {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(4.2rem, 20vw, 7.4rem);
  line-height: 0.86;
  letter-spacing: -0.04em;
  background: var(--accent-fill);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-variant-numeric: tabular-nums;
}
.num.home {
  font-size: clamp(3rem, 14vw, 5rem);
  text-transform: lowercase;
}
.unit {
  font-family: var(--font-display);
  font-size: clamp(1rem, 3.5vw, 1.35rem);
  font-weight: 700;
  color: var(--ink-soft);
}

.fine {
  margin-top: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink-soft);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.clock {
  color: var(--ink);
  font-weight: 500;
}
.dot {
  opacity: 0.5;
}

.barcode {
  margin-top: 1.5rem;
  display: flex;
  gap: 3px;
  height: 46px;
  align-items: stretch;
}
.barcode i {
  background: var(--ink);
  opacity: 0.82;
  border-radius: 1px;
  flex-basis: 0;
}

/* day tick transition --------------------------------------------------- */
.tick-enter-active,
.tick-leave-active {
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.45s ease;
}
.tick-enter-from {
  opacity: 0;
  transform: translateY(-0.35em) rotateX(40deg);
}
.tick-leave-to {
  opacity: 0;
  transform: translateY(0.35em) rotateX(-40deg);
}

/* done state ----------------------------------------------------------- */
.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.confetti i {
  position: absolute;
  left: calc(var(--i) * 4.1%);
  top: -10%;
  width: 9px;
  height: 14px;
  border-radius: 2px;
  background: hsl(calc(var(--i) * 37) 85% 72%);
  animation: fall 2.6s ease-in calc(var(--i) * 0.06s) infinite;
}
@keyframes fall {
  to {
    transform: translateY(320%) rotate(540deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pass {
    animation: none;
    transform: none;
  }
  .confetti {
    display: none;
  }
}
</style>
