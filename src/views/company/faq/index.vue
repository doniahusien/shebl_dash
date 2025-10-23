<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breads" :title="t('LABELS.faq')" back="/" class="mb-7" />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <!-- 🔍 Filter -->
      <base-filter
        v-if="items.length || dataFiltered"
        name="faq"
        :inputs="inputs"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.faq') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/faq/form')"
      />

      <Loader v-if="loading" />

      <template v-else>
        <NotFound v-if="errResponse?.status === 404" />
        <GlobalError v-else-if="errResponse?.status === 500" />

        <div v-else :class="!items.length ? 'h-full' : ''">
          <data-table :headers="headers" :items="localizedItems" :loading="loading" hide-footer>
            <!-- Loader -->
            <template #loading>
              <loader class="py-7" />
            </template>

            <!-- Empty States -->
            <template #empty-message>
              <div
                v-if="!$route.query.keyword && !$route.query.status"
                class="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div class="text-center">
                  <h3 class="mt-4 font-semibold text-text text-center">
                    {{
                      $t("TITLES.No have been added yet", {
                        name: $t("LABELS.faq"),
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
            <template #item-question="{ question, answer }">
              <small-details-card :title="question" :text="answer" />
            </template>

            <!-- 🟢 Switcher -->
            <template #item-is_active="{ is_active, id }">
              <div class="flex justify-start">
                <global-switcher
                  :id="id"
                  :hasMethod="true"
                  method="POST"
                  :url="`faq/${id}`"
                  :value="is_active"
                  :modalValue="is_active"
                  @update:modalValue="
                    items.find((item) => item.id === id).is_active = $event
                  "
                />
              </div>
            </template>

            <!-- ⚙️ Actions -->
            <template #item-actions="{ id }">
              <div class="flex items-center gap-4">
                <router-link :to="`/faq/show/${id}`">
                  <svg-icon class="text-primary" name="eye2" filled />
                </router-link>
                <router-link :to="`/faq/form/${id}`">
                  <svg-icon class="text-primary" name="edit" filled />
                </router-link>
                <Deleter
                  :url="`faq/${id}`"
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

// 🧭 Breadcrumbs
const breads = [
  { path: "/", name: t("TITLES.home") },
  { path: "/faq", name: t("LABELS.faq") },
];

// 🏷️ Table headers
const headers = [
  { text: t("LABELS.Question"), align: "start", sortable: false, value: "question" },
  { text: t("LABELS.Status"), align: "start", sortable: false, value: "is_active" },
  { text: t("TITLES.actions"), align: "start", sortable: false, value: "actions" },
];

// 🔍 Filter inputs
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

// 🌐 Localize Questions/Answers
const localizedItems = computed(() =>
  items.value.map((faq) => ({
    ...faq,
    question:
      locale.value === "ar"
        ? faq.ar?.question || faq.en?.question || "—"
        : faq.en?.question || faq.ar?.question || "—",
  
  }))
);

// 📦 Fetch FAQs
function fetchData() {
  errResponse.value = null;
  loading.value = true;

  const params = new URLSearchParams();
  if (route.query.page) params.append("page", route.query.page);
  if (route.query.keyword) params.append("question", route.query.keyword);
  if (route.query.status) params.append("is_active", route.query.status);

  axios
    .get("faq", { params })
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

// 🗑️ Remove deleted item
function remove(id) {
  items.value = items.value.filter((el) => el.id !== id);
  if (paginator.value?.total) paginator.value.total--;
}

// 🕒 Lifecycle
onMounted(() => {
  if (route.query.keyword || route.query.status) dataFiltered.value = true;
  fetchData();
});

// 🔁 Watchers
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
