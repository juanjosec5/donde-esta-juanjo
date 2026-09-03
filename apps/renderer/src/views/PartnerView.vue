<script setup>
import { PageHost, useLocale } from "@trip/shared";
import partner from "../configs/partner.js";

const { locale } = useLocale();
</script>

<template>
  <PageHost :key="locale" :config="partner" />
</template>
