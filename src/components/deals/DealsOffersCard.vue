<template>
  <div class="overflow-hidden rounded-md border border-border">
    <div
      class="flex items-center justify-between bg-primary p-2 lg:px-7 min-h-[58px]"
    >
      <h4 class="font-bold text-white">
        {{ $t("LABELS.Total Offer") }} {{ offer.sub_total }} {{ $t("SAR") }}
      </h4>

      <div
        v-if="offer.order_id"
        class="rounded-full bg-white px-7 py-3.5 font-bold text-primary"
      >
        {{ $t("LABELS.awarded") }}
      </div>
      <span v-else></span>
    </div>
    <router-link
      :to="
        offer.order_id
          ? `/orders/${offer.order_id}`
          : `/deals/${route.params.id}/offers/${offer.id}`
      "
    >
      <div class="space-y-6 p-4 lg:p-7">
        <div class="flex flex-wrap gap-4 lg:gap-7">
          <div class="item-wrapper flex-1 border-e border-line">
            <h4 class="text-[#707070]">{{ $t("LABELS.Show time") }}</h4>
            <p>{{ offer.date }}</p>
          </div>

          <div class="item-wrapper flex-1">
            <h4 class="text-[#707070]">{{ $t("LABELS.Merchant") }}</h4>
            <p class="!text-red-500">
              {{ offer.user?.full_name ?? "-" }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 lg:gap-7">
          <div class="item-wrapper flex-1 border-e border-line">
            <h4 class="text-[#707070]">{{ $t("LABELS.Payment Method") }}</h4>
            <!-- <p>{{ offer.pay_type }}</p> -->
            <svg-icon
              :name="offer.pay_type == 'card' ? 'visa' : 'cash'"
              :class="
                offer.pay_type == 'card'
                  ? 'text-5xl text-primary'
                  : 'text-5xl text-[#2DA840]'
              "
            />
          </div>

          <div class="item-wrapper flex-1">
            <h4 class="text-[#707070]">{{ $t("LABELS.Available to him") }}</h4>
            <p class="!text-red-500">
              {{ offer.is_available_all ? $t("LABELS.All Products") : "" }} {{}}
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

defineProps({
  offer: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
</script>

<style lang="scss">
.item-wrapper {
  h4 {
    @apply text-start text-lg text-text;
  }
  p {
    @apply text-start text-lg font-bold text-text lg:text-xl;
  }
}
</style>
