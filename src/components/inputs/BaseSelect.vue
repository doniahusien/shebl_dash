<template>
  <VeeField :name="name" v-slot="{ meta }">
    <div
      class="input_wrapper relative"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label capitalize" v-if="label">{{ label }}
        <span v-if="optional" class="text-gray-500 text-xs"> ( {{$t('LABELS.optional')}} )</span>
      </label>
      <div>
        <div :class="icon ? 'with_icon' : ''" class="h-[50px]">
          <svg-icon class="icon" v-if="icon" :name="icon" />

          <MultiSelect
            :disabled="disabled"
            :id="id"
            :class="classes"
            :loading="sLoading"
            v-if="multiple"
            :name="name"
            :display="display"
            :hide-selected="true"
            :options="statics"
            :optionLabel="optionLabel"
            :optionDisabled="'disabled'"
            :placeholder="placeholder"
            :filter="filter"
            @change="updateValue"
            :filterFields="['name', 'email', 'question']"
            filterPlaceholder="Search.."
            :emptyFilterMessage="emptyFilterMessage"
            dataKey="id"
            v-model="selectedValue"
          >
          </MultiSelect>
          <Dropdown
            :disabled="disabled"
            @change="updateValue"
            :id="id"
            :class="classes"
            :loading="sLoading"
            :name="name"
            :options="statics"
            :optionLabel="optionLabel"
            :optionDisabled="'disabled'"
            optionValue="id"
            :placeholder="placeholder"
            :showClear="showClear"
            dataKey="id"
            :filter="filter"
            v-else
            v-model="selectedValue"
          >
            <template #option="slotProps">
              <label
                :for="slotProps.option.id"
                class="text-text font-semibold flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="radio"
                  v-model="selectedValue"
                  :value="slotProps.option.id"
                  class="me-3 w-5 h-5"
                />
                <span>
                  {{ slotProps.option.name ?? slotProps.option[optionLabel] }}
                </span>
                <span v-if="customName">
                  - {{ slotProps.option[customName] }}</span
                >
                <span v-if="customIcon">{{ " " + customIcon }}</span>
              </label>
            </template>
          </Dropdown>
        </div>
        <VeeErrorMessage
          v-if="!meta.valid && meta.touched"
          :name="name"
          as="div"
          class="text-red-500"
        />
      </div>
    </div>
  </VeeField>
</template>

<script setup>
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import axios from "axios";
import { onMounted, ref, watch } from "vue";

import { useField } from "vee-validate";

const props = defineProps({
  itemValue: {
    requred: true,
  },
  item: {
    requred: false,
  },
  emptyFilterMessage: {
    requred: false,
    default: "No items Found",
  },
  display: {
    requred: false,
  },
  customName: {
    requred: false,
  },
  customIcon: {
    requred: false,
  },
  showClear: {
    requred: false,
    default: true,
  },
  classes: {
    requred: false,
  },
  id: {
    requred: true,
  },
  optionLabel: {
    requred: false,
    default: "name",
  },
  loading: {
    requred: false,
  },
  name: {
    requred: true,
  },
  placeholder: {
    requred: false,
  },
  label: {
    requred: false,
  },
  url: {
    requred: false,
  },
  baseUrl: {
    requred: false,
  },
  icon: {
    requred: false,
  },
  filter: {
    requred: false,
  },
  disabled: {
    requred: false,
  },
  options: {
    requred: false,
  },
  multiple: {
    requred: false,
    default: false,
  },
  optionDisabled: {
    required: false,
  },
  optional: {
    required: false,
    default: false,
  },
});

const inputField = useField(props.name);

// import {locale} from ''

const sLoading = ref(false);

const selectedValue = ref(null);

const emit = defineEmits(["update:itemValue", "update:item", "change"]);

const updateValue = (event) => {
  const item = statics.value.find((el) => el.id == event.value);
  emit("update:itemValue", event.value);
  emit("update:item", item);

  if (!event.value) {
    if (props.multiple) {
      inputField.setValue([]);
    } else {
      inputField.setValue(null);
    }
  } else {
    inputField.setValue(event.value);
  }
  emit("change", event.value);
};

const statics = ref([]);
function getStatics() {
  sLoading.value = true;
  if (props.options) {
    statics.value = props.options;

    if (props.itemValue) {
      selectedValue.value = props.itemValue;
    }
    sLoading.value = false;
    return;
  }
  if (statics.value.length) return;

  axios({
    method: "GET",
    url: props.url,
    baseURL: props.baseUrl ? props.baseUrl : axios.defaults.baseURL,
  })
    .then((res) => {
      statics.value = res.data.data.map((el) => ({
        ...el,
        label: el[props.optionLabel] ?? el.name,
      }));

      if (Array.isArray(props.itemValue)) {
        selectedValue.value = [];
        res.data.data.map((el) => {
          props.itemValue.map((sub) => {
            if (el.id == sub) {
              selectedValue.value.push(el);
            }
          });
        });

        inputField.setValue(selectedValue.value);
      } else {
        if (props.itemValue) {
          const item = statics.value.find((el) => el.id == props.itemValue);

          emit("update:item", item);
          selectedValue.value = props.itemValue;
        }
      }
      sLoading.value = false;
    })
    .catch(() => (sLoading.value = false));
}

watch(
  () => props.itemValue,
  (newVal) => {
    if (newVal) {
      if (statics.value.length) return;
      getStatics();
    }
  },
  {
    deep: true,
  }
);
watch(
  () => props.options,
  (newVal) => {
    if (newVal) {
      statics.value = newVal;
      if (!props.itemValue) {
        selectedValue.value = props.multiple ? [] : null;
        inputField.setValue(selectedValue.value);
      }
    }
  },
  { deep: true }
);

watch(
  () => props.loading,
  () => {
    sLoading.value = props.loading;
  },
  {
    deep: true,
  }
);
watch(
  () => props.url,
  () => {
    statics.value = [];
    getStatics();
  }
);

watch(
  () => props.itemValue,
  (val) => {
    if (props.multiple) {
      selectedValue.value = Array.isArray(val) ? val : [];
      inputField.setValue(selectedValue.value);
    } else {
      selectedValue.value = val ?? null; // clears the dropdown when ""
      inputField.setValue(selectedValue.value);
    }
  },
  { immediate: true, deep: true }
);


onMounted(() => {
  getStatics();
});
</script>

<style lang="scss">
.p-input-icon-left {
  i {
    z-index: 10;
  }
  .p-dropdown,
  .p-multiselect {
    width: 200px;
  }
  // .p-dropdown-label,
  // .p-multiselect-label {
  //   padding-inline-start: 2rem !important;
  // }
}
</style>
