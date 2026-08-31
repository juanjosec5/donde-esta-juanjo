import { ref, onMounted, onUnmounted } from "vue";

// One shared clock for the whole page. Ticks every second.
export function useNow() {
  const now = ref(Date.now());
  let id;
  onMounted(() => {
    id = setInterval(() => (now.value = Date.now()), 1000);
  });
  onUnmounted(() => clearInterval(id));
  return now;
}
