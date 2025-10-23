<template>
  <div
    v-if="item"
    class="relative flex cursor-pointer rounded-xl px-5 border border-[#F1F1FF] focus:outline-none bg-white"
  >
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center justify-between w-full">
        <div>
          <p class="font-medium">
            <!-- :class="checked ? 'text-primary' : 'text-gray-900'" -->
            {{ item.name ?? "" }}
            <span v-if="item.price">
              ({{
                "+" + (item.price.price ?? 0) + " " + item.price.currency
              }})</span
            >
          </p>
          <!-- <span class="inline">

            <span class="!text-primary">({{ item.size }} gm)</span>
          </span> -->
        </div>
        <div>
          <div
            class="rounded-xl w-[124px] h-[64px] flex items-center justify-between"
          >
            <button
              type="button"
              class="minus-btn"
              @click="descreaseCounter"
              :disabled="counter <= 0"
              :id="item.name"
              :name="item.name"
            >
              <!-- <font-awesome-icon :icon="['fas', 'minus']" /> -->
              <i class="fas fa-minus"></i>
            </button>
            <span class="font-bold text-[20px]">
              {{ counter }}
            </span>

            <button
              type="button"
              class="plus-btn"
              :disabled="max == 0"
              @click="increaseCounter"
            >
              <!-- :disabled="counter == items.quantity" -->
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed } from "vue";
// import { useField } from "vee-validate";
const emit = defineEmits([
  "update:itemValue",
  "update:quantity",
  "increaseQuantity",
  "desceaseQuantity",
]);

const props = defineProps({
  item: {
    required: true,
  },

  itemValue: {
    requred: true,
  },
  quantity: {
    requred: false,
  },
  maxQty: {
    required: true,
  },
});

const max = computed(() => props.maxQty);

const counter = ref(props.itemValue || 0);
const currentValue = ref(null);

function increaseCounter(option) {
  counter.value++;
  currentValue.value = counter.value;
  emit("update:itemValue", currentValue.value);
  emit("update:quantity", counter.value);
  emit("increaseQuantity");
}
function descreaseCounter(option) {
  counter.value--;
  currentValue.value = counter.value;
  emit("update:itemValue", currentValue.value);
  emit("update:quantity", counter.value);
  emit("desceaseQuantity");
}
</script>
<style lang="scss">
.minus-btn {
  @apply text-primary border rounded  w-8 h-8  flex items-center justify-center p-3 disabled:text-[#BDC1DF];
}
.plus-btn {
  @apply text-white bg-primary rounded flex items-center justify-center p-3 w-8 h-8 disabled:text-[#BDC1DF];
}
</style>
