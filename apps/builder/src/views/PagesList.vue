<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePages } from "../store.js";

const pages = usePages();
const router = useRouter();

onMounted(() => pages.load().catch(() => {}));

async function create() {
  const row = await pages.create();
  router.push(`/p/${row.id}`);
}
</script>

<template>
  <div class="wrap stack">
    <div class="bar" style="border: 0; padding-inline: 0; background: transparent">
      <h2 style="font-family: var(--font-display)">Your pages</h2>
      <button class="btn primary" @click="create">New page</button>
    </div>

    <p v-if="pages.loading" class="muted">Loading…</p>
    <p v-else-if="!pages.list.length" class="muted">
      No pages yet. Create one to get started.
    </p>

    <ul class="stack" style="list-style: none; padding: 0">
      <li v-for="p in pages.list" :key="p.id">
        <RouterLink
          :to="`/p/${p.id}`"
          class="card"
          style="display: flex; justify-content: space-between; text-decoration: none; color: inherit"
        >
          <span>
            <strong>{{ p.config?.hero?.title?.split("\n")[0] || "Untitled page" }}</strong>
            <span class="muted"> · /{{ p.slug || "—" }}</span>
          </span>
          <span class="muted">{{ p.status }} · {{ p.plan }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
