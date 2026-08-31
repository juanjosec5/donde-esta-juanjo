<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../store.js";
import { isConfigured } from "../supabase.js";

const auth = useAuth();
const router = useRouter();
const email = ref("");
const sent = ref(false);
const error = ref("");

async function submit() {
  error.value = "";
  if (!isConfigured) {
    // demo mode: pretend we're in
    auth.user = { email: email.value || "demo@local" };
    router.push("/");
    return;
  }
  try {
    await auth.signIn(email.value);
    sent.value = true;
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <div class="wrap" style="max-width: 420px">
    <div class="card stack">
      <h2 style="font-family: var(--font-display)">Sign in</h2>
      <p v-if="sent" class="muted">Check your inbox for a magic link.</p>
      <template v-else>
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="you@example.com" />
        </div>
        <button class="btn primary" @click="submit">Send magic link</button>
        <p v-if="error" class="muted" style="color: var(--coral)">{{ error }}</p>
        <p v-if="!isConfigured" class="muted">
          Demo mode — any email drops you straight in.
        </p>
      </template>
    </div>
  </div>
</template>
