import { ref, watch } from "vue";

// Viewer-set black-and-white toggle. One shared ref for the whole app,
// remembered per browser. When on, it overrides the page's own palette.
const KEY = "trip:mono";

function read() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

const mono = ref(read());

watch(mono, (on) => {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* private mode / storage blocked — the toggle still works for the session */
  }
});

export function useMono() {
  return { mono, toggle: () => (mono.value = !mono.value) };
}
