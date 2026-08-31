const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function parseDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "29 Aug", or "29 Aug – 3 Sep" when the range spans more than a day.
export function dateRange(startIso, endIso) {
  const s = parseDay(startIso);
  const e = parseDay(endIso);
  const fmt = (dt) => `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
  if (s.getTime() === e.getTime()) return fmt(s);
  return `${fmt(s)} – ${fmt(e)}`;
}

export function nightCount(startIso, endIso) {
  const ms = parseDay(endIso) - parseDay(startIso);
  return Math.max(Math.round(ms / 86400000), 0);
}

export const pad2 = (n) => String(n).padStart(2, "0");
