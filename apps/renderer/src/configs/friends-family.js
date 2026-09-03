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
    locale: "en",
    occasion: "friends",
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
    home: [{ name: "home" }],
    whoIsAway: "away",
    relationship: "friends-family",
  },
  hero: {
    title: "Ubicación\nde JJ",
    subtitle:
      "Where Juanjo is right now, and exactly how long until he's back home in Buga.",
  },
  target: {
    at: "2026-10-03T22:00:00-05:00",
    tz: "America/Bogota",
    placeName: "Buga",
    label: "home ground in Buga",
    dateLabel: "3 October 2026",
    gate: "CLO",
    passCode: "JJ · 10—03",
    countFrom: "2026-10-03",
    coords: [3.9, -76.3],
    onZero: {
      title: "home",
      body: "the trip was pointed here the whole time",
      confetti: true,
    },
  },
  entries: legs.map((e) => {
    if (e.id !== "buga") return e;
    const { dateEnd, ...rest } = e;
    return {
      ...rest,
      kind: "reunion",
      body: "Home ground, back for Halloween. The whole trip was pointed here.",
    };
  }),
  stats: {
    show: ["distance", "stopsLeft", "percent"],
    distanceLabel: "km away",
  },
  share: { ogAuto: true },
  branding: { showFooter: true },
};
