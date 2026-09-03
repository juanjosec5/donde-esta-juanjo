import {
  ref,
  computed,
  watch,
  effectScope,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { PALETTES } from "../lib/palettes.js";
import { useMono } from "./useMono.js";

/*
 * App-global theme controller. Exactly one page is mounted at a time in the
 * renderer, so a single owner writes the palette tokens onto <html> — this
 * avoids two PageHosts (old + new, briefly overlapping during a route change)
 * fighting over the same inline styles, which mattered once the mono toggle
 * meant both instances wanted a non-null palette.
 */
const activePreset = ref("sunset");
const { mono } = useMono();

const activeVars = computed(() =>
  mono.value ? PALETTES.mono : PALETTES[activePreset.value] ?? null,
);

let started = false;
function start() {
  if (started || typeof document === "undefined") return;
  started = true;
  // detached scope: this watcher lives for the whole session, not one component
  effectScope(true).run(() => {
    let applied = null;
    watch(
      activeVars,
      (vars) => {
        const el = document.documentElement;
        if (applied) for (const k of Object.keys(applied)) el.style.removeProperty(k);
        if (vars) for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
        applied = vars;
      },
      { immediate: true },
    );
  });
}

/** Call from a page component's setup: declares which preset this page wants. */
export function usePageTheme(preset) {
  start();
  const want = preset || "sunset";
  onMounted(() => {
    activePreset.value = want;
  });
  onBeforeUnmount(() => {
    // only reset if we're still the active one (route transitions can mount the
    // next page before this one unmounts, or after — this converges either way)
    if (activePreset.value === want) activePreset.value = "sunset";
  });
}
