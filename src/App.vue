<template>
  <Suspense>
    <global-error v-if="appStore.no_internet" />
    <router-view v-else />

    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "./store/app";
const appStore = useAppStore();

const { locale } = useI18n();

onMounted(() => {
  if (locale.value == "ar") {
    document.body.dir = "rtl";
  }
});
</script>
