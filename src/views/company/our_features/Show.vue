<template>
  <div class="h-full flex flex-col">
    <div class="bg-white rounded-3xl h-full shadow-md md:p-6 flex-1 flex flex-col">
      <div class="bg-white p-3">
        <loader v-if="loading" />

        <div v-else-if="feature">
          <!-- Breadcrumb -->
          <breadcrumbs
            :items="breads"
            :title="localizedData.title"
            back="/our_features"
            class="mb-7"
          />

          <!-- Feature Layout -->
          <div class="grid md:grid-cols-2 gap-8 items-start">
            <!-- Left Section (Image + Icon + Title) -->
            <div class="flex flex-col items-center">
              <!-- Feature Main Image -->
              <div
                v-if="feature.background?.url"
                class="w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6"
              >
                <img
                  :src="feature.background.url"
                  alt="Feature background"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Icon inside a colored circle -->
              <div
                v-if="feature.icon?.url"
                class="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 shadow-inner mb-4"
              >
                <img
                  :src="feature.icon.url"
                  alt="Feature icon"
                  class="w-14 h-14 object-contain"
                />
              </div>

              <!-- Title -->
              <h2 class="text-2xl font-bold text-gray-900 text-center">
                {{ localizedData.title }}
              </h2>
            </div>

            <!-- Right Section (Details) -->
            <div>
              <base-card class="shadow-sm border border-gray-100 p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <svg-icon name="info" class="text-primary w-5 h-5" />
                  {{ $t("LABELS.feature_details") }}
                </h3>

                <div class="space-y-5">
                  <!-- Title -->
                  <div>
                    <h4 class="text-sm text-gray-500 mb-1">
                      {{ $t("LABELS.title") }}
                    </h4>
                    <p class="text-gray-900 font-medium">
                      {{ localizedData.title }}
                    </p>
                  </div>

                  <!-- Description -->
                  <div>
                    <h4 class="text-sm text-gray-500 mb-2">
                      {{ $t("LABELS.description") }}
                    </h4>
                    <div
                      class="prose max-w-none text-gray-800 leading-relaxed"
                      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                      v-html="localizedData.description"
                    ></div>
                  </div>
                </div>
              </base-card>
            </div>
          </div>
        </div>

        <UINotFound v-else />
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
const feature = ref(null);
const breads = ref([]);

const localizedData = computed(() => {
  if (!feature.value) return {};
  return locale.value === "ar" ? feature.value.ar : feature.value.en;
});

function fetchFeature() {
  loading.value = true;
  axios
    .get(`our-features/${route.params.id}`)
    .then((res) => {
      feature.value = res.data.data;
      setBreadcrumbs();
    })
    .finally(() => (loading.value = false));
}

function setBreadcrumbs() {
  breads.value = [
    { name: t("TITLES.home"), path: "/", imgIcon: "menu-setup.svg" },
    { name: t("LABELS.Features"), path: "/our_features" },
    {
      path: `/our_features/show/${route.params.id}`,
      name: localizedData.value.title || t("LABELS.feature_details"),
    },
  ];
}

onMounted(fetchFeature);
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75rem;
}
</style>
