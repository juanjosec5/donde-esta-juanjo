// Components — render surface
export { default as PageHost } from "./components/PageHost.vue";
export { default as PageView } from "./components/PageView.vue";
export { default as AmbientSky } from "./components/AmbientSky.vue";
export { default as BoardingPass } from "./components/BoardingPass.vue";
export { default as DayTimeline } from "./components/DayTimeline.vue";
export { default as JumpToday } from "./components/JumpToday.vue";
export { default as LoveNote } from "./components/LoveNote.vue";
export { default as SiteFooter } from "./components/SiteFooter.vue";
export { default as ThemeToggle } from "./components/ThemeToggle.vue";
export { default as LangToggle } from "./components/LangToggle.vue";
export { default as PageControls } from "./components/PageControls.vue";

// Composables
export { useNow } from "./composables/useNow.js";
export { useCountdown } from "./composables/useCountdown.js";
export { useTripState } from "./composables/useTripState.js";
export { useToTodayDirection } from "./composables/useToTodayDirection.js";
export { useMono } from "./composables/useMono.js";
export { useLocale } from "./composables/useLocale.js";
export { usePageTheme } from "./composables/usePageTheme.js";

// Lib
export { PAGE, NOW } from "./lib/keys.js";
export { reveal } from "./lib/reveal.js";
export { normalizeConfig } from "./lib/normalizeConfig.js";
export { toRenderModel } from "./lib/toRenderModel.js";
export { PALETTES } from "./lib/palettes.js";
export { MESSAGES, pickLang } from "./lib/i18n.js";
export * from "./lib/format.js";
export * from "./lib/geo.js";
export { scrollToToday } from "./lib/scrollToToday.js";
