<template>
  <div class="my-5 mx-3">
    <h3 class="font-bold text-xl mb-1">#{{ item.id }}</h3>
    <div class="border-b border-line">
      <div
        class="md:w-[80%] grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 pb-4 gap-y-2"
      >
        <div class="flex gap-2 items-center">
          <svg-icon name="calendar" />
          <p class="text-sub">{{ $t("LABELS.Date") }}:</p>
          <p>{{ item.date }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <svg-icon name="OrderType" />
          <p class="text-sub">{{ $t("LABELS.Order Type") }}:</p>
          <p>{{ item.type }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <svg-icon name="store1" />
          <p class="text-sub">{{ $t("TITLES.store") }}:</p>
          <p>{{ item.store }}</p>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <p class="text-sub capitalize">{{ $t("LABELS.items") }}</p>
      <div
        class="md:w-[80%] grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mt-2 items-center"
      >
        <div
          v-for="i in item.items"
          :key="i.id"
          class="flex gap-2 items-center"
        >
          <img
            :src="i.image"
            :alt="i.name"
            class="w-[56px] h-[56px] rounded-md object-cover"
          />
          <div>
            <p class="font-semibold">{{ i.name }}</p>
            <div class="flex gap-1">
              <!-- change rating -->
              <svg-icon
                name="star"
                v-for="(i, index) in parseInt(i.rating)"
                :key="index"
              />
              <svg-icon
                name="star-gray"
                v-for="(i, index) in parseInt(5 - i.rating)"
                :key="index"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    required: true,
  },
});
</script>
