import { ref, onMounted, onUnmounted } from "vue";

/**
 * Which way `scrollToToday` would travel from the current scroll position:
 * `up` is true once the #today card sits above the viewport middle (i.e. you've
 * scrolled past the current stop), so callers can flip a ↓ arrow to ↑.
 */
export function useToTodayDirection() {
  const up = ref(false);
  let ticking = false;

  const measure = () => {
    ticking = false;
    const el = document.getElementById("today");
    if (!el) return;
    const r = el.getBoundingClientRect();
    up.value = r.top + r.height / 2 < window.innerHeight / 2;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(measure);
  };

  onMounted(() => {
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  });

  return { up };
}
