<template>
  <div class="v-table">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="w-[123px]">{{ $t("LABELS.Product") }}</th>
            <th>{{ $t("LABELS.Name") }}</th>
            <th>{{ $t("LABELS.Category") }}</th>
            <th>{{ $t("LABELS.Price") }}</th>
            <th>{{ $t("LABELS.Quantity") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in deal.products" :key="product.id">
            <td><cart-images-swiper :product="product" /></td>
            <td class="text-lg">{{ product.name }}</td>
            <td>
              <div>
                <p class="text-xl text-text">
                  {{ product.main_category?.name }}
                </p>
                <p class="text-sub-text">{{ product.sub_category?.name }}</p>
              </div>
            </td>
            <td class="text-xl font-bold text-green-500">
              {{ product.price }} {{ $t("SAR") }}
            </td>
            <td class="font-bold">{{ product.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import CartImagesSwiper from "@/components/CartImagesSwiper";
defineProps({
  deal: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss">
.v-table {
  @apply flex h-full w-full max-w-[100%] flex-col rounded-lg leading-[1.5];
  --v-table-header-height: 45px;

  .table-wrapper {
    @apply flex-auto overflow-auto;
    table {
      @apply w-full border-spacing-0;
      thead {
        @apply rounded-2xl bg-[#F8FBFD];
      }

      th {
        @apply px-4 text-start;
        height: calc(var(--v-table-header-height) + 15px);
      }

      td {
        @apply p-4 text-start;
      }
    }
  }
}
</style>
