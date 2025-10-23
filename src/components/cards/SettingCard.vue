<template>
  <router-link
    :to="item.path"
    class="border flex flex-col gap-2 md:gap-5 items-center justify-end rounded-md py-6 px-3 !border-line md:h-[192px]"
    :class="grid ? classes : 'w-[400px] sm:w-[220px] md:w-[400px] lg:w-[274px]'"
  >
    <img height="" :src="item.image" :alt="item.name" />

    <h2 class="font-semibold text-lg">{{ item.name }}</h2>
  </router-link>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  grid: {
    type: Boolean,
    required: false,
    default: null,
  },
  classes: {
    type: String,
    required: false,
    default: null,
  },
});
</script>
