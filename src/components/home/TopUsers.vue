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

      <template #item-name="{ name, image, code }">
        <small-details-card :image="image" :title="name" :text="code?`${$t('LABELS.code')}: ${code}`:''" />
      </template>

      <template #item-specialty="{ specialty, sub_specialty }">
        <small-details-card
          :title="specialty"
          :text="sub_specialty ? $t('LABELS.sub_specialty') + `: ${sub_specialty}` : ''"
        />
      </template>
      <template #item-appointment_count="{ appointment_count }">
        <small-details-card :title="appointment_count + ' ' + $t('LABELS.reservation')" />
      </template>
      <template #item-reviews_count="{ reviews_count }">
        <small-details-card :title="reviews_count + ' ' + $t('LABELS.review')" />
      </template>

      <template #item-rate="{ rate, reviews_count }">
          <div class="flex items-center">
            <span v-for="i in 5" :key="i" class="mx-1">
              <i
                class="fas fa-star text-[#F7DC6F]"
                v-if="i <= rate"
                aria-hidden="true"
              ></i>
              <i
                class="fas fa-star text-gray-300"
                v-else
                aria-hidden="true"
              ></i>
            </span>
          </div>
          <p class="text-sm text-sub text-start">
            ({{ reviews_count }} {{ $t('LABELS.review') }})
          </p>
        </template>
      <template #item-price="{ price }">
        <small-details-card :title="price + ' ' + $t('LABELS.SAR')" />
      </template>
      <template #item-duration="{ duration }">
        <small-details-card :title="duration + ' ' + $t('LABELS.minutes')" />
      </template>
      <template #item-sessions_num="{ sessions_num }">
        <small-details-card :title="sessions_num + ' ' + $t('LABELS.sessions')" />
      </template>
      <template #item-cancelled_appointments="{ cancelled_appointments }">
        <small-details-card :title="cancelled_appointments + ' ' + $t('LABELS.reservation')" />
      </template>

      <template #item-actions="{ id }">
          <router-link
            :to="`/doctors/show/${id}`"
            v-if="checkPermission('doctors', 'show')"
          >
            <svg-icon class="text-primary" name="eye2" filled />
          </router-link>
          <div v-else class="text-center">-</div>
      </template>
    </data-table>
    <teleport to="body">
      <modal
        :persist="true"
        v-if="descModal"
        :title="$t('LABELS.description')"
        @close="descModal = null"
        classes="max-w-[650px] !w-full !min-h-[300px] !max-h-[500px]"
      >
        <div v-html="descModal"></div>
      </modal>
    </teleport>
  </base-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { checkPermission } from "@/utils/permissions";
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

const descModal = ref(null);

const { t, locale } = useI18n();

const headers = [
  {
    text: t("LABELS.Doctor"),
    align: "start",
    sortable: false,
    value: "name",
  },
  {
    text: t("LABELS.specialty"),
    align: "start",
    sortable: false,
    value: "specialty",
  },
  {
    text: t("LABELS.Rate"),
    align: "start",
    sortable: false,
    value: "rate",
  },
  {
    text: t("LABELS.appointment_count"),
    align: "start",
    sortable: false,
    value: "appointment_count",
  },
  {
    text: t("LABELS.cancelled_appointments"),
    align: "start",
    sortable: false,
    value: "cancelled_appointments",
  },
  {
    text: t("LABELS.number of daily_sessions"),
    align: "start",
    sortable: false,
    value: "sessions_num",
  },
  // {
  //   text: t("LABELS.reviews_count"),
  //   align: "start",
  //   sortable: false,
  //   value: "reviews_count",
  // },
  // {
  //   text: t("LABELS.price"),
  //   align: "start",
  //   sortable: false,
  //   value: "price",
  // },
  // {
  //   text: t("LABELS.Examination period"),
  //   align: "start",
  //   sortable: false,
  //   value: "duration",
  // },
  {
    text: t("TITLES.actions"),
    align: "start",
    sortable: false,
    value: "actions",
  },
];
</script>
<style lang="postcss" scoped></style>
