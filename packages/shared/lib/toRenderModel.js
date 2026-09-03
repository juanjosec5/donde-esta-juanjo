import { normalizeConfig } from "./normalizeConfig.js";

const KIND_TO_TYPE = {
  travel: "hop",
  reunion: "reunion",
  milestone: "milestone",
  stay: undefined,
};

/**
 * Convert a PageConfig into the flat shape the render components consume.
 * This is the internal contract between the schema and the Vue components — the
 * components were written against `people` / `reunion` / `segments`, and this
 * keeps that stable while the stored schema can evolve.
 */
export function toRenderModel(input) {
  const c = normalizeConfig(input);
  const names = (list) => list.map((p) => p.name).filter(Boolean).join(" & ");

  return {
    meta: c.meta,
    theme: c.theme,
    branding: c.branding,
    stats: c.stats,
    onZero: c.target.onZero,

    people: {
      traveler: names(c.people.away),
      home: names(c.people.home),
    },

    reunion: {
      iso: c.target.at,
      city: c.target.placeName,
      coords: c.target.coords,
      label: c.target.label,
      dateLabel: c.target.dateLabel,
      gate: c.target.gate,
      passCode: c.target.passCode,
      countFrom: c.target.countFrom,
    },

    hero: {
      title: c.hero.title,
      subtitle: c.hero.subtitle,
    },

    note: {
      body: c.note.body,
      label: c.note.label,
      openLabel: c.note.openLabel,
      hint: c.note.hint,
      hearts: c.note.hearts,
    },

    segments: c.entries.map((e) => ({
      start: e.dateStart,
      end: e.dateEnd ?? e.dateStart,
      city: e.title,
      country: e.subtitle ?? "",
      emoji: e.icon ?? "",
      blurb: e.body ?? "",
      coords: e.coords,
      type: KIND_TO_TYPE[e.kind],
    })),
  };
}
