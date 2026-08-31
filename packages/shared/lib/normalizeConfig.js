/**
 * @typedef {Object} PageConfig  the stored / builder-facing shape (v1)
 * @property {{slug:string, locale:"es"|"en", occasion:"romantic"|"family"|"friends"|"homecoming", status:"draft"|"published"|"expired", plan:"free"|"paid"}} meta
 * @property {{preset:string, accent:string, fontPair:string, heroStyle:string, motion:boolean}} theme
 * @property {{away:{name:string,emoji?:string}[], home:{name:string,emoji?:string}[], whoIsAway:"away"|"home", relationship?:string}} people
 * @property {{title:string, subtitle:string, photo?:string}} hero
 * @property {{at:string, tz:string, placeName:string, label:string, dateLabel:string, coords?:[number,number], onZero:{title:string,body:string,confetti:boolean}}} target
 * @property {Entry[]} entries
 * @property {{body:string, signature?:string, lockUntilZero?:boolean}} note
 * @property {{show:("distance"|"stopsLeft"|"percent")[]}} stats
 * @property {{ogAuto:boolean, password?:string}} share
 * @property {{showFooter:boolean}} branding
 *
 * @typedef {Object} Entry
 * @property {string} id
 * @property {string} dateStart          ISO date (YYYY-MM-DD)
 * @property {string} [dateEnd]          defaults to dateStart
 * @property {string} title
 * @property {string} [subtitle]
 * @property {string} [icon]
 * @property {string} [body]
 * @property {"stay"|"travel"|"milestone"|"reunion"} [kind]
 * @property {boolean} [highlight]
 * @property {[number,number]} [coords]
 * @property {string} [photo]
 */

const DEFAULT_THEME = {
  preset: "sunset",
  accent: "#FF9E9E",
  fontPair: "bricolage-nunito",
  heroStyle: "boardingPass",
  motion: true,
};

/** Fill every optional field so downstream code never guards for undefined. */
export function normalizeConfig(input = {}) {
  const meta = {
    slug: "",
    locale: "en",
    occasion: "romantic",
    status: "draft",
    plan: "free",
    ...input.meta,
  };

  const people = {
    away: [{ name: "" }],
    home: [{ name: "" }],
    whoIsAway: "away",
    relationship: undefined,
    ...input.people,
  };

  const target = {
    at: "",
    tz: "UTC",
    placeName: "",
    label: "",
    dateLabel: "",
    coords: undefined,
    ...input.target,
    onZero: {
      title: "home",
      body: "",
      confetti: true,
      ...(input.target?.onZero ?? {}),
    },
  };

  const entries = (input.entries ?? []).map((e, i) => ({
    id: e.id ?? `entry-${i}`,
    dateEnd: e.dateStart,
    kind: "stay",
    highlight: false,
    ...e,
  }));

  return {
    meta,
    theme: { ...DEFAULT_THEME, ...input.theme },
    people,
    hero: { title: "", subtitle: "", ...input.hero },
    target,
    entries,
    note: { body: "", ...input.note },
    stats: { show: ["distance", "stopsLeft", "percent"], ...input.stats },
    share: { ogAuto: true, ...input.share },
    branding: {
      showFooter: meta.plan !== "paid",
      ...input.branding,
    },
  };
}
