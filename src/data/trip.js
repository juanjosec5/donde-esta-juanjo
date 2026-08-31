// ─────────────────────────────────────────────────────────────────────────────
//  EDIT THIS FILE ONLY.  Push to GitHub and Vercel redeploys automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const people = {
  traveler: "Juan",
  // Shown as "flying to ___" and in the "Juan → ___" line.
  home: "Nicolle",
};

// The exact moment you're back together.
// Guayaquil is UTC−5 all year (no daylight saving), so keep the -05:00 offset.
export const reunion = {
  iso: "2026-10-31T20:00:00-05:00",
  city: "Guayaquil",
  coords: [-2.19, -79.89],
  label: "the arrivals gate in Guayaquil",
  dateLabel: "31 October 2026",
};

// Opens when the card at the bottom is tapped. Line breaks are kept.
export const note = `Ya alistándome para Halloween en Guayaquil 💛`;

// Each stop. type: "stay" (default) | "hop" (a travel day) | "reunion" (the last one).
//   coords: [latitude, longitude]  — used for the "___ km apart today" line.
//   map:    { x, y }  — 0..1 position on the route diagram (already tuned).
//   mapPin: false      — hide this stop's pin on the map (route still passes through).
//   mapLabel / labelPos — override the pin label / its side ("top"|"bottom"|"left"|"right").
export const segments = [
  {
    start: "2026-08-29", end: "2026-09-03",
    city: "Tampa", country: "United States", emoji: "🌴",
    coords: [27.95, -82.46], map: { x: 0.135, y: 0.5 }, labelPos: "bottom",
    blurb: "Where it starts. Warm nights, half-packed bags, last-minute everything.",
  },
  {
    start: "2026-09-04", end: "2026-09-04", type: "hop",
    city: "Over the Atlantic", country: "TPA → ARN", emoji: "✈️",
    coords: [48, -32], map: { x: 0.5, y: 0.31 },
    blurb: "An ocean in one sitting.",
  },
  {
    start: "2026-09-04", end: "2026-09-09",
    city: "Stockholm", country: "Sweden", emoji: "🛶",
    coords: [59.33, 18.07], map: { x: 0.869, y: 0.16 }, labelPos: "bottom",
    blurb: "Islands, cold clean water, cinnamon buns as the light goes at 3pm.",
  },
  {
    start: "2026-09-09", end: "2026-09-09",
    city: "Zürich", country: "Switzerland", emoji: "🚋",
    coords: [47.37, 8.54], map: { x: 0.8, y: 0.29 },
    mapLabel: "Switzerland", labelPos: "left",
    blurb: "Land, find the platform, take the train south into the mountains.",
  },
  {
    start: "2026-09-10", end: "2026-09-11",
    city: "Interlaken", country: "Switzerland", emoji: "🏔️",
    coords: [46.69, 7.86], map: { x: 0.792, y: 0.302 }, mapPin: false,
    blurb: "Two lakes, one valley, and a lot of time spent looking up.",
  },
  {
    start: "2026-09-12", end: "2026-09-12",
    city: "Lucerne", country: "Switzerland", emoji: "🌉",
    coords: [47.05, 8.31], map: { x: 0.806, y: 0.293 }, mapPin: false,
    blurb: "Wooden bridge, painted rafters, slow green water.",
  },
  {
    start: "2026-09-13", end: "2026-09-17",
    city: "Barcelona", country: "Spain", emoji: "🥘",
    coords: [41.39, 2.16], map: { x: 0.753, y: 0.357 }, labelPos: "left",
    blurb: "Back to the sea, and a language I think in without trying.",
  },
  {
    start: "2026-09-18", end: "2026-09-22",
    city: "Menorca", country: "Spain", emoji: "🐚",
    coords: [39.89, 4.26], map: { x: 0.773, y: 0.376 }, labelPos: "right",
    blurb: "Coves the colour of a swimming pool. Nothing to do, on purpose.",
  },
  {
    start: "2026-09-22", end: "2026-09-26",
    city: "Madrid", country: "Spain", emoji: "🎨",
    coords: [40.42, -3.7], map: { x: 0.706, y: 0.372 }, labelPos: "bottom",
    blurb: "City heat, dinner at eleven, one more room full of paintings.",
  },
  {
    start: "2026-09-26", end: "2026-10-03",
    city: "Tampa", country: "United States", emoji: "🌴",
    coords: [27.95, -82.46], map: { x: 0.135, y: 0.5 }, labelPos: "top",
    mapLabel: "Tampa again",
    blurb: "Same porch, same heat. Halfway home now.",
  },
  {
    start: "2026-10-03", end: "2026-10-04", type: "hop",
    city: "Overnight to Cali", country: "TPA → CLO", emoji: "🌙",
    coords: [12, -78], map: { x: 0.17, y: 0.64 },
    blurb: "A red-eye, then sunrise over the Cauca valley.",
  },
  {
    start: "2026-10-04", end: "2026-10-31",
    city: "Buga", country: "Colombia", emoji: "⛪",
    coords: [3.9, -76.3], map: { x: 0.18, y: 0.77 }, labelPos: "right",
    blurb: "Home ground. This is where the counting gets serious.",
  },
  {
    start: "2026-10-31", end: "2026-10-31", type: "reunion",
    city: "Guayaquil", country: "Ecuador", emoji: "💛",
    coords: [-2.19, -79.89], map: { x: 0.152, y: 0.84 }, labelPos: "bottom",
    blurb: "Nicolle, at the gate. The whole trip was pointed here.",
  },
];
