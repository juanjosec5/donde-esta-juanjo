<script setup>
import { ref } from "vue";
import { LangToggle, useLocale } from "@trip/shared";

const { t } = useLocale();

// Pointer parallax for the colour blooms. -1..1 per axis, pushed onto CSS vars
// the halves read via `translate` on a single lightweight gradient layer.
// Disabled under reduced motion by the media query in <style>.
const px = ref(0);
const py = ref(0);

let raf = 0;
function onMove(e) {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    px.value = (e.clientX / window.innerWidth - 0.5) * 2;
    py.value = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}
</script>

<template>
  <div
    class="landing"
    :style="{ '--px': px, '--py': py }"
    @mousemove="onMove"
  >
    <RouterLink to="/partner" class="half partner">
      <span class="content">
        <span class="glyph" aria-hidden="true">♡</span>
        <span class="kicker">{{ t('landing.for') }}</span>
        <span class="title">{{ t('landing.partner') }}</span>
        <span class="go">{{ t('landing.enter') }} <span aria-hidden="true">→</span></span>
      </span>
    </RouterLink>

    <RouterLink to="/friends-family" class="half ff">
      <span class="content">
        <span class="glyph" aria-hidden="true">✈</span>
        <span class="kicker">{{ t('landing.for') }}</span>
        <span class="title">{{ t('landing.ff') }}</span>
        <span class="go">{{ t('landing.enter') }} <span aria-hidden="true">→</span></span>
      </span>
    </RouterLink>

    <span class="seam" aria-hidden="true" />

    <div class="masthead">
      <span class="eyebrow">dónde está juanjo</span>
      <p class="tag">{{ t('landing.tag') }}</p>
    </div>

    <div class="landing-controls">
      <LangToggle />
    </div>

    <span class="grain" aria-hidden="true" />
  </div>
</template>

<style scoped>
/*
 * Perf note: the colour field is pure `radial-gradient` (painted once, no
 * compositor layers). The only moving pieces are ONE non-blurred gradient
 * layer per half animated with transform, plus the seam and the entrance —
 * all cheap. No `filter: blur()`, no `mix-blend-mode`, no `will-change`.
 */
.landing {
  position: fixed;
  inset: 0;
  display: flex;
  overflow: hidden;
  background: var(--cream);
  isolation: isolate;
}

/* --- the two halves ------------------------------------------------- */
.half {
  position: relative;
  flex: 1 1 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  /* diagonal split: skew the panel, counter-skew everything inside it */
  transform: skewX(-9deg);
  transition: flex-grow 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  animation: rise-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.half.partner {
  margin-left: -12vw;
  animation-delay: 0.08s;
  background:
    radial-gradient(65% 55% at 22% 12%, #ffb0a6, transparent 70%),
    radial-gradient(60% 60% at 82% 88%, #c9a7f0, transparent 72%),
    radial-gradient(45% 45% at 95% 35%, #ffcba4, transparent 70%),
    linear-gradient(155deg, #ff9e9e, #b58ee0);
}
/* friends & family mirrors its page: warm paper + a sparing primary trio */
.half.ff {
  margin-right: -12vw;
  animation-delay: 0.16s;
  color: #262320;
  background:
    radial-gradient(58% 52% at 80% 12%, rgba(47, 107, 224, 0.5), transparent 70%),
    radial-gradient(56% 54% at 15% 84%, rgba(225, 75, 71, 0.42), transparent 72%),
    radial-gradient(46% 44% at 4% 30%, rgba(244, 200, 75, 0.6), transparent 70%),
    linear-gradient(205deg, #fbf6ea, #f0e6d0);
}
.ff::before {
  opacity: 0.32;
}
.ff .kicker {
  color: rgba(38, 35, 32, 0.6);
}
.ff .title {
  text-shadow: 0 4px 18px rgba(38, 35, 32, 0.16);
}
.ff .glyph {
  filter: drop-shadow(0 6px 16px rgba(38, 35, 32, 0.25));
}
.ff .go {
  background: rgba(38, 35, 32, 0.08);
  border-color: rgba(38, 35, 32, 0.26);
  color: #262320;
}
.ff:hover .go {
  background: rgba(38, 35, 32, 0.16);
}

/* one drifting, non-blurred gradient layer per half (cheap: transform only) */
.half::before {
  content: "";
  position: absolute;
  inset: -40%;
  z-index: 0;
  opacity: 0.5;
  background: radial-gradient(
    closest-side,
    rgba(255, 255, 255, 0.55),
    transparent 70%
  );
  translate: calc(var(--px, 0) * 24px) calc(var(--py, 0) * 24px);
  animation: bloom-drift 22s ease-in-out infinite alternate;
}
.ff::before {
  animation-delay: -11s;
  animation-duration: 26s;
}
@keyframes bloom-drift {
  from {
    transform: translate3d(-12%, -8%, 0) rotate(0deg);
  }
  to {
    transform: translate3d(12%, 10%, 0) rotate(30deg);
  }
}

/* hover a side → it grows, the other yields */
@media (hover: hover) {
  .landing:hover .half {
    flex-grow: 0.82;
  }
  .landing:hover .half:hover {
    flex-grow: 1.9;
  }
  .landing:hover .half:not(:hover) .content {
    opacity: 0.5;
  }
}

/* --- content ----------------------------------------------------- */
.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
  transform: skewX(9deg);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.half:hover .content {
  transform: skewX(9deg) translateY(-6px);
}

.glyph {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1;
  filter: drop-shadow(0 6px 18px rgba(94, 67, 75, 0.35));
}
.kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}
.title {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  font-size: clamp(2rem, 6vw, 3.6rem);
  max-width: 12ch;
  text-shadow: 0 8px 26px rgba(94, 67, 75, 0.4);
}
.go {
  margin-top: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.55);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  transition: background 0.3s ease, transform 0.3s ease;
}
.half:hover .go {
  background: rgba(255, 255, 255, 0.36);
  transform: translateX(3px);
}

/* --- seam ------------------------------------------------------ */
.seam {
  position: absolute;
  top: -10%;
  left: 50%;
  width: 2px;
  height: 120%;
  transform: translateX(-50%) skewX(-9deg);
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.9) 20%,
    rgba(255, 255, 255, 0.9) 80%,
    transparent
  );
  box-shadow: 0 0 30px 4px rgba(255, 255, 255, 0.45);
  z-index: 3;
  pointer-events: none;
  animation: seam-sway 12s ease-in-out infinite alternate;
}
@keyframes seam-sway {
  from {
    transform: translateX(-50%) skewX(-9deg);
  }
  to {
    transform: translateX(calc(-50% + 12px)) skewX(-11deg);
  }
}

/* --- masthead ----------------------------------------------- */
.masthead {
  position: absolute;
  top: clamp(1.4rem, 5vh, 3rem);
  left: 50%;
  z-index: 4;
  text-align: center;
  pointer-events: none;
  animation: masthead-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both;
}
.masthead .eyebrow {
  color: #fff;
  text-shadow: 0 2px 12px rgba(94, 67, 75, 0.5);
}
.masthead .tag {
  margin-top: 0.3rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1rem, 3vw, 1.4rem);
  color: #fff;
  text-shadow: 0 4px 18px rgba(94, 67, 75, 0.5);
}
@keyframes masthead-in {
  from {
    opacity: 0;
    transform: translate(-50%, 22px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.landing-controls {
  position: fixed;
  top: calc(0.9rem + env(safe-area-inset-top, 0px));
  right: calc(0.9rem + env(safe-area-inset-right, 0px));
  z-index: 30;
}

.grain {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(28px) skewX(-9deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) skewX(-9deg);
  }
}

:focus-visible {
  outline-offset: -8px;
}

/* --- mobile: stack top / bottom -------------------------- */
@media (max-width: 640px) {
  .landing {
    flex-direction: column;
  }
  .half {
    transform: skewY(-7deg);
    animation-name: rise-in-v;
  }
  .half.partner {
    margin: -10vh 0 0;
  }
  .half.ff {
    margin: 0 0 -10vh;
  }
  .content {
    transform: skewY(7deg);
  }
  .half:hover .content {
    transform: skewY(7deg) translateY(-6px);
  }
  .seam {
    top: 50%;
    left: -10%;
    width: 120%;
    height: 2px;
    transform: translateY(-50%) skewY(-7deg);
    animation: none;
  }
  @keyframes rise-in-v {
    from {
      opacity: 0;
      transform: translateY(28px) skewY(-7deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) skewY(-7deg);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .half,
  .half::before,
  .masthead,
  .seam {
    animation: none;
  }
  .half::before {
    translate: none;
  }
  .landing:hover .half,
  .landing:hover .half:hover {
    flex-grow: 1;
  }
  .content,
  .half:hover .content,
  .go,
  .half:hover .go {
    transition: none;
  }
}
</style>
