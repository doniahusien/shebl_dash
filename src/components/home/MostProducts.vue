<template>
  <base-card class="bg-white">
    <section-title
      :title="$t('LABELS.BestSellingProducts')"
      link="/products"
      :icon="`fa-solid ps-1 ${
        locale == 'en' ? ' fa-arrow-right' : ' fa-arrow-left'
      }`"
    />
    <v-data-table-virtual
      :headers="headers"
      :items="items"
      item-value="id"
      class="project-table"
      item-key="id"
    >
      <template v-slot:loading>
        <loader class="py-7" />
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <img
            class="mx-auto"
            src="@/assets/images/stats/food-icon.png"
            alt=""
          />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been Found", {
                name: $t("LABELS.products"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.product`]="{ item }">
        <small-details-card
          :image="item.main_image"
          :title="item.name"
          :text="`#${item.id}`"
        />
      </template>
      <template v-slot:[`item.category`]="{ item }">
        <small-details-card
          :title="item.main_category?.name ?? null"
          :text="item.sub_category?.name ?? null"
        />
      </template>

      <template v-slot:[`item.price`]="{ item }">
        <small-details-card :title="item.price + ' ' + $t('SAR')" />
      </template>
      <template v-slot:[`item.product_status`]="{ item }">
        <p
          class="flex items-center gap-1 text-primary"
          v-if="item.quantity > item.minimum_stock_notification"
        >
          <span
            class="size-4 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Check1 width="12" />
          </span>
          {{ $t("LABELS.Available") }}
        </p>
        <p
          class="flex items-center gap-1 whitespace-nowrap text-red-500"
          v-else
        >
          <span
            class="size-4 rounded-full bg-red-500/10 flex items-center justify-center"
          >
            <i class="fas fa-times"></i>
          </span>
          {{ $t("LABELS.Almost sold out") }}
        </p>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <router-link :to="`/products/show/${item.id}`">
          <svg-icon name="eye2" />
        </router-link>
      </template>
    </v-data-table-virtual>
  </base-card>
</template>

<script setup>
import Check1 from "@/components/icons/Check1.vue";

import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const items = ref([]);

const { t } = useI18n();

const headers = [
  {
    title: t("LABELS.Product"),
    align: "start",
    sortable: false,
    key: "product",
  },
  {
    title: t("LABELS.main-category"),
    align: "start",
    sortable: false,
    key: "category",
  },

  {
    title: t("LABELS.price"),
    align: "start",
    sortable: false,
    key: "price",
  },
  {
    title: t("LABELS.status"),
    align: "start",
    sortable: false,
    key: "product_status",
  },

  {
    title: "",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

watch(
  () => props.products,
  (value) => (items.value = value),
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="postcss" scoped></style>
