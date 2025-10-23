<template>
  <base-card class="bg-white">
    <div class="flex justify-between items-center mb-3">
      <section-title
        :title="$t('LABELS.latestQuotes')"
        titleClass="!border-none !mb-0"
      />
    </div>
    <v-data-table-virtual
      :headers="headers"
      :items="items"
      item-value="id"
      class="quotes-table"
      item-key="id"
    >
      <template v-slot:loading>
        <loader class="py-7" />
      </template>
      <template v-slot:no-data>
        <div class="h-full flex flex-col items-center justify-center space-y-6">
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/question.png"
              alt=""
            />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been Found", {
                  name: $t("LABELS.quotesRequests"),
                })
              }}
            </h3>
          </div>
        </div>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <small-details-card :text="item.created_at" :title="item.name" />
      </template>
      <template v-slot:[`item.content`]="{ item }">
        <div class="flex items-center gap-2">
          <div>
            <small-details-card
              :title="
                item.type == 'new_product'
                  ? $t('LABELS.newProductRequest')
                  : $t('LABELS.currentProductRequest')
              "
            />
          </div>
          <router-link
            :to="`/quotes/${item.id}`"
            class="flex items-center gap-1 text-primary hover:text-primary font-semibold"
          >
            <svg-icon name="eye2" />
          </router-link>
        </div>
      </template>
      <template v-slot:[`item.whatsapp`]="{ item }">
        <small-details-card :title="item.whatsapp ?? null" />
      </template>
    </v-data-table-virtual>
  </base-card>
</template>

<script setup>
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
const props = defineProps({
  quotes: {
    type: Array,
    required: true,
    default: [],
  },
});

const items = toRef(props.quotes);

const { t } = useI18n();

const headers = [
  {
    title: t("LABELS.full_name"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.email"),
    align: "start",
    sortable: false,
    key: "email",
  },
  {
    title: t("LABELS.phone"),
    align: "start",
    sortable: false,
    key: "phone",
  },

  {
    title: t("LABELS.whatsapp"),
    align: "start",
    sortable: false,
    key: "whatsapp",
  },
  {
    title: t("LABELS.content"),
    align: "start",
    sortable: false,
    key: "content",
  },
];
</script>
<style lang="scss">
.quotes-table {
  .v-table__wrapper {
    @apply pb-0;
  }
}
</style>
