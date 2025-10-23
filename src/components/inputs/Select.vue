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
        <label v-if="label" :for="id" class="label">{{ label }}</label>
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
          <span
            class="label-selected"
            v-for="item in selectedItems"
            :key="item.id"
          >
            <img
              v-if="withImg"
              width="30"
              height="30"
              class="w-[30px] h-[30px] rounded-full"
              :src="item.image || item.avatar"
              :alt="item.name || item.full_name"
            />
            {{ item.name || item.full_name }}
            <button type="button" @click="removeDay(item)">
              <i class="fas fa-times"></i>
            </button>
          </span>
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
  withImg: {
    type: Boolean,
    required: false,
  },

  itemValue: {
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
});
const items = ref([]);
const selected = ref(null);
const selectedItems = ref([]);
const fieldValue = useField(props.name);

watch(
  () => props.options,
  () => (items.value = props.options),
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

      if (value.length) fieldValue.setValue(value);
    }
  },
  {
    immediate: true,
  }
);

const emit = defineEmits(["update:itemValue", "change"]);

function updateValue(e) {
  setItems(e.value);
}

function setItems(e) {
  let found;
  if (props.name == "availabilities") {
    selectedItems.value.map((main) => {
      if (main.name === selected.value.name) {
        if (selected.value.type === main.type) {
          found = main;
        }
      }
    });
  } else {
    found = selectedItems.value.find((el) => el.id == e.id);
  }

  if (!found) {
    selectedItems.value.push(e);
    if (props.name != "availabilities") {
      items.value = items.value.filter((el) => el.id != e.id);
    }
  } else {
    if (props.name != "availabilities") {
      items.value = items.value.filter((el) => el.id != found.id);
    }
  }
  selected.value = null;
  setValues();
}

function removeDay(item) {
  if (props.name != "availabilities") {
    items.value.push(item);
  }
  selectedItems.value = selectedItems.value.filter((el) => el.id != item.id);

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
