<template>
  <base-card class="border lg:col-span-6 col-span-12">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-lg mb-5">
        {{ $t("TITLES.salesStore") }}
      </h3>

      <RouterLink to="/" class="flex items-center text-primary gap-2">
        <span>{{ $t("BUTTONS.viewAll") }}</span>

        <i
          :class="`fa-solid fa-arrow-${
            $i18n.locale === 'ar' ? 'left' : 'right'
          }`"
        />
      </RouterLink>
    </div>

    <Doughnut />
  </base-card>
</template>

<script setup>
import Doughnut from "@/components/charts/Doughnut.vue";
</script>
