/**
 * UI-chrome strings, keyed, one map per locale. Values are strings, or
 * functions when they need a count or interpolation. Resolved at render time
 * via `useLocale().t(key, ...args)` so a language switch is reactive.
 *
 * Trip *content* (hero lines, stop blurbs, notes) does NOT live here — it's
 * carried in the PageConfig as `string | { en, es }` and resolved by
 * `pickLang` inside toRenderModel.
 */
export const MESSAGES = {
  es: {
    "stat.stopsLeft": "paradas restantes",
    "stat.percent": "del camino",

    "hero.jumpCta": "Ver dónde está ahora",

    "timeline.heading": "Paradas del viaje",
    "timeline.dayTrip": "excursión",
    "timeline.nights": (n) => (n === 1 ? "1 noche" : `${n} noches`),
    "timeline.current": "aquí está ahora",
    "timeline.finish": "la meta",

    "jump.pill": "dónde está ahora",

    "bp.title": "Tarjeta de embarque",
    "bp.passenger": "Pasajero",
    "bp.flyingTo": "Vuela a",
    "bp.rightNow": "Ahora mismo",
    "bp.gate": "Puerta",
    "bp.homeIn": "En casa en",
    "bp.days": (n) => (n === 1 ? "día" : "días"),
    "bp.arrivals": (dateLabel) => `llegadas, ${dateLabel}`,
    "bp.status": "Estado",
    "bp.home": "en casa",
    "bp.pointedHere": "el viaje apuntaba aquí desde el principio",

    "footer.countdown": (days, hours, label) =>
      `${days} ${days === 1 ? "día" : "días"}, ${hours} ${
        hours === 1 ? "hora" : "horas"
      } para ${label}.`,
    "footer.together": (city) => `Juntos en ${city}. Esa es toda la historia.`,

    "landing.for": "para",
    "landing.partner": "Pareja",
    "landing.ff": "Amigos y familia",
    "landing.enter": "entrar",
    "landing.tag": "El largo camino a casa",

    "notfound.title": "Aquí no hay nada",
    "notfound.body": "Revisa el enlace, o vuelve a la portada.",

    "slug.loading": "Cargando…",
    "slug.notFoundTitle": "Todavía no hay nada aquí",
    "slug.notFoundBody": "Esta página no está publicada, o el enlace es incorrecto.",
    "slug.errorTitle": "Algo salió mal",
    "slug.errorBody": "Inténtalo de nuevo en un momento.",

    "toggle.bw": "Blanco y negro",
    "toggle.colour": "Volver al color",
    "toggle.switchLang": "Cambiar a inglés",
  },

  en: {
    "stat.stopsLeft": "stops to go",
    "stat.percent": "of the way there",

    "hero.jumpCta": "See where he is right now",

    "timeline.heading": "Trip stops",
    "timeline.dayTrip": "day trip",
    "timeline.nights": (n) => (n === 1 ? "1 night" : `${n} nights`),
    "timeline.current": "where he is right now",
    "timeline.finish": "the finish line",

    "jump.pill": "where he is now",

    "bp.title": "Boarding pass",
    "bp.passenger": "Passenger",
    "bp.flyingTo": "Flying to",
    "bp.rightNow": "Right now",
    "bp.gate": "Gate",
    "bp.homeIn": "Home in",
    "bp.days": (n) => (n === 1 ? "day" : "days"),
    "bp.arrivals": (dateLabel) => `arrivals, ${dateLabel}`,
    "bp.status": "Status",
    "bp.home": "home",
    "bp.pointedHere": "the trip was pointed here the whole time",

    "footer.countdown": (days, hours, label) =>
      `${days} ${days === 1 ? "day" : "days"}, ${hours} ${
        hours === 1 ? "hour" : "hours"
      } to ${label}.`,
    "footer.together": (city) => `Together in ${city}. That's the whole story.`,

    "landing.for": "for",
    "landing.partner": "Partner",
    "landing.ff": "Friends & family",
    "landing.enter": "enter",
    "landing.tag": "The long way back home",

    "notfound.title": "Nothing here",
    "notfound.body": "Check the link, or head to the front page.",

    "slug.loading": "Loading…",
    "slug.notFoundTitle": "Nothing here yet",
    "slug.notFoundBody": "This page isn't published, or the link is wrong.",
    "slug.errorTitle": "Something went wrong",
    "slug.errorBody": "Try again in a moment.",

    "toggle.bw": "Black and white",
    "toggle.colour": "Back to colour",
    "toggle.switchLang": "Switch to Spanish",
  },
};

/**
 * Resolve a content value that may be localized.
 * @param {string|number|null|{en?:string,es?:string}} val
 */
export function pickLang(val, locale, fallback = "en") {
  if (val == null || typeof val === "string" || typeof val === "number") {
    return val;
  }
  return val[locale] ?? val[fallback] ?? val.es ?? val.en ?? "";
}
