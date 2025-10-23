<template>
  <base-card class="bg-white flex items-center">
    <div
      class="flex gap-3 justify-between items-center w-full bg-white"
      :class="classes"
    >
      <img :width="item.width ?? 100" :src="item.image" :alt="item.title" />
      <div class="h-full flex flex-col">
        <h4 class="mb-1">{{ item.title }}</h4>
        <p class="text-[12px] font-light" v-if="item.subTitle">
          {{ item.subTitle }}
        </p>
        <p class="font-semibold text-xl">
          {{ item.number }} <span v-if="item.measure">{{ item.measure }}</span>
        </p>
      </div>
    </div>
  </base-card>
</template>

<script setup>
defineProps({
  item: {
    required: false,
  },
  classes: {
    required: false,
  },
});
</script>

<style></style>
