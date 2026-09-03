import { ref, watch } from "vue";
import { MESSAGES } from "../lib/i18n.js";

// App language. One shared ref, remembered per browser. First visit: an
// explicit stored choice wins; else the browser's preferred languages
// (any Spanish → es, any English → en); else Spanish.
const KEY = "trip:locale";
const DEFAULT = "es";

function detect() {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    /* storage blocked */
  }
  try {
    const langs =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    const tags = langs.filter(Boolean).map((l) => l.toLowerCase());
    if (tags.some((l) => l.startsWith("es"))) return "es";
    if (tags.some((l) => l.startsWith("en"))) return "en";
  } catch {
    /* no navigator */
  }
  return DEFAULT;
}

const locale = ref(detect());

watch(
  locale,
  (l) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage blocked — still works for the session */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  },
  { immediate: true },
);

export function useLocale() {
  const t = (key, ...args) => {
    const dict = MESSAGES[locale.value] || MESSAGES.en;
    const v = dict[key] ?? MESSAGES.en[key] ?? key;
    return typeof v === "function" ? v(...args) : v;
  };
  return {
    locale,
    t,
    toggle: () => (locale.value = locale.value === "es" ? "en" : "es"),
  };
}
