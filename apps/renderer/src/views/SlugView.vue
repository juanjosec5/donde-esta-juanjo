<script setup>
import { ref, watchEffect } from "vue";
import { PageHost } from "@trip/shared";
import { fetchPageConfig } from "../supabase.js";

const props = defineProps({ slug: { type: String, required: true } });

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
  <PageHost v-if="state.status === 'ready'" :key="slug" :config="state.config" />

  <div v-else class="msg">
    <template v-if="state.status === 'loading'">
      <p>Loading…</p>
    </template>
    <template v-else-if="state.status === 'notfound'">
      <h1>Nothing here yet</h1>
      <p>This page isn't published, or the link is wrong.</p>
    </template>
    <template v-else>
      <h1>Something went wrong</h1>
      <p>Try again in a moment.</p>
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
