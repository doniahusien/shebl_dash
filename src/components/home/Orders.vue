<template>
  <base-card class="border border-border bg-white">
    <section-title
      :title="$t('LABELS.New Orders')"
      link="/orders"
      :icon="`fa-solid ps-1 ${
        locale == 'en' ? ' fa-arrow-right' : ' fa-arrow-left'
      }`"
    />

    <OrderTable :orders="orders" />
  </base-card>
</template>
<script setup>
import OrderTable from "@/components/order/OrderTable.vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
defineProps({
  orders: {
    required: true,
  },
});
</script>

<style lang="postcss" scoped></style>
