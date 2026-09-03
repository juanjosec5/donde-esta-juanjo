import { normalizeConfig } from "./normalizeConfig.js";
import { pickLang } from "./i18n.js";
import { formatLongDate } from "./format.js";

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
 *
 * `locale` resolves every prose field that was authored as `{ en, es }`;
 * `meta.locale` is the per-page fallback when the active locale is missing.
 */
export function toRenderModel(input, locale = "es") {
  const c = normalizeConfig(input);
  const L = (v) => pickLang(v, locale, c.meta.locale || "en");
  const names = (list) =>
    list.map((p) => L(p.name)).filter(Boolean).join(" & ");

  return {
    meta: c.meta,
    theme: c.theme,
    branding: { ...c.branding, credit: L(c.branding.credit) },
    stats: { ...c.stats, distanceLabel: L(c.stats.distanceLabel) },
    onZero: {
      ...c.target.onZero,
      title: L(c.target.onZero.title),
      body: L(c.target.onZero.body),
    },

    people: {
      traveler: names(c.people.away),
      home: names(c.people.home),
    },

    reunion: {
      iso: c.target.at,
      city: c.target.placeName,
      coords: c.target.coords,
      label: L(c.target.label),
      dateLabel: c.target.dateLabel
        ? L(c.target.dateLabel)
        : c.target.at
          ? formatLongDate(c.target.at, locale)
          : "",
      gate: c.target.gate,
      passCode: c.target.passCode,
      countFrom: c.target.countFrom,
    },

    hero: {
      title: L(c.hero.title),
      subtitle: L(c.hero.subtitle),
    },

    note: {
      body: L(c.note.body),
      label: L(c.note.label),
      openLabel: L(c.note.openLabel),
      hint: L(c.note.hint),
      hearts: c.note.hearts,
    },

    segments: c.entries.map((e) => ({
      start: e.dateStart,
      end: e.dateEnd ?? e.dateStart,
      city: L(e.title),
      country: L(e.subtitle) ?? "",
      emoji: e.icon ?? "",
      blurb: L(e.body) ?? "",
      coords: e.coords,
      type: KIND_TO_TYPE[e.kind],
    })),
  };
}
