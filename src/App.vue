<script setup>
import { computed, provide } from "vue";
import { useNow } from "./composables/useNow";
import { useTripState } from "./composables/useTripState";
import { segments, reunion, people } from "./data/trip";
import { haversineKm, groupThousands } from "./lib/geo";

import AmbientSky from "./components/AmbientSky.vue";
import BoardingPass from "./components/BoardingPass.vue";
import RouteMap from "./components/RouteMap.vue";
import DayTimeline from "./components/DayTimeline.vue";
import LoveNote from "./components/LoveNote.vue";
import SiteFooter from "./components/SiteFooter.vue";

provide(Symbol.for("trip.now"), useNow());

const { currentSegment, currentIndex, progress } = useTripState();

const kmApart = computed(() =>
  groupThousands(haversineKm(currentSegment.value.coords, reunion.coords)),
);
const stopsLeft = computed(() =>
  Math.max(segments.length - 1 - Math.max(currentIndex.value, 0), 0),
);
const pct = computed(() => Math.round(progress.value * 100));
</script>

<template>
  <AmbientSky />

  <main>
    <header class="hero">
      <p class="eyebrow" v-reveal>{{ people.traveler }} → {{ people.home }}</p>
      <h1 v-reveal="{ delay: 80 }">The long way<br />back to you</h1>
      <p class="lede" v-reveal="{ delay: 160 }">
        Where he is right now, and exactly how long until he walks through
        {{ reunion.label }}.
      </p>

      <div class="pass-wrap" v-reveal="{ delay: 240 }">
        <BoardingPass />
      </div>

      <ul class="stats" v-reveal>
        <li><b>{{ kmApart }}</b><span>km apart today</span></li>
        <li><b>{{ stopsLeft }}</b><span>stops to go</span></li>
        <li><b>{{ pct }}%</b><span>of the way there</span></li>
      </ul>
    </header>

    <section class="block">
      <div class="block-head" v-reveal>
        <p class="eyebrow">The route</p>
        <h2>Two oceans, one direction</h2>
        <p class="sub">
          The paper plane is where he is today. The bright line is road already
          behind him.
        </p>
      </div>
      <RouteMap />
    </section>

    <section class="block">
      <div class="block-head" v-reveal>
        <p class="eyebrow">Day by day</p>
        <h2>Every stop between here and there</h2>
        <p class="sub">The glowing dot is today. Everything below it hasn't happened yet.</p>
      </div>
      <DayTimeline />
    </section>

    <section class="block tight">
      <LoveNote />
    </section>

    <SiteFooter />
  </main>
</template>

<style scoped>
main {
  width: var(--page);
  margin: 0 auto;
  padding-top: clamp(3rem, 10vw, 6rem);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.1rem;
}
h1 {
  font-size: clamp(2.9rem, 11vw, 6rem);
  font-weight: 800;
}
.lede {
  max-width: 34ch;
  color: var(--ink-soft);
  font-size: 1.05rem;
}

.pass-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: clamp(1.5rem, 6vw, 3rem) 0 0.5rem;
}

.stats {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem 1.6rem;
}
.stats li {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stats b {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--ink);
}
.stats span {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.block {
  margin-top: clamp(4.5rem, 14vw, 9rem);
}
.block.tight {
  margin-top: clamp(3.5rem, 10vw, 6rem);
}
.block-head {
  text-align: center;
  max-width: 40ch;
  margin: 0 auto clamp(2rem, 6vw, 3.5rem);
}
.block-head h2 {
  font-size: clamp(1.8rem, 6vw, 2.9rem);
  margin: 0.5rem 0 0.6rem;
}
.block-head .sub {
  color: var(--ink-soft);
}
</style>
