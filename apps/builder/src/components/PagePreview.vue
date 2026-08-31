<script setup>
import { computed } from "vue";
import { PageHost } from "@trip/shared";

const props = defineProps({ config: { type: Object, required: true } });

// Remount the render surface whenever the config changes — the components read
// their model once at setup, so this is the simplest way to keep the preview live.
const key = computed(() => JSON.stringify(props.config));
</script>

<template>
  <div class="preview-frame">
    <div class="preview-scale">
      <PageHost :key="key" :config="config" embedded />
    </div>
  </div>
</template>

<style scoped>
.preview-frame {
  border: 1px solid var(--edge);
  border-radius: 14px;
  overflow: hidden;
  height: 72vh;
  background: var(--cream);
}
.preview-scale {
  --z: 0.52;
  width: calc(100% / var(--z));
  height: calc(100% / var(--z));
  transform: scale(var(--z));
  transform-origin: top left;
  overflow-y: auto;
}
.preview-scale > * {
  min-height: 100%;
}
</style>
