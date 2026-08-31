<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePages } from "../store.js";
import { blankConfig } from "../lib/blankConfig.js";
import PagePreview from "../components/PagePreview.vue";

const props = defineProps({ id: { type: String, required: true } });
const pages = usePages();
const router = useRouter();

const clone = (o) => JSON.parse(JSON.stringify(o));

const config = reactive(blankConfig());
const saving = ref(false);
const notFound = ref(false);

function hydrate(src) {
  Object.assign(config, clone(src));
}

onMounted(async () => {
  if (!pages.list.length) await pages.load().catch(() => {});
  const row = pages.list.find((p) => p.id === props.id);
  if (!row) {
    notFound.value = true;
    return;
  }
  if (row.config) hydrate(row.config);
});

// autosave, debounced
let t;
watch(
  config,
  () => {
    clearTimeout(t);
    t = setTimeout(async () => {
      saving.value = true;
      await pages.save(props.id, clone(config)).catch(() => {});
      saving.value = false;
    }, 700);
  },
  { deep: true },
);

const occasions = ["romantic", "family", "friends", "homecoming"];
const kinds = ["stay", "travel", "milestone", "reunion"];
const allStats = ["distance", "stopsLeft", "percent"];

function toggleStat(s) {
  const set = new Set(config.stats.show);
  set.has(s) ? set.delete(s) : set.add(s);
  config.stats.show = allStats.filter((x) => set.has(x));
}

function addEntry() {
  config.entries.push({
    id: `entry-${config.entries.length}`,
    dateStart: "",
    title: "",
    subtitle: "",
    icon: "📍",
    kind: "stay",
    body: "",
  });
}
function removeEntry(i) {
  config.entries.splice(i, 1);
}
function move(i, d) {
  const j = i + d;
  if (j < 0 || j >= config.entries.length) return;
  const [x] = config.entries.splice(i, 1);
  config.entries.splice(j, 0, x);
}

async function publish() {
  await pages.publish(props.id, clone(config));
  hydrate(pages.list.find((p) => p.id === props.id).config);
}

const previewConfig = computed(() => clone(config));
</script>

<template>
  <div v-if="notFound" class="wrap muted">Page not found. <RouterLink to="/">Back</RouterLink></div>

  <div v-else class="wrap">
    <div class="bar" style="border: 0; padding-inline: 0; background: transparent">
      <button class="btn" @click="router.push('/')">← All pages</button>
      <span class="muted">{{ saving ? "Saving…" : "Saved" }}</span>
      <button class="btn primary" @click="publish">Publish (stub)</button>
    </div>

    <div class="editor-grid">
      <div class="stack">
        <div class="card stack">
          <strong>Basics</strong>
          <div class="row two">
            <div><label>Slug</label><input v-model="config.meta.slug" placeholder="you-and-me" /></div>
            <div>
              <label>Occasion</label>
              <select v-model="config.meta.occasion">
                <option v-for="o in occasions" :key="o" :value="o">{{ o }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card stack">
          <strong>People</strong>
          <div class="row two">
            <div><label>Traveller</label><input v-model="config.people.away[0].name" /></div>
            <div><label>At home</label><input v-model="config.people.home[0].name" /></div>
          </div>
        </div>

        <div class="card stack">
          <strong>Hero</strong>
          <div class="row">
            <div><label>Title (line breaks kept)</label><textarea v-model="config.hero.title" /></div>
            <div><label>Subtitle</label><textarea v-model="config.hero.subtitle" /></div>
          </div>
        </div>

        <div class="card stack">
          <strong>The reunion</strong>
          <div class="row two">
            <div><label>Moment (ISO w/ offset)</label><input v-model="config.target.at" placeholder="2026-10-31T20:00:00-05:00" /></div>
            <div><label>Timezone</label><input v-model="config.target.tz" placeholder="America/Guayaquil" /></div>
          </div>
          <div class="row two">
            <div><label>Place</label><input v-model="config.target.placeName" /></div>
            <div><label>Date label</label><input v-model="config.target.dateLabel" placeholder="31 October 2026" /></div>
          </div>
          <div class="row">
            <div><label>Label (“…walks through ___”)</label><input v-model="config.target.label" /></div>
          </div>
        </div>

        <div class="card stack">
          <strong>Stats</strong>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap">
            <label v-for="s in allStats" :key="s" style="text-transform: none; letter-spacing: 0; display: flex; gap: 0.4rem; align-items: center">
              <input type="checkbox" style="width: auto" :checked="config.stats.show.includes(s)" @change="toggleStat(s)" />
              {{ s }}
            </label>
          </div>
        </div>

        <div class="card stack">
          <div class="bar" style="border: 0; padding: 0; background: transparent">
            <strong>Stops</strong>
            <button class="btn" @click="addEntry">Add stop</button>
          </div>
          <div v-for="(e, i) in config.entries" :key="e.id" class="card stack" style="background: var(--cream)">
            <div class="bar" style="border: 0; padding: 0; background: transparent">
              <span class="muted">#{{ i + 1 }}</span>
              <span>
                <button class="btn" @click="move(i, -1)">↑</button>
                <button class="btn" @click="move(i, 1)">↓</button>
                <button class="btn" @click="removeEntry(i)">✕</button>
              </span>
            </div>
            <div class="row two">
              <div><label>Title</label><input v-model="e.title" /></div>
              <div><label>Subtitle</label><input v-model="e.subtitle" /></div>
            </div>
            <div class="row two">
              <div><label>From</label><input v-model="e.dateStart" placeholder="2026-09-04" /></div>
              <div><label>To</label><input v-model="e.dateEnd" placeholder="2026-09-09" /></div>
            </div>
            <div class="row two">
              <div><label>Icon</label><input v-model="e.icon" /></div>
              <div>
                <label>Kind</label>
                <select v-model="e.kind">
                  <option v-for="k in kinds" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
            </div>
            <div><label>Note</label><textarea v-model="e.body" /></div>
          </div>
        </div>

        <div class="card stack">
          <strong>A note</strong>
          <textarea v-model="config.note.body" style="min-height: 6rem" />
        </div>
      </div>

      <div class="preview-pane">
        <PagePreview :config="previewConfig" />
        <p class="muted" style="margin-top: 0.5rem">Live preview · scaled to 55%</p>
      </div>
    </div>
  </div>
</template>
