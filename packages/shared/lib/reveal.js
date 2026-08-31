// v-reveal: fade/slide an element in the first time it scrolls into view.
// Usage: v-reveal  or  v-reveal="{ delay: 120 }"
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const reveal = {
  mounted(el, binding) {
    el.classList.add("reveal");
    if (prefersReduced) {
      el.classList.add("is-in");
      return;
    }
    const delay = binding.value?.delay ?? 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(() => el.classList.add("is-in"), delay);
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
  },
};
