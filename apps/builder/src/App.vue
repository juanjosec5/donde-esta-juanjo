<script setup>
import { RouterView, RouterLink } from "vue-router";
import { isConfigured } from "./supabase.js";
import { useAuth } from "./store.js";

const auth = useAuth();
</script>

<template>
  <div class="builder">
    <div class="bar">
      <RouterLink to="/" style="text-decoration: none; color: inherit">
        <h1>trip pages · builder</h1>
      </RouterLink>
      <div>
        <span v-if="auth.user" class="muted">{{ auth.user.email }} · </span>
        <button v-if="auth.user" class="btn" @click="auth.signOut()">Sign out</button>
      </div>
    </div>

    <p v-if="!isConfigured" class="wrap muted">
      Supabase isn't configured — copy <code>.env.example</code> to
      <code>.env</code>. The builder runs in a local-only demo mode until then.
    </p>

    <RouterView />
  </div>
</template>
