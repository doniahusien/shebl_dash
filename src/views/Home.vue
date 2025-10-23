<template>
  <div class="home_wrraper flex flex-col items-center justify-center min-h-screen text-center p-6 pt-20">
    <h2 class="font-bold text-3xl mb-4">
      {{ $t("TITLES.home") }}
    </h2>
    <p class="text-gray-500 text-lg mb-8">
      {{ $t("LABELS.coming_soon_message") }}
    </p>
    <div class="animate-pulse">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style>

</style>
