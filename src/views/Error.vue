<template>
  <div class="flex flex-col justify-center items-center">
    <div class="text-center space-y-6 w-full">
      <img src="@/assets/images/error.png" alt="connection" class="m-auto" />
      <h3 class="font-bold text-[44px] text-center capitalize">
        {{ $t("LABELS.Internal server error") }}
      </h3>
      <img
        src="@/assets/images/connection.png"
        alt="connection"
        class="w-full"
      />
      <p class="max-w-[423px] m-auto">{{ $t("LABELS.errorDesc") }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
