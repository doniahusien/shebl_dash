<template>
  <div v-if="items">
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
          v-if="
            !$route.query.keyword &&
            !$route.query.client_name
          "
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <div class="text-center">
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.financial_reports"),
                })
              }}
            </h3>
          </div>
        </div>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <img src="@/assets/images/search.png" alt="no data" class="mx-auto" />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </div>
      </template>

      <template #item-name="{ name, user_id }">
        <router-link :to="`/users/show/${user_id}`" v-if="checkPermission('clients', 'show')">
          <small-details-card :title="name" />
        </router-link>
        <div v-else class="text-center">-</div>
      </template>
      <template #item-offer="{ offer, offer_id }">
        <router-link :to="`/offers/show/${offer_id}`" v-if="checkPermission('offers', 'show')">
          <small-details-card :title="offer" />
        </router-link>
        <div v-else class="text-center">-</div>
      </template>
      <template #item-price="{ price }">
        <small-details-card :title="price + ' ' + $t('LABELS.SAR')" />
      </template>
    </data-table>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
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
    required: false,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const { t, locale } = useI18n();

const headers = [
  {
    text: t("LABELS.Offer"),
    align: "start",
    sortable: false,
    value: "offer",
  },
  {
    text: t("LABELS.Client"),
    align: "start",
    sortable: false,
    value: "name",
  },
  {
    text: t("LABELS.price"),
    align: "start",
    sortable: false,
    value: "price",
  },
];

</script>
<style lang="postcss" scoped></style>
