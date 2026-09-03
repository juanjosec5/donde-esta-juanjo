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
    locale: "es",
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
    title: {
      en: "The long way\nback to Nicolle",
      es: "Dónde está\nJuanjo",
    },
    subtitle: {
      en: "Where he is right now, and exactly how long until he walks through the arrivals gate in Guayaquil.",
      es: "Dónde está ahora mismo, y exactamente cuánto falta para que cruce la puerta de llegadas en Guayaquil.",
    },
  },
  target: {
    at: "2026-10-31T20:00:00-05:00",
    tz: "America/Guayaquil",
    placeName: "Guayaquil",
    label: {
      en: "the arrivals gate in Guayaquil",
      es: "la puerta de llegadas en Guayaquil",
    },
    gate: "GYE",
    passCode: "JJ · 10—31",
    countFrom: "2026-10-03",
    coords: [-2.19, -79.89],
    onZero: {
      body: {
        en: "the trip was pointed here the whole time",
        es: "el viaje apuntaba aquí desde el principio",
      },
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
      body: {
        en: "Nicolle, at the gate. The whole trip was pointed here.",
        es: "Nicolle, en la puerta. Todo el viaje apuntaba aquí.",
      },
    },
  ],
  note: {
    body: {
      en: "Getting ready for Halloween in Guayaquil 💛",
      es: "Ya alistándome para Halloween en Guayaquil 💛",
    },
    label: { en: "a note for Nicolle", es: "una nota para Nicolle" },
    hearts: true,
  },
  stats: {
    show: ["distance", "stopsLeft", "percent"],
  },
  share: { ogAuto: true },
  branding: {
    showFooter: true,
    heart: true,
    credit: {
      en: "made with a lot of missing Nicolle",
      es: "hecho extrañando mucho a Nicolle",
    },
  },
};
