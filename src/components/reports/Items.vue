<template>
  <base-card class="border lg:col-span-6 col-span-12">
    <div class="flex items-center justify-between gap-3 mb-5">
      <slot />
    </div>

    <div class="grid grid-cols-12 border-b border-[#F5F5F5] pb-3">
      <h5 class="col-span-9 text-sub">{{ $t("TEXTS.item") }}</h5>

      <h5 class="col-span-3 text-sub">{{ $t("TEXTS.amount") }}</h5>
    </div>

    <div class="px-2 overflow-y-auto max-h-[500px] mt-3">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="grid grid-cols-12 items-center border-b border-line last-of-type:!border-none py-3"
      >
        <div class="col-span-9 flex items-center gap-3">
          <img :src="item.image" class="w-[56px] h-[56px] rounded-full" />

          <div class="flex flex-col items-start gap-2">
            <h5 class="font-medium text-[#171717]">
              {{ item.name || item.item_name }}
            </h5>

            <p class="text-sm font-light text-sub">
              {{ item.sales }}
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
