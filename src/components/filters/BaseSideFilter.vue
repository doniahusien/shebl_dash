<template>
  <div>
    <button type="button" @click="showFilter = true" class="export-btn">
      <svg-icon name="filter" />

      <span>{{ $t("Filter by") }}</span>
    </button>
  </div>

  <div
    v-if="showFilter"
    class="fixed top-0 w-screen left-0 h-screen"
    :class="showFilter ? 'bg-[#00000083]  z-[1007]' : '-z-10'"
  >
    <div
      class="filter mb-4 fixed top-0 w-full sm:max-w-[300px] bg-white p-3 h-screen overflow-y-auto !transition !duration-300 !ease-linear"
      v-if="filterReady"
      :class="[
        $i18n.locale == 'ar' ? '-left-[100%]' : '-right-[100%]',
        filterReady ? ($i18n.locale == 'ar' ? '!left-0' : '!right-0') : '',
      ]"
    >
      <form @submit.prevent="setFilter" class="h-full flex gap-3 flex-col">
        <div class="flex items-center gap-2 my-3">
          <button type="button" @click="showFilter = false">
            <i class="fas fa-times font-semibold text-2xl text-sub"></i>
          </button>
          <h3 v-if="!hideLabel" class="text-text font-semibold text-2xl">
            {{ t("Filter by") }}
          </h3>
          <button
            type="button"
            class="ms-auto font-semibold text-sub"
            @click="clearAll"
          >
            {{ $t("LABELS.Clear all") }}
          </button>
        </div>

        <div v-for="item in inputs" :key="item.name">
          <Disclosure
            v-slot="{ open }"
            :defaultOpen="true"
            v-if="
              (item.type == 'select' || item.type == 'tree') &&
              item.options.length
            "
          >
            <DisclosureButton
              class="flex items-center justify-between text-sub w-full mb-1"
            >
              {{ $t(`LABELS.${item.placeholder}`) }}

              <i :class="`fa-solid ${open ? 'fa-minus' : 'fa-plus'} text-xl`" />
            </DisclosureButton>

            <DisclosurePanel
              class="max-h-[300px] mt-3 ps-1 pe-2 overflow-y-auto space-y-2"
            >
              <template v-if="item.type == 'tree'">
                <el-tree-v2
                  ref="treeRef"
                  :data="item.options"
                  :props="treeProps"
                  show-checkbox
                  :height="208"
                  :default-checked-keys="defaultCheckedKeys"
                  :default-expanded-keys="defaultCheckedKeys"
                  @check-change="getCheckedNodes(item.name)"
                >
                </el-tree-v2>
              </template>

              <template v-else>
                <div v-for="option in item.options" :key="option.id">
                  <label
                    :for="item.name + '-' + option.id"
                    class="text-text font-semibold flex items-center cursor-pointer"
                  >
                    <input
                      v-if="item.multiple"
                      v-model="form[item.name]"
                      :id="item.name + '-' + option.id"
                      :name="item.name"
                      type="checkbox"
                      :value="option.id"
                      class="me-3 w-5 h-5"
                    />

                    <input
                      v-else
                      v-model="form[item.name]"
                      :id="item.name + '-' + option.id"
                      :name="item.name"
                      type="radio"
                      :value="option.id"
                      class="me-3 w-5 h-5"
                    />
                    {{ option.name }}
                  </label>
                </div>
              </template>
            </DisclosurePanel>
          </Disclosure>
          <template v-else-if="item.type == 'dropdown'">
            <base-select
              :id="item.name"
              :name="item.name"
              :label="t(`LABELS.${item.name}`)"
              :placeholder="item.placeholder"
              :icon="item.icon"
              :options="item.options"
              :filter="null"
              :multiple="false"
              v-model:itemValue="form[item.name]"
              :value="item.name"
              classes="capitalize"
            />
            <hr v-if="item.showLine" class="border border-line mt-5" />
          </template>
          <template v-else-if="item.type == 'date'">
            <BaseDate
              :min-date="item.minDate ?? new Date()"
              :id="item.name"
              :name="item.name"
              :time-picker="false"
              :icon="item.icon"
              :label="t(`LABELS.${item.name}`)"
              :placeholder="item.placeholder"
              v-model:itemValue="form[item.name]"
            />
          </template>
          <template v-else-if="item.type == 'time'">
            <BaseDate
              :id="item.name"
              :name="item.name"
              :time-picker="true"
              :icon="item.icon"
              :is24="false"
              :label="t(`LABELS.${item.name}`)"
              :placeholder="item.placeholder"
              v-model:itemValue="form[item.name]"
            />
          </template>
        </div>

        <button type="submit" class="base-btn rounded-lg w-full mt-auto">
          {{ $t("BUTTONS.apply") }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ElTreeV2 } from "element-plus";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

import { onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const treeProps = {
  value: "value",
  label: "name",
  children: "children",
};

const treeRef = ref();
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
  name: {
    required: false,
  },
  keyword: {
    default: false,
    required: false,
  },
  hideLabel: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const filterReady = ref(false);
const showFilter = ref(false);
const form = reactive({});

function setFilter() {
  let obj = {};
  for (const [key, value] of Object.entries(form)) {
    if (Array.isArray(value)) {
      obj[key] = JSON.stringify(value);
    } else if (key == "date") {
      if (value) {
        obj[key] = JSON.stringify(value);
      }
    } else {
      if (value || value == "") {
        obj[key] = value;
      }
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
  showFilter.value = false;
}

watch(
  () => props.inputs,
  () => {
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
  },
  {
    deep: true,
    immediate: true,
  }
);

function clearAll() {
  router
    .push({
      query: {
        page: 1,
      },
    })
    .catch(() => {});
  let names = [];

  if (props.inputs.length) {
    props.inputs.map((el) => {
      form[el.name] = el.filter;
      names.push(el.name);
    });
  }

  showFilter.value = false;
}
function getCheckedNodes(name) {
  treeRef.value.map((el) => {
    form[name] = el.getCheckedKeys();
  });
}

const defaultCheckedKeys = ref([]);

function getExpanded(name) {
  props.inputs.map((el) => {
    if (el.type == name) {
      options = el.options;
    }
  });
}
function IsJsonString(str) {
  try {
    let json = JSON.parse(str);
    return typeof json === "object";
  } catch (e) {
    return false;
  }
}

onMounted(() => {
  if (props.keyword) {
    form["keyword"] = route.query.keyword || "";
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
            if (el == "availabilities_tree") {
              getExpanded(el);
              defaultCheckedKeys.value = form[el];
            }
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

<style src="element-plus/dist/index.css">
.inset-xe {
  inset-inline-end: 1rem;
}
</style>
