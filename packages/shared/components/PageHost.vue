<script setup>
import { provide, ref, onMounted } from "vue";
import { PAGE, NOW, EMBEDDED } from "../lib/keys.js";
import { useNow } from "../composables/useNow";
import { useLocale } from "../composables/useLocale";
import { usePageTheme } from "../composables/usePageTheme";
import { toRenderModel } from "../lib/toRenderModel.js";
import { PALETTES } from "../lib/palettes.js";
import PageView from "./PageView.vue";

// `config` is a PageConfig (see normalizeConfig.js). It is read once at setup —
// callers that need live edits (config OR locale) remount this with a :key.
// `embedded` = rendered inside another app (the builder preview): the fixed
// atmosphere / jump pill become absolute so they stay inside their box.
const props = defineProps({
  config: { type: Object, required: true },
  embedded: { type: Boolean, default: false },
});

const { locale } = useLocale();

provide(NOW, useNow());
provide(PAGE, toRenderModel(props.config, locale.value));
provide(EMBEDDED, props.embedded);

// --- per-page color theme -----------------------------------------------
// Precedence: the viewer's B&W toggle (handled in usePageTheme) > `?theme=`
// (QA) > the config's preset.
const urlPreset =
  typeof location !== "undefined"
    ? new URLSearchParams(location.search).get("theme")
    : null;
const basePreset =
  urlPreset && urlPreset in PALETTES ? urlPreset : props.config.theme?.preset;

const embedRoot = ref(null);

if (props.embedded) {
  // builder preview: scope the palette to the preview box; the global toggles
  // (mono, the app-wide controller) don't apply inside it.
  const vars = PALETTES[basePreset];
  onMounted(() => {
    if (!vars || !embedRoot.value) return;
    for (const [k, v] of Object.entries(vars)) {
      embedRoot.value.style.setProperty(k, v);
    }
  });
} else {
  usePageTheme(basePreset);
}
</script>

<template>
  <PageView v-if="!embedded" />
  <div v-else ref="embedRoot" class="trip-embed"><PageView /></div>
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
