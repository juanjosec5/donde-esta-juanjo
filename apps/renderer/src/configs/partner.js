// The partner page, expressed as a PageConfig (see @trip/shared normalizeConfig).
// Served at "/partner". This is the seed / reference page.
//
// The romantic framing (♥ on the boarding pass, the "note for Nicolle" flap,
// floating hearts, the footer credit) now lives in config so the
// friends-&-family page can turn it off — this file opts back in explicitly.

import { legs } from "./itinerary.js";

/** @type {import('@trip/shared/lib/normalizeConfig.js').PageConfig} */
export default {
  meta: {
    slug: "juanjo",
    locale: "en",
    occasion: "romantic",
    status: "published",
    plan: "paid",
  },
  theme: {
    preset: "sunset",
    accent: "#FF9E9E",
    fontPair: "bricolage-nunito",
    heroStyle: "boardingPass",
    motion: true,
  },
  people: {
    away: [{ name: "Juanjo" }],
    home: [{ name: "Nicolle" }],
    whoIsAway: "away",
    relationship: "partner",
  },
  hero: {
    title: "Dónde está\nJuanjo",
    subtitle:
      "Where he is right now, and exactly how long until he walks through the arrivals gate in Guayaquil.",
  },
  target: {
    at: "2026-10-31T20:00:00-05:00",
    tz: "America/Guayaquil",
    placeName: "Guayaquil",
    label: "the arrivals gate in Guayaquil",
    dateLabel: "31 October 2026",
    gate: "GYE",
    passCode: "JJ · 10—31",
    countFrom: "2026-10-03",
    coords: [-2.19, -79.89],
    onZero: {
      title: "home",
      body: "the trip was pointed here the whole time",
      confetti: true,
    },
  },
  entries: [
    ...legs,
    {
      id: "guayaquil",
      dateStart: "2026-10-31",
      title: "Guayaquil",
      subtitle: "Ecuador",
      icon: "💛",
      kind: "reunion",
      coords: [-2.19, -79.89],
      body: "Nicolle, at the gate. The whole trip was pointed here.",
    },
  ],
  note: {
    body: "Ya alistándome para Halloween en Guayaquil 💛",
    label: "a note for Nicolle",
    openLabel: "close the note",
    hearts: true,
  },
  stats: {
    show: ["distance", "stopsLeft", "percent"],
  },
  share: { ogAuto: true },
  branding: {
    showFooter: true,
    heart: true,
    credit: "made with a lot of missing Nicolle",
  },
};
