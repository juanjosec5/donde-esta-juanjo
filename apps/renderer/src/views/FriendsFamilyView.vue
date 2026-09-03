<script setup>
import { PageHost, useLocale } from "@trip/shared";
import friendsFamily from "../configs/friends-family.js";

const { locale } = useLocale();
</script>

<template>
  <PageHost :key="locale" :config="friendsFamily" />
</template>
