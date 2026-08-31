// Scroll the current day's timeline card into the middle of the viewport.
export function scrollToToday() {
  const el = document.getElementById("today");
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
}
