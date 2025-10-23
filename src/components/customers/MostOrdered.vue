<template>
  <base-card class="space-y-3">
    <h2 class="font-semibold text-xl">{{ $t("LABELS.Most Ordered Items") }}</h2>
    <div class="h-[334px] overflow-y-auto space-y-3">
      <div
        class="flex gap-2 border-b border-line last:border-none pb-3 items-center"
        v-for="item in items"
        :key="item.id"
      >
        <div>
          <img
            :src="item.image"
            :alt="item.name"
            class="rounded-md w-[56px] h-[56px] object-cover"
          />
        </div>
        <div>
          <h2 class="font-medium">{{ item.name }}</h2>
          <p class="text-sub">{{ item.paid_amount }} {{ $t("LABELS.Sales") }}</p>
        </div>
      </div>
    </div>
  </base-card>
</template>

<script setup>
defineProps({
  items: {
    required: true,
  },
});
</script>
