<template>
  <div class="cart-product" v-if="product">
    <div>
      <cart-images-swiper :product="product" />
    </div>
    <div class="">
      <p class="text-sm text-[#707070]">
        {{ product.main_category.name }} - {{ product.sub_category.name }}
      </p>
      <h5 class="text-lg font-bold">{{ product.name }}</h5>
      <p class="flex items-center gap-1">
        <span class="text-[#757575]">{{ $t("LABELS.ProductSize") }}</span>
        {{ product.size_value }}
        {{ product.size?.name }}
      </p>
      <p class="text-text">
        <span v-for="(brand, index) in product.brands" :key="brand.id">
          {{ brand.name }}
          <template v-if="product.brands.length != index + 1">-</template>
        </span>
      </p>
    </div>
    <div>
      <p class="text-[#B3B3B3]">{{ $t("TEXT.Trial price") }}</p>
      <p class="flex items-center text-xl font-bold text-red-500">
        {{ product.price }} {{ $t("SAR") }}
      </p>
    </div>
    <div
      class="min-w-[80px] rounded-full border border-[#D1D1D1] px-4 py-3 text-center"
    >
      <p class="text-lg font-bold text-[#757575]">
        {{ $t("LABELS.Quantity") }} {{ product.quantity }}
      </p>
    </div>

    <button type="button" @click="confirmModal = true" v-if="!checkout">
      <nuxt-icon :filled="true" name="trash" class="text-2xl" />
    </button>

    <nuxt-link
      v-if="!checkout"
      :to="
        localePath(
          `/deals/new-deal/${$route.params.deal_id}/add-product/${product.id}`
        )
      "
    >
      <nuxt-icon :filled="true" name="edit" class="text-2xl text-text" />
    </nuxt-link>
    <teleport to="body">
      <ConfirmModal
        v-if="confirmModal"
        :title="$t('TITLES.removeProduct')"
        :desc="$t('TITLES.removeProductDesc')"
        :confirm-btn="$t('BUTTONS.yesRemove')"
        @close="confirmModal = close"
        :loading="removerLoading"
        @confirm="removeProduct(product.id)"
      />
    </teleport>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();
const axios = useNuxtApp().$axios;

const props = defineProps({
  product: {
    required: true,
    type: Object,
  },
  checkout: {
    required: false,
    type: Boolean,
  },
});
const localePath = useLocalePath();
const product = toRef(props.product);
const removerLoading = ref(false);

const confirmModal = ref(false);
const emit = defineEmits(["remove"]);

function removeProduct(id) {
  removerLoading.value = true;
  axios
    .post("delete_product_deal/" + id)
    .then((res) => {
      removerLoading.value = false;
      confirmModal.value = false;
      toast.success(res.data.message);
      emit("remove");
    })
    .catch((e) => {
      removerLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function handleSubmit(values) {
  console.log(quantity.value);
  // emit("submit", values);
}
</script>

<style lang="scss">
.cart-product {
  @apply flex  flex-wrap items-center justify-between gap-2 rounded-3xl border border-line bg-white p-5;
}
</style>
