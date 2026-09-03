const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};

const MONTHS_LONG = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  es: [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ],
};

const months = (locale) => MONTHS[locale] || MONTHS.en;
const monthsLong = (locale) => MONTHS_LONG[locale] || MONTHS_LONG.en;

export function parseDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "29 Aug" / "29 ago", or a spaced-en-dash range when it spans more than a day.
export function dateRange(startIso, endIso, locale = "es") {
  const s = parseDay(startIso);
  const e = parseDay(endIso);
  const mo = months(locale);
  const fmt = (dt) => `${dt.getDate()} ${mo[dt.getMonth()]}`;
  if (s.getTime() === e.getTime()) return fmt(s);
  return `${fmt(s)} – ${fmt(e)}`;
}

// "31 October 2026" / "31 de octubre de 2026". Accepts a date or datetime ISO.
export function formatLongDate(iso, locale = "es") {
  const d = parseDay(iso.slice(0, 10));
  const name = monthsLong(locale)[d.getMonth()];
  return locale === "es"
    ? `${d.getDate()} de ${name} de ${d.getFullYear()}`
    : `${d.getDate()} ${name} ${d.getFullYear()}`;
}

export function nightCount(startIso, endIso) {
  const ms = parseDay(endIso) - parseDay(startIso);
  return Math.max(Math.round(ms / 86400000), 0);
}

export const pad2 = (n) => String(n).padStart(2, "0");
