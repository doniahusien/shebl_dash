<template>
  <base-card class="border lg:col-span-6 col-span-12">
    <div class="flex items-center justify-between gap-3 mb-5">
      <h3 class="font-semibold text-lg mb-5">
        {{ $t("TITLES.topGrossingItems") }}

      <RouterLink to="/" class="flex items-center text-primary gap-2">
        <span>{{ $t("BUTTONS.viewAll") }}</span>

        <i
          :class="`fa-solid fa-arrow-${
            $i18n.locale === 'ar' ? 'left' : 'right'
          }`"
        />
      </RouterLink>
    </div>

    <div class="grid grid-cols-12 border-b border-[#F5F5F5] pb-3">
      <h5 class="col-span-9 text-sub">{{ $t("TEXTS.item") }}</h5>

      <h5 class="col-span-3 text-sub">{{ $t("TEXTS.amount") }}</h5>
    </div>

    <div class="px-2 overflow-y-auto max-h-[500px] mt-3">
      <Items :items="topSellingItems" />
    </div>
  </base-card>
</template>

<script setup>
defineProps({
  items: {
    type: Object,
    required: true,
    default: null,
  },
});
</script>
