<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breads" :title="t('LABELS.sections')" back="/" class="mb-7" />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFiltered"
        name="sections"
        :inputs="inputs"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.section') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/sections/form')"
      />

      <Loader v-if="loading" />

      <template v-else>
        <NotFound v-if="errResponse?.status === 404" />
        <GlobalError v-else-if="errResponse?.status === 500" />

        <div v-else :class="!items.length ? 'h-full' : ''">
          <data-table :headers="headers" :items="localizedItems" :loading="loading" hide-footer>
            <template #loading>
              <loader class="py-7" />
            </template>

            <!-- 🧩 Empty State -->
            <template #empty-message>
              <div
                v-if="!$route.query.keyword && !$route.query.status"
                class="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div class="text-center">
                  <h3 class="mt-4 font-semibold text-text text-center">
                    {{
                      $t("TITLES.No have been added yet", {
                        name: $t("LABELS.sections"),
                      })
                    }}
                  </h3>
                </div>
              </div>

              <div
                v-else
                class="h-full flex flex-col items-center justify-center space-y-6"
              >
                <img src="@/assets/images/search.png" alt="no data" class="mx-auto" />
                <h3 class="mt-4 font-semibold text-text text-center">
                  {{ $t("TITLES.No Search result") }}
                </h3>
              </div>
            </template>

            <!-- 🧱 Columns -->
            <template #item-title="{ title, image }">
              <small-details-card :image="image?.url" :title="title" />
            </template>

            <template #item-type="{ type }">
              <small-details-card :title="type" />
            </template>

            <template #item-is_active="{ is_active, id }">
              <div class="flex justify-start">
                <global-switcher
                  :id="id"
                  :hasMethod="true"
                  method="POST"
                  :url="`sections/${id}`"
                  :value="is_active"
                  :modalValue="is_active"
                  @update:modalValue="
                    items.find((item) => item.id === id).is_active = $event
                  "
                />
              </div>
            </template>

            <template #item-actions="{ id }">
              <div class="flex items-center gap-4">
                <router-link :to="`/sections/show/${id}`">
                  <svg-icon class="text-primary" name="eye2" filled />
                </router-link>
                <router-link :to="`/sections/form/${id}`">
                  <svg-icon class="text-primary" name="edit" filled />
                </router-link>
                <Deleter
                  :url="`sections/${id}`"
                  :id="id"
                  method="DELETE"
                  @remove="remove(id)"
                />
              </div>
            </template>
          </data-table>
        </div>
      </template>
    </div>

    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t, locale } = useI18n();
const route = useRoute();

const errResponse = ref(null);
const loading = ref(true);
const items = ref([]);
const paginator = ref(null);
const dataFiltered = ref(false);

const breads = [
  { path: "/", name: t("TITLES.home") },
  { path: "/sections", name: t("LABELS.sections") },
];

const headers = [
  { text: t("LABELS.image"), align: "start", sortable: false, value: "title" },
  { text: t("LABELS.type"), align: "start", sortable: false, value: "type" },
  { text: t("LABELS.Status"), align: "start", sortable: false, value: "is_active" },
  { text: t("TITLES.actions"), align: "start", sortable: false, value: "actions" },
];

const inputs = [
  {
    name: "status",
    placeholder: "status",
    options: [
      { name: t("STATUS.All"), id: "" },
      { name: t("LABELS.Active"), id: 1 },
      { name: t("LABELS.Inactive"), id: 0 },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];
const localizedItems = computed(() =>
  items.value.map((section) => ({
    ...section,
    title:
      locale.value === "ar"
        ? section.ar?.title || section.en?.title || "—"
        : section.en?.title || section.ar?.title || "—",
  }))
);

function fetchData() {
  errResponse.value = null;
  loading.value = true;

  const params = new URLSearchParams();
  if (route.query.page) params.append("page", route.query.page);
  if (route.query.keyword) params.append("title", route.query.keyword);
  if (route.query.status) params.append("is_active", route.query.status);

  axios
    .get("sections", { params })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      errResponse.value = err.response;
     
    });
}

function remove(id) {
  items.value = items.value.filter((el) => el.id !== id);
  if (paginator.value?.total) paginator.value.total--;
}

onMounted(() => {
  if (route.query.keyword || route.query.status) dataFiltered.value = true;
  fetchData();
  console.log("kkkkkkkkkkkkk")
});

watch(
  () => route.query,
  () => {
    if (route.query.keyword || route.query.status) dataFiltered.value = true;
    fetchData();
  }
);

watch(locale, () => {
  fetchData();
});
</script>
