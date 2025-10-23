<template>
  <div class="w-full bg-white p-2 flex h-full justify-center items-center">
    <Skeleton :width="width" :height="height" class="mb-1" />
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";

defineProps({
  width: {
    default: "100%",
    required: false,
  },
  height: {
    default: "22rem",
    required: false,
  },
});
</script>
