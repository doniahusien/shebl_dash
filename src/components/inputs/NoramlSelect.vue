<template>
  <div
    class="single-select card w-full flex justify-content-center overflow-hidden"
  >
    <div class="input_wrapper w-full">
      <label v-if="label" :for="id" class="label">{{ label }}</label>

      <div class="with_icon">
        <input-icon class="icon" v-if="icon" :name="icon" />

        <Dropdown
          :filter="filter"
          :loading="loading"
          v-model="selected"
          :options="items"
          @change="updateValue"
          :optionLabel="optionLabel"
          :placeholder="$t('LABELS.choose')"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Dropdown from "primevue/dropdown";
import { ref, watch } from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: false,
    default: null,
  },
  label: {
    required: false,
  },
  options: {
    type: Object,
    required: true,
    default: null,
  },
  disabled: {
    required: false,
    default: false
  },
  loading: {
    required: false,
  },
  filter: {
    required: false,
    default: false,
  },

  id: {
    type: String,
    required: true,
    default: null,
  },
  optionLabel: {
    required: false,
    default: "name",
  },
});
const items = ref([]);
const selected = ref(null);

watch(
  () => props.options,
  () => (items.value = props.options),
  {
    deep: true,
    immediate: true,
  }
);
const emit = defineEmits(["change"]);

function updateValue(e) {
  emit("change", e.value);
  selected.value = null;
}
</script>

<style>
.p-dropdown-label.p-inputtext {
  display: flex;
  align-items: center;
}
</style>
