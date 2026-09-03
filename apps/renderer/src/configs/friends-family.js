// The friends-&-family cut of the trip page (see @trip/shared normalizeConfig).
// Served at "/friends-family".
//
// Same trip as partner.js, but the story ends the night Juanjo gets back to
// Buga — Guayaquil is Nicolle's alone. Plain travel-log framing: no ♥ on the
// boarding pass, no note, a neutral footer (all off by leaving the config
// defaults alone — an empty note body hides the section).

import { legs } from "./itinerary.js";

/** @type {import('@trip/shared/lib/normalizeConfig.js').PageConfig} */
export default {
  meta: {
    slug: "friends-family",
    locale: "es",
    occasion: "friends",
    status: "published",
    plan: "paid",
  },
  theme: {
    preset: "paper",
    accent: "#2F6BE0",
    fontPair: "bricolage-nunito",
    heroStyle: "boardingPass",
    motion: true,
  },
  people: {
    away: [{ name: "Juanjo" }],
    home: [{ name: { en: "home", es: "casa" } }],
    whoIsAway: "away",
    relationship: "friends-family",
  },
  hero: {
    title: { en: "The long way\nhome", es: "Ubicación\nde JJ" },
    subtitle: {
      en: "Where Juanjo is right now, and exactly how long until he's back home in Buga.",
      es: "Dónde está Juanjo y exactamente cuánto falta para su viaje.",
    },
  },
  target: {
    at: "2026-10-03T22:00:00-05:00",
    tz: "America/Bogota",
    placeName: "Buga",
    gate: "CLO",
    passCode: "JJ · 10—03",
    countFrom: "2026-10-03",
    coords: [3.9, -76.3],
    onZero: {
      body: {
        en: "the trip was pointed here the whole time",
        es: "el viaje apuntaba aquí desde el principio",
      },
      confetti: true,
    },
  },
  entries: legs.map((e) => {
    if (e.id !== "buga") return e;
    const { dateEnd, ...rest } = e;
    return {
      ...rest,
      kind: "reunion",
      body: {
        en: "Home ground, back for Halloween. The whole trip was pointed here.",
        es: "Terreno conocido, de vuelta para Halloween. Todo el viaje apuntaba aquí.",
      },
    };
  }),
  stats: {
    show: ["distance", "stopsLeft", "percent"],
    distanceLabel: { en: "km away", es: "km de distancia" },
  },
  share: { ogAuto: true },
  branding: { showFooter: true },
};
