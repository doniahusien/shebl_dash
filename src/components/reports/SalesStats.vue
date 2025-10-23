<template>
  <base-card class="border col-span-3 md:col-span-2 mb-5">
    <h3 class="font-semibold text-lg mb-5">{{ $t("TITLES.sales") }}</h3>

    <LineChart />
  </base-card>
</template>

<script setup>
import LineChart from "@/components/charts/Line.vue";
</script>
