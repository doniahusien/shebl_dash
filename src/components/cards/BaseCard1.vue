<template>
  <div class="rounded-xl p-1 md:p-4 base-card-1 bg-white" :class="classes">
    <div class="flex items-center gap-2 flex-wrap justify-between" v-if="title">
      <div class="mb-3">
        <h3 v-if="title" class="text-2xl text-text font-semibold">
          {{ title }}
        </h3>
        <slot name="subtitle" />
      </div>
      <slot name="topTitle" />
    </div>
    <slot name="title" />
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    required: false,
  },
  classes: {
    required: false,
  },
});
</script>

<style lang="scss">
.base-card-1 {
  box-shadow: 0px 7px 58px 0px #b1b1b11a;
}
</style>
