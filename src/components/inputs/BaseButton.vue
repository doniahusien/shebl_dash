<template>
  <button v-if="!meta" :type="type" :disabled="loading" :class="classes">
    <ProgressSpinner
      v-if="loading"
      style="width: 30px; height: 30px;"
      strokeWidth="5"
      fill="var(--surface-ground)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
    <template v-else>
      <svg-icon v-if="icon1" :name="icon1" />
      {{ $t(`BUTTONS.${name}`) }}
      <svg-icon v-if="icon" :name="icon" />
    </template>
  </button>

  <button
    v-else
    :type="type"
    :disabled="!meta?.valid || loading"
    class="base-btn"
    :class="classes"
  >
    <ProgressSpinner
      v-if="loading"
      style="width: 30px; height: 30px;"
      strokeWidth="5"
      fill="var(--surface-ground)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />

    <template v-else>
      {{ $t(`BUTTONS.${name}`) }}
      <svg-icon v-if="icon" :name="icon" />
    </template>
  </button>
</template>

<script setup>
import ProgressSpinner from "primevue/progressspinner";
const props = defineProps({
  meta: {
    required: false,
  },
  icon: {
    required: false,
  },
  icon1: {
    required: false,
  },
  type: {
    required: false,
    default: "button",
  },
  name: {
    required: true,
  },
  loading: {
    required: false,
    default: false,
  },
  classes: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<style></style>
