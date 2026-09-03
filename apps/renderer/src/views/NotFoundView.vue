<script setup>
import { useLocale } from "@trip/shared";
const { t } = useLocale();
</script>

<template>
  <div class="msg">
    <h1>{{ t('notfound.title') }}</h1>
    <p>{{ t('notfound.body') }}</p>
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
