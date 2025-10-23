<template>
  <base-card class="bg-white" v-if="items">
    <section-title
      :title="title"
      :link="link"
      :icon="`fa-solid ps-1 ${
        locale == 'en' ? ' fa-arrow-right' : ' fa-arrow-left'
      }`"
    >
    <template #actions>
      <slot name="actions"></slot>
    </template>
    </section-title>
    <data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hide-footer
    >
      <template #loading>
        <loader class="py-7" />
      </template>
      <template #empty-message>
        <div
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <h3 class="mt-4 font-semibold text-text text-center">
            {{ $t("LABELS.noData", { name: title }) }}
          </h3>
        </div>
      </template>

      <template #item-name="{ name, image }">
        <small-details-card :image="image" :title="name" />
      </template>
    </data-table>
  </base-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const { t, locale } = useI18n();

const headers = [
  {
    text: t("LABELS.specialty"),
    align: "start",
    sortable: false,
    value: "name",
  },
];
</script>
<style lang="postcss" scoped></style>
