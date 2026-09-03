<script setup>
import { ref, watchEffect } from "vue";
import { PageHost, useLocale } from "@trip/shared";
import { fetchPageConfig } from "../supabase.js";

const props = defineProps({ slug: { type: String, required: true } });
const { locale, t } = useLocale();

const state = ref({ status: "loading", config: null });

watchEffect(async () => {
  const slug = props.slug;
  state.value = { status: "loading", config: null };
  try {
    const config = await fetchPageConfig(slug);
    state.value = config
      ? { status: "ready", config }
      : { status: "notfound", config: null };
  } catch {
    state.value = { status: "error", config: null };
  }
});
</script>

<template>
  <PageHost
    v-if="state.status === 'ready'"
    :key="slug + ':' + locale"
    :config="state.config"
  />

  <div v-else class="msg">
    <template v-if="state.status === 'loading'">
      <p>{{ t('slug.loading') }}</p>
    </template>
    <template v-else-if="state.status === 'notfound'">
      <h1>{{ t('slug.notFoundTitle') }}</h1>
      <p>{{ t('slug.notFoundBody') }}</p>
    </template>
    <template v-else>
      <h1>{{ t('slug.errorTitle') }}</h1>
      <p>{{ t('slug.errorBody') }}</p>
    </template>
  </div>
</template>

<style scoped>
.msg {
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 0.5rem;
  padding: 2rem;
  font-family: var(--font-body);
  color: var(--ink);
}
</style>
