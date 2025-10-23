<template>
  <div v-if="deal.offers.length" class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <deals-offers-card
      :offer="offer"
      v-for="offer in deal.offers"
      :key="offer.id"
    />
  </div>
  <div
    v-else
    class="mx-auto flex w-full max-w-[308px] flex-col items-center justify-center py-11"
  >
    <img width="160" src="@/assets/images/link.png" alt="link" class="mb-3" />
    <h3 class="text-center text-2xl font-bold text-text">
      {{ t("TITLES.WaitingForOffers") }}
    </h3>
    <p class="text-center text-xl text-[#757575]">
      {{
        t(
          "TITLES.Offers will be sent to you from merchants as soon as possible"
        )
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import DealsOffersCard from "./DealsOffersCard.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineProps({
  deal: {
    type: Object,
    required: true,
  },
});
</script>

<style></style>
