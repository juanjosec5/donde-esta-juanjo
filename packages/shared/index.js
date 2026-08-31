// Components — render surface
export { default as PageHost } from "./components/PageHost.vue";
export { default as PageView } from "./components/PageView.vue";
export { default as AmbientSky } from "./components/AmbientSky.vue";
export { default as BoardingPass } from "./components/BoardingPass.vue";
export { default as DayTimeline } from "./components/DayTimeline.vue";
export { default as JumpToday } from "./components/JumpToday.vue";
export { default as LoveNote } from "./components/LoveNote.vue";
export { default as SiteFooter } from "./components/SiteFooter.vue";

// Composables
export { useNow } from "./composables/useNow.js";
export { useCountdown } from "./composables/useCountdown.js";
export { useTripState } from "./composables/useTripState.js";

// Lib
export { PAGE, NOW } from "./lib/keys.js";
export { reveal } from "./lib/reveal.js";
export { normalizeConfig } from "./lib/normalizeConfig.js";
export { toRenderModel } from "./lib/toRenderModel.js";
export * from "./lib/format.js";
export * from "./lib/geo.js";
export { scrollToToday } from "./lib/scrollToToday.js";
