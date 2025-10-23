<template>
  <div class="flex items-center justify-between flex-wrap gap-3 mb-3">
    <div class="d-flex align-items-center lg:gap-3 gap-2">
      <h2 class="font-semibold lg:!text-lg text-base" :class="titleClass">
        {{ title }}
      </h2>

      <button
        type="button"
        :class="actionClass"
        class="flex items-center justify-center lg:w-7 lg:h-7 lg:!text-base !text-sm rounded-circle"
        @click="$emit('action')"
      >
        <i :class="icon" />
      </button>
    </div>
    <router-link
      v-if="link"
      :to="link"
      class="d-flex align-items-center gap-2 text-primary text-decoration-none fw-medium show-all"
    >
      <span>{{ linkName }}</span>

      <i
        :class="`fa-solid fa-arrow-${
          $i18n.locale === 'ar' ? 'left' : 'right'
        }-long`"
      />
    </router-link>
  </div>
</template>

<script setup>
import i18n from "@/plugins/i18n";
defineProps({
  title: {
    required: false,
    default: "",
  },
  titleClass: {
    required: false,
    default: "text-primary",
  },
  actionClass: {
    required: false,
    default: "bg-primary text-white",
  },
  icon: {
    required: false,
    default: "fa-solid fa-plus",
  },
  link: {
    required: false,
  },
  linkName: {
    required: false,
    default: i18n.global.t("BUTTONS.showAll"),
  },
});
</script>
