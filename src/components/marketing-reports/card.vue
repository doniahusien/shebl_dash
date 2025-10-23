<template>
  <div class="border border-line rounded-xl px-6 py-8">
    <div class="flex gap-3">
      <!-- <img :src="item.image" :alt="item.title" /> -->
      <div
        class="bg-[#F3F5FD] rounded-full w-[40px] h-[40px] flex items-center justify-center"
      >
        <svg-icon :name="item.image" />
      </div>
      <div>
        <p>{{ item.title }}</p>
        <h4 class="font-semibold text-2xl">{{ item.number }}</h4>
      </div>
    </div>
    <router-link
      to="/"
      class="text-primary font-medium flex gap-2 items-center mt-4"
      >{{ $t("BUTTONS.view all") }}
      <i
        :class="`fa-solid fa-arrow-${$i18n.locale === 'ar' ? 'left' : 'right'}`"
      />
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  item: {
    required: true,
  },
});
</script>
