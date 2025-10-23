<template>
  <div class="cart_product_sliders" v-if="!loading">
    <swiper
      :modules="[Autoplay, Pagination, A11y]"
      :slides-per-view="1"
      class="h-[116px] w-[123px]"
      :autoplay="{
        delay: 8000,
        disableOnInteraction: true,
      }"
      :pagination="{ clickable: true, dynamicBullets: true }"
    >
      <swiper-slide class="rounded-lg" v-for="image in images" :key="image">
        <img
          loading="lazy"
          format="webp"
          class="h-[116px] w-[123px] rounded-lg object-cover"
          height="116"
          width="123"
          quality="90"
          :src="image"
          :alt="product.name"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { ref, onBeforeMount } from "vue";
const loading = ref(true);
const props = defineProps({
  product: {
    required: true,
  },
});
const images = ref([]);

onBeforeMount(() => {
  props.product.images.map((image) => images.value.push(image.media));
  images.value.unshift(props.product.main_image);

  setTimeout(() => (loading.value = false), 100);
});
</script>

<style lang="scss">
.cart_product_sliders {
  .swiper-pagination-bullet {
    bottom: 0 !important;
    @apply size-2 rounded-full bg-primary  text-xl   font-bold text-text;
    &.swiper-pagination-bullet-active {
      @apply w-4;
    }
  }
}
</style>
