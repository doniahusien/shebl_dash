<template>
  <div
    v-for="(item, i) in items"
    :key="i"
    class="grid grid-cols-12 items-center border-b border-line last-of-type:!border-none py-3"
  >
    <div class="col-span-9 flex items-center gap-3">
      <img :src="item.image" class="w-[56px] h-[56px] rounded-full" />

      <div class="flex flex-col items-start gap-2">
        <h5 class="font-medium text-[#171717]">{{ item.name }}</h5>

        <p class="text-sm font-light text-sub">
          {{ item.amount }}
          {{ $t("TITLES.sales") }}
        </p>
      </div>
    </div>

    <h5 class="font-semibold">
      {{
        new Intl.NumberFormat("en-us", {
          style: "currency",
          currency: "AED",
        }).format(item.total)
      }}
    </h5>
  </div>
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
