<template>
  <div
    class="single-select card w-full flex justify-content-center overflow-hidden"
  >
    <VeeField type="select" :name="name" v-slot="{ meta }">
      <div
        class="input_wrapper w-full"
        :class="{
          error: !meta.valid && meta.touched,
        }"
      >
        <label v-if="label" :for="id" class="label"
          >{{ label }}
          <span v-if="isOptional" class="text-[#BDC1DF]"
            >({{ $t("LABELS.optional") }})</span
          ></label
        >
        <div class="with_icon">
          <input-icon class="icon" v-if="icon" :name="icon" />

          <Dropdown
            :loading="loading"
            v-model="selected"
            :options="items"
            @change="updateValue"
            :optionLabel="optionLabel"
            :placeholder="$t('LABELS.choose')"
          />
        </div>
        <div class="mt-1 flex items-center gap-2 flex-wrap">
          <div
            class="label-selected"
            v-for="(item, indx) in selectedItems"
            :key="item.id"
          >
            {{ item.name || item.full_name }}
            <Deleter
              url="delete_availability"
              :id="item.availability_id"
              :modal-type="modalName"
              icon="fas fa-times"
              @remove="removeDay(item, indx)"
              v-if="item.availability_id"
            />
            <button v-else type="button" @click="removeDay(item, indx)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <VeeErrorMessage :name="name" as="div" class="text-red-500" />
      </div>
    </VeeField>
  </div>
</template>

<script setup>
import Dropdown from "primevue/dropdown";
import { useField } from "vee-validate";
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
  name: {
    type: String,
    required: true,
  },

  itemValue: {
    required: true,
  },
  modalName: {
    required: true,
  },

  loading: {
    required: false,
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
  isOptional: {
    required: false,
    default: false,
  },
});

const allItems = ref([]);
const items = ref([]);
const selected = ref(null);
const selectedItems = ref([]);
const fieldValue = useField(props.name);

watch(
  () => props.options,
  () => {
    allItems.value = props.options;
    items.value = props.options;
    if (selectedItems.value.length) setOptions();
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(
  () => props.itemValue,
  (value) => {
    if (value) {
      selectedItems.value = value;
      if (items.value.length) setOptions();
      if (value.length) fieldValue.setValue(value);
    }
  },
  {
    immediate: true,
  }
);

function setOptions() {
  let avItems = [];
  items.value.map((el) => {
    selectedItems.value.map((item) => {
      if (el.id == item.id && el.name == item.name) {
        avItems.push(el);
      }
    });
  });
  // items.value = avItems;
  items.value = items.value.filter((el) => !avItems.includes(el));
}

const emit = defineEmits(["update:itemValue", "change"]);

function updateValue(e) {
  setItems(e.value);
}

function setItems(e) {
  let found;
  selectedItems.value.map((main) => {
    if (
      main.id === selected.value.id &&
      main.name === selected.value.name &&
      main.type === selected.value.type
    ) {
      found = main;
    }
  });

  if (!found) {
    selectedItems.value.push(e);

    items.value = items.value.filter((el) => el.name != e.name);
  } else {
    items.value = items.value.filter((el) => el.name != e.name);
  }
  selected.value = null;
  setValues();
}

function removeDay(item, indx) {
  let found;
  allItems.value.map((el) => {
    if (item.id === el.id && item.name === el.name && item.type === el.type) {
      found = el;
    }
  });
  if (found) {
    items.value.push(found);
  }
  selectedItems.value.splice(indx, 1);
  setValues();
}

function setValues() {
  emit("update:itemValue", selectedItems.value);
  emit("change", selectedItems.value);

  fieldValue.setValue(selectedItems.value);
}
</script>

<style>
.p-dropdown-label.p-inputtext {
  display: flex;
  align-items: center;
}
</style>
