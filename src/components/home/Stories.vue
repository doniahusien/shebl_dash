<template>
  <base-card class="bg-white">
    <div class="flex justify-between items-center mb-3">
      <section-title
        :title="$t('LABELS.Stories awaiting approval')"
        titleClass="!border-none !mb-0"
      />
      <!-- <div class="flex gap-2 items-center flex-wrap" v-if="items?.length">
        <button type="button" class="base-btn-red">
          {{ $t("LABELS.Trader ban") }}
        </button>
        <button type="button" class="base-btn-red-bg">
          {{ $t("LABELS.Reject the story") }}
        </button>
        <button type="button" class="base-btn shadow-none">
          {{ $t("LABELS.Approval of the story") }}
        </button>
      </div> -->
    </div>
    <v-data-table-virtual
      :headers="headers"
      :items="items"
      show-select
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
                name: $t("LABELS.stories"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <small-details-card :image="item.product.main_image" />
      </template>
      <template v-slot:[`item.storyTitle`]="{ item }">
        <small-details-card :title="item.product.name" />
      </template>
      <template v-slot:[`item.category`]="{ item }">
        <small-details-card
          :title="item.product.main_category?.name ?? null"
          :text="item.product.sub_category?.name ?? null"
        />
      </template>
      <template v-slot:[`item.provider`]="{ item }">
        <small-details-card
          :title="item.provider.full_name ?? null"
          :text="item.provider?.facility_type?.name"
        />
      </template>
      <template v-slot:[`item.quantity`]="{ item }">
        <small-details-card
          :title="item.quantity ? String(item.quantity) : null"
        />
      </template>

      <template v-slot:[`item.price`]="{ item }">
        <small-details-card :title="item.price + ' ' + $t('SAR')" />
      </template>
      <template v-slot:[`item.discount_percentage`]="{ item }">
        <p class="text-[#C4C4C4] flex">
          <svg-icon name="discount" />
          {{ item.discount }} %
          {{ $t("LABELS.Discount") }}
        </p>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex items-center gap-2 min-w-[100px]">
          <router-link
            :to="`/stories/show/${item.id}`"
            class="border-[1px] border-line rounded-full flex items-center justify-center size-[40px]"
          >
            <svg-icon name="eye2" class="text-[#E3E3E3]" />
          </router-link>
          <button
            @click="console.log('download')"
            class="border-[1px] border-line rounded-full flex items-center justify-center size-[40px]"
          >
            <svg-icon name="install" class="text-[#E3E3E3]" />
          </button>
        </div>
      </template>
    </v-data-table-virtual>
  </base-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { toRef } from "vue";
const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: [],
  },
});

const items = toRef([...props.products]);

const { t } = useI18n();

const headers = [
  {
    title: t("LABELS.image"),
    align: "start",
    sortable: false,
    key: "image",
  },
  {
    title: t("LABELS.storyTitle"),
    align: "start",
    sortable: false,
    key: "storyTitle",
  },
  {
    title: t("LABELS.Section"),
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: t("LABELS.provider name"),
    align: "start",
    sortable: false,
    key: "provider",
  },

  {
    title: t("LABELS.quantity"),
    align: "start",
    sortable: false,
    key: "quantity",
  },
  {
    title: t("LABELS.Price"),
    align: "start",
    sortable: false,
    key: "price",
  },
  {
    title: t("LABELS.Discount percentage"),
    align: "start",
    sortable: false,
    key: "discount_percentage",
  },

  {
    title: t("LABELS.Actions"),
    align: "center",
    sortable: false,
    key: "actions",
  },
];
</script>
<style lang="postcss" scoped></style>
