<script setup>
import { provide } from "vue";
import { PAGE, NOW, EMBEDDED } from "../lib/keys.js";
import { useNow } from "../composables/useNow";
import { toRenderModel } from "../lib/toRenderModel.js";
import PageView from "./PageView.vue";

// `config` is a PageConfig (see normalizeConfig.js). It is read once at setup —
// callers that need live edits should remount this component with a :key.
// `embedded` = rendered inside another app (the builder preview): the fixed
// atmosphere / jump pill become absolute so they stay inside their box.
const props = defineProps({
  config: { type: Object, required: true },
  embedded: { type: Boolean, default: false },
});

provide(NOW, useNow());
provide(PAGE, toRenderModel(props.config));
provide(EMBEDDED, props.embedded);
</script>

<template>
  <PageView v-if="!embedded" />
  <div v-else class="trip-embed"><PageView /></div>
</template>

<style scoped>
.trip-embed {
  position: relative;
  overflow: hidden;
  min-height: 100%;
  /* new containing block so descendant position:fixed can't escape the preview */
  transform: translateZ(0);
}
</style>
