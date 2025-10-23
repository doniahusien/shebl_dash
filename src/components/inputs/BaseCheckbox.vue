<template>
  <loader v-if="sLoading" />

  <template v-else>
    <div class="input_wrapper">
      <Disclosure
        v-slot="{ open }"
        as="div"
        class="border border-line rounded-xl"
      >
        <DisclosureButton as="div">
          <button
            type="button"
            class="flex items-center justify-between gap-2 w-full px-3 py-4"
            @click="getItems(item.id)"
          >
            <div class="flex items-center gap-2">
              <button
                class="w-6 h-6 flex items-center"
                type="button"
                @click.stop="handleCheckbox"
              >
                <i
                  class="fa-solid fa-square-check text-primary text-xl"
                  v-if="
                    isItems &&
                    items.length &&
                    items.length == selectedValue.length
                  "
                ></i>
                <i
                  v-if="!selectedValue.length"
                  class="mdi mdi-checkbox-blank-outline text-sub text-2xl"
                ></i>
                <i
                  v-if="
                    selectedValue.length && selectedValue.length != items.length
                  "
                  class="mdi mdi-minus-box-outline text-xl text-primary opacity-60"
                ></i>
              </button>

              <span class="font-semibold">
                {{ item.name }}
              </span>
            </div>
            <i v-if="open" class="text-primary fa-solid fa-angle-up"></i>
            <i v-if="!open" class="text-primary fa-solid fa-angle-down"></i>
          </button>
        </DisclosureButton>
        <DisclosurePanel
          class="font-bold ps-10 pe-2 pb-2 last:pb-0 max-h-[200px] overflow-y-auto"
        >
          <loader v-if="tLoading" />

          <template v-if="items.length">
            <div v-for="item in items" :key="item.id">
              <v-checkbox
                :key="item.id"
                :value="item.id"
                v-model="selectedValue"
                name="category"
                @input="updateValue($event, item)"
              >
                <template v-slot:label>
                  <div class="flex flex-wrap gap-2">
                    <img
                      width="40"
                      height="36"
                      class="h-[36px]"
                      :src="item.image"
                      :alt="item.name"
                      v-if="!props.subOptions"
                    />
                    <span class="flex items-center font-medium text-text">
                      {{ item.name }}</span
                    >
                  </div>
                </template>
              </v-checkbox>
            </div>
          </template>
          <div v-else class="text-center pb-3">
            {{ $t("LABELS.noProducts") }}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </template>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useField } from "vee-validate";

import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps({
  itemValue: {
    requred: true,
  },
  selectedItems: {
    requred: false,
  },
  classes: {
    requred: false,
  },
  id: {
    requred: true,
  },
  loading: {
    requred: false,
  },
  item: {
    requred: true,
  },
  secondUrl: {
    requred: false,
  },
  baseUrl: {
    requred: false,
  },
  icon: {
    requred: false,
  },
  secondProducts: {
    requred: false,
    default: false,
  },
  subOptions: {
    requred: false,
  },
});

const isItems = ref(false);

const { locale } = useI18n();
const sLoading = ref(false);
const tLoading = ref(false);
const selectedValue = ref([]);
const emit = defineEmits([
  "update:itemValue",
  "update:selectedItems",
  "change",
  "reset",
]);

const allSelectedItems = ref([]);

const updateValue = (event, item) => {
  const found = allSelectedItems.value.find((el) => el.id == item.id);
  if (found) {
    allSelectedItems.value = allSelectedItems.value.filter(
      (el) => el.id != found.id
    );
  } else {
    allSelectedItems.value.push(item);
  }

  emit("change", selectedValue.value);
  emit("update:itemValue", selectedValue.value);
  emit("update:selectedItems", allSelectedItems.value);
};

function handleCheckbox() {
  if (!isItems.value) {
    getItems(props.item?.id, "fromHandle");
    return;
  }
  if (items.value.length > selectedValue.value.length) {
    allSelectedItems.value = items.value;
    selectedValue.value = items.value.map((el) => el.id);
    emit("change", selectedValue.value);
    emit("update:selectedItems", allSelectedItems.value);
  } else if (items.value.length == selectedValue.value.length) {
    // emit("change", selectedValue.value);
    selectedValue.value = [];
    allSelectedItems.value = [];
    emit("reset", selectedValue.value);
    emit("update:selectedItems", allSelectedItems.value);
  }
}
const items = ref([]);
function getItems(id, fromHandle) {
  if (props.secondProducts) {
    selectedValue.value = props.subOptions;
    items.value = selectedValue.value.map((el) => ({
      id: el.id,
      name: el.name,
    }));

    if (Array.isArray(props.itemValue)) {
      selectedValue.value = [];
      selectedValue.value.map((el) => {
        props.itemValue.map((sub, index) => {
          if (el.id == sub) {
            selectedValue.value.push(el.id);
          }
        });
      });

      emit("change", selectedValue.value);
      // emit("update:itemValue", selectedValue.value);
    } else {
      if (props.itemValue) {
        selectedValue.value = props.itemValue;
      }
    }
    // emit("change", selectedValue.value);
    isItems.value = true;
    tLoading.value = true;

    if (items.value.length) {
      tLoading.value = false;
      return;
    }
  } else {
    const params = new URLSearchParams();
    if (route.path.includes("menu-items")) {
      if (route.params.id) {
        params.append("product_id", route.params.id);
      }
    }

    axios
      .get(`${props.secondUrl}${id}`, {
        params: params,
      })
      .then((res) => {
        items.value = res.data.data.map((el) => ({
          id: el.id,
          name: el.name,
          image: el.image,
        }));
        if (Array.isArray(props.itemValue)) {
          selectedValue.value = [];
          res.data.data.map((el) => {
            props.itemValue.map((sub, index) => {
              if (el.id == sub) {
                selectedValue.value.push(el.id);
              }
            });
          });

          emit("change", selectedValue.value);
          // emit("update:itemValue", selectedValue.value);
        } else {
          if (props.itemValue) {
            selectedValue.value = props.itemValue;
          }
        }
        if (fromHandle) {
          handleCheckbox();
        }
        tLoading.value = false;
      })
      .catch(() => (tLoading.value = false));
  }
}

watch(
  () => props.loading,
  () => {
    sLoading.value = props.loading;
  },
  {
    deep: true,
  }
);
onMounted(() => {
  if (props.itemValue) {
    selectedValue.value = props.itemValue;
    allSelectedItems.value = props.selectedItems ?? [];
  }
});
// watch(
//   () => props.itemValue,
//   () => {
//   },
//   {
//     immediate: true,
//   }
// );
</script>

<style lang="scss">
.p-input-icon-left {
  i {
    z-index: 10;
  }
}
.v-selection-control .v-label {
  height: auto !important;
}
</style>
