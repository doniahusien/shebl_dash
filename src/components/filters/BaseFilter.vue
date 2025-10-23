<template>
  <div class="filter flex gap-3 items-center flex-wrap mb-4" v-if="filterReady">
<!--     <form
      @submit.prevent="setFilter"
      class="flex items-center flex-grow flex-wrap gap-2 justify-between"
    >
      <div
        v-if="keyword"
        class="input_wrapper mb-0 w-full max-w-[400px]"
        :class="keywordClass"
      >
        <div class="relative">
          <i
            class="fa-solid fa-magnifying-glass text-primary absolute top-1/2 -translate-y-1/2 inset-xe"
          />

          <input
            :placeholder="
              $t(`LABELS.searchFor`, { name: $t(`LABELS.${name}`) })
            "
            type="text"
            id="search1"
            autocomplete="off"
            class="pe-9 bg-white"
            @change="setFilter"
            v-model="form[props.keywordQuery]"
          />
        </div>
      </div>

      <div
        v-if="inputs.length"
        class="flex items-center flex-grow flex-wrap gap-2 justify-end"
        :class="filterClass"
      >
        <h3 v-if="!hideLabel" class="text-text font-medium">
          {{ t("Filter by") }}
        </h3>

        <div class="input_wrapper mb-0" v-for="item in inputs" :key="item.name">
          <div
            class="p-input-icon-left flex items-center gap-x-2"
            v-if="item.type == 'select'"
          >
            <h3 v-if="item.label" class="text-text font-medium">
              {{ t(item.label) }}
            </h3>

            <BaseSelect
              v-model:itemValue="form[item.name]"
              :item="item"
              @change="setFilter"
              :search="item.canSearch"
              :label="item.label"
              :optionLabel="item.optionLabel"
              :secSelect="item.secSelect"
            />
          </div>

          <div class="p-input-icon-left" v-else-if="item.type == 'date'">
            <BaseDate
              v-model:itemValue="form[item.name]"
              id="from"
              :label="item.label"
              :placeholder="$t(`LABELS.${item.placeholder}`)"
              @change="setDateFilter($event, item.name)"
              :maxDate="item.maxDate"
              :monthPicker="item.monthPicker"
              :yearPicker="item.yearPicker"
              :dateRange="item.dateRange"
            />
          </div>

          <div class="p-input-icon-left" v-else>
            <i :class="item.icon" v-if="item.icon" />

            <input
              :placeholder="$t(`LABELS.${item.placeholder}`)"
              type="text"
              id="search"
              name="search"
              v-model="form[item.name]"
              @change="setFilter"
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <div v-if="title">
        <p class="font-semibold text-2xl">{{ title }}</p>
      </div>
    </form>
 -->
    <div class="flex w-fit gap-2 items-center flex-wrap ms-auto mt-auto mb-1">
      <slot name="button"></slot>

      <button
        v-if="btnName && canStore"
        type="button"
        class="base-btn rounded-xl self-end"
        @click="$emit('action')"
        :class="btnClass"
      >
        <i v-if="icon" :class="icon"></i>
        {{ btnName }}
      </button>
    </div>
  </div>
</template>

<script setup>
import BaseSelect from "./BaseSelect.vue";
import BaseDate from "./BaseDate.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();

const route = useRoute();

const props = defineProps({
  inputs: {
    required: true,
  },
  label: {
    required: false,
  },
  btnName: {
    required: false,
  },
  icon: {
    required: false,
  },
  canStore: {
    required: false,
    default: true,
  },
  name: {
    required: false,
  },
  keywordClass: {
    required: false,
  },
  keyword: {
    default: false,
    required: false,
  },
  filterClass: {
    default: false,
    required: false,
  },
  keywordQuery: {
    required: false,
    default: "keyword",
  },
  hideLabel: {
    type: Boolean,
    required: false,
    default: false,
  },
  btnClass: {
    required: false,
  },
  title: {
    required: false,
    default: false,
  },
  dateRange: {
    required: false,
    default: false,
  },
  secSelect: {
    required: false,
    default: false,
  },
});

const filterReady = ref(false);

const form = reactive({});

function setFilter() {
  let obj = {};

  for (const [key, value] of Object.entries(form)) {
    if (Array.isArray(value)) {
      if (value.length) {
        let val = value.map((el) => el.id);

        obj[key] = JSON.stringify(val);
      } else obj[key] = "";
    } else if (key == "date") {
      if (value) obj[key] = JSON.stringify(value);
    } else {
      if (value || value == "") obj[key] = value;
    }
  }

  router
    .push({
      query: Object.assign({}, route.query, {
        page: 1,

        ...obj,
      }),
    })
    .catch(() => {});
}

function setDateFilter(e, name) {
  router
    .push({
      query: Object.assign({}, route.query, {
        page: 1,
        [name]: e,
      }),
    })
    .catch(() => {});
}

function IsJsonString(str) {
  try {
    let json = JSON.parse(str);

    return typeof json === "object";
  } catch (e) {
    return false;
  }
}

watch(
  () => route.query,
  () => {
    if (props.keyword) {
      form[props.keywordQuery] = route.query[props.keywordQuery] || "";
    }
  }
);

onMounted(() => {
  if (props.keyword) {
    form[props.keywordQuery] = route.query[props.keywordQuery] || "";
  }

  let names = [];

  if (props.inputs.length) {
    props.inputs.map((el) => {
      form[el.name] = el.filter;
      names.push(el.name);
    });
  }

  if (route.query) {
    names.map((el) => {
      for (const [key, value] of Object.entries(route.query)) {
        if (el == key) {
          if (IsJsonString(value)) {
            form[el] = JSON.parse(value);
          } else {
            form[el] = value ?? "";
          }
        }
      }
    });
  }

  filterReady.value = true;
});
</script>

<style>
.inset-xe {
  inset-inline-end: 1rem;
}
</style>
