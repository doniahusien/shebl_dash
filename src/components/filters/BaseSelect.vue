<template>
  <div class="input_wrapper mb-0">
    <div
      :class="
        item.icon
          ? ($i18n.locale = 'en' ? 'p-input-icon-right' : 'p-input-icon-left')
          : ''
      "
    >
      <i :class="item.icon" v-if="item.icon" />
      <Dropdown
        :class="classes"
        :loading="loading"
        v-model="selectedValue"
        @before-show="getStatics"
        @change="updateValue"
        :options="statics"
        :optionLabel="optionLabel"
        class="filter_select"
        optionValue="id"
        :placeholder="$t(`LABELS.${item.placeholder}`)"
        dataKey="id"
        :filter="search"
        v-if="!item.multiple"
      >
        <template #option="slotProps">
          <label
            :for="slotProps.option.id"
            class="text-text font-semibold flex items-center cursor-pointer"
          >
            <input
              type="radio"
              v-model="selectedValue"
              :value="slotProps.option.id"
              class="me-3 w-5 h-5"
            />
            {{
              slotProps.option.name ||
              slotProps.option.title ||
              slotProps.option.full_name
            }}
          </label>
        </template>
      </Dropdown>

      <MultiSelect
        :class="classes"
        @before-show="getStatics"
        :loading="loading"
        v-else
        id="users"
        v-model="selectedValue"
        display="chip"
        :options="statics"
        :optionLabel="optionLabel"
        @change="updateValue"
        :placeholder="$t(`LABELS.${item.placeholder}`)"
        class="w-full"
        filter
        :filterFields="['name', 'email', 'full_name']"
        filterPlaceholder="Search.."
        emptyFilterMessage="No items found"
        dataKey="id"
      >
      </MultiSelect>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const loading = ref(false);
const route = useRoute();
const props = defineProps({
  itemValue: {
    requred: true,
  },
  item: {
    requred: true,
  },
  classes: {
    requred: false,
  },
  search: {
    requred: false,
    default: true,
  },
  optionLabel: {
    requred: false,
    default: "name",
  },
  secSelect: {
    requred: false,
    default: false,
  },
});

const selectedValue = ref("");

const emit = defineEmits(["update:itemValue", "change"]);

const updateValue = (event) => {
  emit("update:itemValue", event.value);
  emit("change");
};
const statics = ref([]);
function getStatics() {
  if (props.item.options) {
    statics.value = props.item.options;
    if (props.itemValue || props.itemValue == 0) {
      const found = statics.value.find((el) => el.id === props.itemValue);

      if (found) {
        selectedValue.value = found.id;
      }
    }

    return;
  }
  if (statics.value.length) return;
  loading.value = true;

  axios({
    method: "GET",
    url: props.item.url,
  })
    .then((res) => {
      statics.value = res.data.data;
      statics.value.unshift({
        id: "",
        name: t("STATUS.All"),
      });
      selectedValue.value = [];
      if (Array.isArray(props.itemValue)) {
        res.data.data.map((el) => {
          props.itemValue.map((sub) => {
            if (el.id == sub) {
              selectedValue.value.push(el);
            }
          });
        });
      } else {
        if (props.itemValue || props.itemValue == 0) {
          const found = statics.value.find((el) => el.id == props.itemValue);

          if (found) {
            selectedValue.value = found.id;
          }
        }
      }

      emit("update:itemValue", selectedValue.value);
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

watch(
  () => route.query.specialty,
  () => {
    if (props.secSelect && route.query.sub_specialty == "") {
      selectedValue.value = "";
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  getStatics();
});
</script>

<style lang="scss">
.p-input-icon-left,
.p-input-icon-right {
  i {
    z-index: 10;
  }
  .p-dropdown,
  .p-multiselect {
    width: 250px;
    @apply py-0;
  }
}
.filter_select {
  .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    background: transparent !important;
  }
}
</style>
