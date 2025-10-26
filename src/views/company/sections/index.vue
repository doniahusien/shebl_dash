<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breads" :title="t('LABELS.sections')" back="/" class="mb-7" />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="flex items-center gap-3">
          <input
            v-model="searchKeyword"
            type="text"
            :placeholder="$t('byTitle')"
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <base-filter
          name="sections"
          :inputs="inputs"
          :btn-name="t(`BUTTONS.add`, { name: t('LABELS.section') })"
          icon="fas fa-plus"
          :keyword="false"
          @action="$router.push('/sections/form')"
        />
      </div>

      <Loader v-if="loading" />

      <template v-else>
        <NotFound v-if="errResponse?.status === 404" />
        <GlobalError v-else-if="errResponse?.status === 500" />

        <div v-else :class="!items.length ? 'h-full' : ''">
          <data-table
            :headers="headers"
            :items="filteredItems"
            :loading="loading"
            hide-footer
          >
            <template #loading>
              <loader class="py-7" />
            </template>

            <template #empty-message>
              <div
                v-if="!$route.query.status && !$route.query.type"
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

            <template #item-image="{ image }">
              <small-details-card :image="image?.url" />
            </template>

            <template #item-title="{ title }">
              <small-details-card :title="title" />
            </template>

            <template #item-type="{ typeName }">
              <small-details-card :title="typeName" />
            </template>

            <template #item-is_active="{ is_active, id }">
              <div class="flex justify-start">
                <global-switcher
                  :id="id"
                  :url="`sections/${id}`"
                  :method="'POST'"
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
const searchKeyword = ref("");

const breads = [
  { path: "/", name: t("TITLES.home") },
  { path: "/sections", name: t("LABELS.sections") },
];

const headers = [
  { text: t("LABELS.image"), align: "start", sortable: false, value: "image" },
  { text: t("LABELS.name"), align: "start", sortable: false, value: "title" },
  { text: t("LABELS.type"), align: "start", sortable: false, value: "type" },
  { text: t("LABELS.Status"), align: "start", sortable: false, value: "is_active" },
  { text: t("TITLES.actions"), align: "start", sortable: false, value: "actions" },
];

const inputs = [
  {
    name: "type",
    placeholder: t("Type"),
    options: [
      { name: t("TYPES.All"), id: "" },
      { name: t("TYPES.main_banner"), id: "main_banner" },
      { name: t("TYPES.about"), id: "about" },
      { name: t("TYPES.why_us"), id: "why_us" },
      { name: t("TYPES.our_services"), id: "our_services" },
      { name: t("TYPES.contact_info"), id: "contact_info" },
      { name: t("TYPES.about_banner"), id: "about_banner" },
      { name: t("TYPES.goals"), id: "goals" },
      { name: t("TYPES.core_values"), id: "core_values" },
      { name: t("TYPES.terms"), id: "terms" },
      { name: t("TYPES.privacy_policy"), id: "privacy_policy" },
      { name: t("TYPES.why_us_feature"), id: "why_us_feature" },
      { name: t("TYPES.our_services_feature"), id: "our_services_feature" },
      { name: t("TYPES.core_values_feature"), id: "core_values_feature" },
      { name: t("TYPES.goals_feature"), id: "goals_feature" },
      { name: t("TYPES.our_vision"), id: "our_vision" },
      { name: t("TYPES.qa_banner"), id: "qa_banner" },
      { name: t("TYPES.contact_banner"), id: "contact_banner" },
      { name: t("TYPES.terms_banner"), id: "terms_banner" },
      { name: t("TYPES.privacy_banner"), id: "privacy_banner" },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];
const filteredItems = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();

  return items.value
    .map((section) => ({
      ...section,
      title:
        locale.value === "ar"
          ? section.ar?.title || section.en?.title || "—"
          : section.en?.title || section.ar?.title || "—",
      typeName: t(`TYPES.${section.type}`) || section.type,
    }))
    .filter((section) =>
      keyword ? section.title.toLowerCase().includes(keyword) : true
    );
});

function fetchData() {
  errResponse.value = null;
  loading.value = true;

  const params = new URLSearchParams();

  if (route.query.page) params.append("page", route.query.page);
  if (route.query.status) params.append("is_active", route.query.status);
  if (route.query.type) params.append("type", route.query.type);

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
  if (route.query.status || route.query.type) dataFiltered.value = true;
  fetchData();
});

watch(
  () => [route.query.status, route.query.type],
  () => {
    if (route.query.status || route.query.type) dataFiltered.value = true;
    fetchData();
  }
);

watch(locale, () => {
  fetchData();
});
</script>
