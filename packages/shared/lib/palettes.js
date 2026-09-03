/**
 * Per-page color themes. Each preset is a map of the `:root` design tokens
 * (defined in styles/base.css) to override; PageHost writes them onto
 * document.documentElement (or the embed wrapper) while a page is mounted.
 *
 * `sunset` is null — it means "leave base.css alone", which keeps its
 * `@media (prefers-color-scheme: dark)` block working. The other presets set
 * inline styles, which beat that media query, so they are light-only.
 */
export const PALETTES = {
  sunset: null,

  // Friends & family: warm paper, charcoal ink, a sparing primary trio.
  paper: {
    "--cream": "#F5F0E4",
    "--shell": "#FFFFFF",
    "--peach": "#F4C84B", // yellow
    "--coral": "#E14B47", // red   — rail / countdown / hero button
    "--orchid": "#2F6BE0", // blue  — gradient end / focus ring
    "--sky": "#9BBEF0", // light blue
    "--mint": "#2FA269", // green — "today" marker / current card / badge
    "--gold": "#E7A008", // amber — finish line
    "--ink": "#262320",
    "--ink-soft": "#6C665C",
    "--edge": "rgba(38, 35, 32, 0.14)",
    "--card-shadow": "0 22px 50px -24px rgba(38, 35, 32, 0.22)",
    "color-scheme": "light",
  },

  // Black-and-white test.
  mono: {
    "--cream": "#FBFBFA",
    "--shell": "#FFFFFF",
    "--peach": "#9A9A9A",
    "--coral": "#1B1B1B",
    "--orchid": "#4A4A4A",
    "--sky": "#C6C6C6",
    "--mint": "#7A7A7A", // also a badge background — keep light enough for dark text
    "--gold": "#8C8C8C",
    "--ink": "#111111",
    "--ink-soft": "#6E6E6E",
    "--edge": "rgba(0, 0, 0, 0.16)",
    "--card-shadow": "0 22px 50px -24px rgba(0, 0, 0, 0.3)",
    "color-scheme": "light",
  },
};
