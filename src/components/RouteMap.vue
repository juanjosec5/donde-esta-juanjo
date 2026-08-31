<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { segments } from "../data/trip";
import { useTripState } from "../composables/useTripState";

const { progress, currentIndex } = useTripState();

const W = 1000;
const H = 620;

const pts = segments.map((s, i) => ({
  x: +(s.map.x * W).toFixed(1),
  y: +(s.map.y * H).toFixed(1),
  seg: s,
  i,
}));

// Catmull-Rom → cubic bezier, for a route that curves like a flight path.
function smoothPath(p) {
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}
const routeD = smoothPath(pts);

const pins = pts.filter((p) => p.seg.type !== "hop" && p.seg.mapPin !== false);

function labelAttrs(seg) {
  switch (seg.labelPos) {
    case "bottom": return { dx: 0, dy: 34, anchor: "middle" };
    case "left":   return { dx: -16, dy: 5, anchor: "end" };
    case "right":  return { dx: 16, dy: 5, anchor: "start" };
    default:       return { dx: 0, dy: -20, anchor: "middle" };
  }
}

// --- the plane rides the drawn route ---------------------------------------
const fullPath = ref(null);
const len = ref(0);
const plane = ref({ x: pts[0].x, y: pts[0].y, a: 0 });

function updatePlane() {
  const el = fullPath.value;
  if (!el || !len.value) return;
  const t = Math.min(Math.max(progress.value, 0.001), 0.999);
  const at = el.getPointAtLength(t * len.value);
  const ahead = el.getPointAtLength(Math.min(t * len.value + 1.5, len.value));
  plane.value = {
    x: at.x,
    y: at.y,
    a: (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI,
  };
}

onMounted(() => {
  len.value = fullPath.value.getTotalLength();
  updatePlane();
  window.addEventListener("resize", updatePlane);
});
onUnmounted(() => window.removeEventListener("resize", updatePlane));
watch([len, progress], updatePlane);

const traveled = computed(() => len.value * (1 - Math.min(progress.value, 1)));
</script>

<template>
  <div class="map" v-reveal>
    <svg :viewBox="`0 0 ${W} ${H}`" role="img"
         aria-label="A route diagram from Tampa across Sweden, Switzerland and Spain, back to Tampa, then down to Colombia and Guayaquil.">
      <g class="land" aria-hidden="true">
        <path d="M60 120 q90 -60 210 -30 q120 30 90 150 q-40 150 -190 130 q-150 -20 -160 -140 q-8 -70 50 -110Z" />
        <path d="M690 120 q120 -40 250 20 q60 90 -30 160 q-130 70 -240 20 q-70 -110 20 -220Z" />
        <path d="M90 470 q80 -40 150 10 q60 90 10 210 q-70 120 -170 60 q-70 -140 -30 -260 q10 -20 30 -30Z" />
      </g>

      <path
        ref="fullPath"
        class="route-full"
        :d="routeD"
        :style="{ '--len': len }"
      />
      <path
        class="route-done"
        :d="routeD"
        :style="{ strokeDasharray: len, strokeDashoffset: traveled }"
      />

      <g
        v-for="p in pins"
        :key="p.i"
        class="pin"
        :class="{
          past: p.i < currentIndex,
          current: p.i === currentIndex,
          reunion: p.seg.type === 'reunion',
        }"
        :transform="`translate(${p.x} ${p.y})`"
      >
        <circle v-if="p.i === currentIndex" class="halo" r="15" />
        <circle class="dot" r="6.5" />
        <text
          class="pin-label"
          :x="labelAttrs(p.seg).dx"
          :y="labelAttrs(p.seg).dy"
          :text-anchor="labelAttrs(p.seg).anchor"
        >{{ p.seg.mapLabel || p.seg.city }}</text>
      </g>

      <g
        class="plane"
        :transform="`translate(${plane.x} ${plane.y}) rotate(${plane.a})`"
      >
        <g class="plane-bob">
          <path
            d="M-13 -9 L15 0 L-13 9 L-7 0 Z"
            fill="var(--ink)"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.map {
  width: 100%;
}
svg {
  width: 100%;
  height: auto;
  overflow: visible;
  display: block;
}

.land path {
  fill: var(--peach);
  opacity: 0.16;
}

.route-full {
  fill: none;
  stroke: var(--edge);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  opacity: 0;
  transition:
    stroke-dashoffset 1.8s ease 0.15s,
    opacity 0.01s linear 0.15s;
}
.map.is-in .route-full {
  stroke-dashoffset: 0;
  opacity: 1;
}

.route-done {
  fill: none;
  stroke: var(--coral);
  stroke-width: 4;
  stroke-linecap: round;
  opacity: 0;
  transition:
    stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 1.6s,
    opacity 0.4s ease 1.6s;
}
.map.is-in .route-done {
  opacity: 1;
}

.pin .dot {
  fill: var(--shell);
  stroke: var(--ink-soft);
  stroke-width: 2.5;
}
.pin.past .dot {
  fill: var(--coral);
  stroke: var(--coral);
}
.pin.current .dot {
  fill: var(--mint);
  stroke: var(--mint);
}
.pin.reunion .dot {
  fill: var(--gold);
  stroke: var(--gold);
  r: 8;
}

.halo {
  fill: var(--mint);
  opacity: 0.3;
  transform-origin: center;
  animation: pulse 2.4s ease-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.45; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { opacity: 0; }
}

.pin-label {
  font-family: var(--font-mono);
  font-size: 20px;
  fill: var(--ink-soft);
}
.pin.current .pin-label,
.pin.reunion .pin-label {
  fill: var(--ink);
  font-weight: 500;
}

.plane {
  transition: transform 1s linear;
}
.plane-bob {
  animation: bob 3.4s ease-in-out infinite;
}
@keyframes bob {
  50% { transform: translateY(-5px); }
}

@media (prefers-reduced-motion: reduce) {
  .route-full,
  .route-done {
    transition: none;
    stroke-dashoffset: 0;
  }
  .route-done { opacity: 1; }
  .halo,
  .plane-bob,
  .plane {
    animation: none;
    transition: none;
  }
}
</style>
