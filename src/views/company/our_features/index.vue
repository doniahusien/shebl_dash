<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breads" :title="t('LABELS.Features')" back="/" class="mb-7" />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <div class="flex justify-end mb-5">
        <button
          class="bg-primary text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
          @click="$router.push('/our_features/form')"
        >
          <i class="fas fa-plus"></i>
          {{ t(`BUTTONS.add`, { name: t('LABELS.Feature') }) }}
        </button>
      </div>

      <div class="mb-5 mt-2 flex items-center gap-3">
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="$t('byTitle')"
          class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Loader v-if="loading" />

      <template v-else>
        <NotFound v-if="errResponse?.status === 404" />
        <GlobalError v-else-if="errResponse?.status === 500" />

        <div v-else :class="!filteredFeatures.length ? 'h-full' : ''">
          <data-table
            :headers="headers"
            :items="filteredFeatures"
            :loading="loading"
            hide-footer
          >
            <template #loading>
              <loader class="py-7" />
            </template>

            <template #empty-message>
              <div class="h-full flex flex-col items-center justify-center space-y-6">
                <img src="@/assets/images/search.png" alt="no data" class="mx-auto" />
                <h3 class="mt-4 font-semibold text-text text-center">
                  {{
                    filteredFeatures.length === 0
                      ? $t("TITLES.No have been added yet", {
                          name: $t("LABELS.Features"),
                        })
                      : $t("TITLES.No Search result")
                  }}
                </h3>
              </div>
            </template>
            <template #item-icon="{ icon }">
              <div class="flex justify-start">
                <img v-if="icon?.url" :src="icon.url" alt="icon" class="w-8 h-8" />
              </div>
            </template>

            <template #item-title="{ title }">
              <small-details-card :title="title"/>
            </template>

            <template #item-background="{ background }">
              <img
                v-if="background?.url"
                :src="background.url"
                class="w-20 h-14 object-cover rounded-lg"
              />
              <span v-else>-</span>
            </template>

            <template #item-actions="{ id }">
              <div class="flex items-center gap-4">
                <router-link :to="`/our_features/show/${id}`">
                  <svg-icon class="text-primary" name="eye2" filled />
                </router-link>
                <router-link :to="`/our_features/form/${id}`">
                  <svg-icon class="text-primary" name="edit" filled />
                </router-link>
                <Deleter
                  :url="`our-features/${id}`"
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
const searchKeyword = ref("");

const breads = [
  { path: "/", name: t("TITLES.home") },
  { path: "/our-features", name: t("LABELS.Features") },
];

const headers = [
  { text: t("LABELS.Icon"), align: "start", sortable: false, value: "icon" },
  { text: t("LABELS.Name"), align: "start", sortable: false, value: "title" },
  { text: t("LABELS.Background"), align: "start", sortable: false, value: "background" },
  { text: t("TITLES.actions"), align: "start", sortable: false, value: "actions" },
];

const filteredFeatures = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();

  return items.value
    .map((feature) => ({
      ...feature,
      title:
        locale.value === "ar"
          ? feature.ar?.title || feature.en?.title || "—"
          : feature.en?.title || feature.ar?.title || "—",
      description:
        locale.value === "ar"
          ? feature.ar?.description || feature.en?.description || ""
          : feature.en?.description || feature.ar?.description || "",
    }))
    .filter((feature) =>
      keyword ? feature.title.toLowerCase().includes(keyword) : true
    );
});

function fetchData() {
  errResponse.value = null;
  loading.value = true;

  const params = new URLSearchParams();
  if (route.query.page) params.append("page", route.query.page);

  axios
    .get("our-features", { params })
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

onMounted(fetchData);
watch(locale, fetchData);
</script>
