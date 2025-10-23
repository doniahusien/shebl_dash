<template>
  <div class="flex flex-col items-center justify-center gap-3 text-center">
    <img
      src="@/assets/images/403.png"
      alt="unauthorized"
      class="w-[400px] h-[300px]"
    />
    <h1 class="font-semibold text-2xl">{{ $t("LABELS.Access Denied") }}</h1>
    <p class="text-sub">
      {{ $t("LABELS.You do not have permission to access this resource") }}.
    </p>

    <router-link
      class="base-btn"
      :to="{
        name: 'dashboard',
      }"
    >
      {{ $t("LABELS.Back to home") }}
    </router-link>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
