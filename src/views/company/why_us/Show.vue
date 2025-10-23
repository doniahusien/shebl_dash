<template>
  <div class="h-full flex flex-col">
    <div class="bg-white rounded-3xl h-full shadow-md md:p-4 flex-1 flex flex-col">
      <div class="bg-white p-3">
        <loader v-if="loading" />

        <div v-else-if="whyUsData">
          <breadcrumbs
            :icon="whyUsData.icon?.url"
            :items="breads"
            :title="localizedData.key"
            back="/why_us"
            class="mb-7"
          />

          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <base-card class="shadow-sm border border-gray-100 p-4">
                <div class="text-center">
                  <img
                    v-if="whyUsData.icon?.url"
                    :src="whyUsData.icon.url"
                    alt="Why Us Icon"
                    class="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto mb-4"
                  />
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ localizedData.key }}
                  </h2>
                </div>
              </base-card>
            </div>

            <div class="md:col-span-2">
              <base-card class="shadow-sm border border-gray-100 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg-icon name="info" />
                  {{ $t('LABELS.details') }}
                </h3>

                <div class="space-y-4">
                  <div>
                    <h4 class="text-sm text-gray-500 mb-1">
                      {{ $t('LABELS.value') }}
                    </h4>
                    <p class="text-gray-900 font-medium">
                      {{ localizedData.value }}
                    </p>
                  </div>

                  <div>
                    <h4 class="text-sm text-gray-500 mb-1">
                      {{ $t('LABELS.status') }}
                    </h4>
                    <div
                      class="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-sm font-medium"
                      :class="whyUsData.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    >
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="whyUsData.is_active ? 'bg-green-500' : 'bg-red-500'"
                      ></span>
                      {{ whyUsData.is_active ? $t('LABELS.active') : $t('LABELS.inactive') }}
                    </div>
                  </div>
                </div>
              </base-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const route = useRoute();

const loading = ref(false);
const whyUsData = ref(null);
const breads = ref([]);

const localizedData = computed(() => {
  if (!whyUsData.value) return {};
  return locale.value === "ar" ? whyUsData.value.ar : whyUsData.value.en;
});

function fetchWhyUs() {
  loading.value = true;
  axios
    .get(`why-us/${route.params.id}`)
    .then((res) => {
      whyUsData.value = res.data.data;
      setBreadcrumbs();
    })
    .finally(() => (loading.value = false));
}

function setBreadcrumbs() {
  breads.value = [
    { name: t("TITLES.home"), path: "/", imgIcon: "menu-setup.svg" },
    { name: t("LABELS.why_us"), path: "/why-us" },
    {
      path: `/why-us/show/${route.params.id}`,
      name: localizedData.value.key || t("LABELS.why_us_details"),
    },
  ];
}

onMounted(fetchWhyUs);
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75rem;
}
</style>
