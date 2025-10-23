<template>
  <div
    class="font-semibold text-lg mb-3 pb-4 border-b flex items-center justify-between border-line"
    :class="titleClass"
  >
    <h2>{{ title }}</h2>
    <div class="flex items-center gap-2 exclude-from-pdf">
      <slot name="actions"></slot>
      <router-link v-if="link" :to="link" class="text-primary text-sm">
        {{ $t("BUTTONS.viewAll") }}
        <i
        class="fa-solid ps-1"
        :class="$i18n.locale == 'en' ? ' fa-arrow-right' : ' fa-arrow-left'"
        ></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
    default: "",
  },
  link: {
    type: String,
    required: false,
  },
  titleClass: {
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.show-all {
  font-size: 14px;
}
</style>
