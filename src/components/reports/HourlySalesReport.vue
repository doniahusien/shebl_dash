<template>
  <base-card class="border lg:col-span-6 col-span-12">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-lg mb-5">
        {{ $t("TITLES.hourlySalesReport") }}
      </h3>

      <RouterLink to="/" class="flex items-center text-primary gap-2">
        <span>{{ $t("BUTTONS.viewAll") }}</span>

        <i
          :class="`fa-solid fa-arrow-${
            $i18n.locale === 'ar' ? 'left' : 'right'
          }`"
        />
      </RouterLink>
    </div>

    <div class="flex items-center gap-5">
      <button
        type="button"
        class="font-medium pb-2 border-b border-solid stats-btn"
        :class="active === 'sales' ? 'active' : 'in_active'"
        @click="active = 'sales'"
      >
        {{ $t("TITLES.sales") }}
      </button>

      <button
        type="button"
        class="font-medium pb-2 border-b border-solid stats-btn"
        :class="active === 'orders' ? 'active' : 'in_active'"
        @click="active = 'orders'"
      >
        {{ $t("TITLES.orders") }}
      </button>
    </div>

    <Bar />
  </base-card>
</template>

<script setup>
import Bar from "@/components/charts/Bar.vue";
import { ref } from "vue";

const active = ref("sales");
</script>

<style lang="scss" scoped>
.stats-btn {
  &.active {
    @apply border-b-primary text-primary;
  }
  &.in_active {
    @apply border-b-sub text-sub;
  }
  &:hover {
    @apply text-primary border-b border-primary;
  }
}
</style>
