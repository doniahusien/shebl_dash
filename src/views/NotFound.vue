<template>
  <div class="container my-20">
    <div class="flex justify-center flex-col items-center">
      <img
        width="500"
        height="500"
        src="@/assets/images/cuate.png"
        alt="not found icon"
        loading="lazy"
      />
      <div class="error_section">
        <h1 class="text-center font-bold text-2xl my-4 text-text">
          {{ $t("LABELS.something went wrong") }}
        </h1>
        <p class="text-center max-w-[500px] text-text-light">
          {{ $t("LABELS.pleaseKindlyTryAgain") }}
        </p>
        <div class="flex justify-center mt-5">
          <button type="button" @click="$router.back()" class="base-btn mx-2">
            {{ $t("LABELS.Back to home") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
