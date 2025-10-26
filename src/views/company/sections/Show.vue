<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex flex-col bg-white rounded-3xl shadow-md md:p-5">
      <loader v-if="loading" class="my-auto" />

      <div v-else-if="section" class="flex flex-col gap-6">
        <breadcrumbs
          :items="breads"
          :title="localizedData.title"
          back="/sections"
          class="mb-4"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <base-card
            class="p-5 border border-gray-100 shadow-sm text-center relative overflow-hidden"
          >
            <img
              v-if="section.image?.url"
              :src="section.image.url"
              alt="Section image"
              class="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-md mx-auto mb-4"
            />
            <h2 class="text-2xl font-bold text-gray-900">
              {{ localizedData.title }}
            </h2>

            <p class="text-sm text-gray-500 mt-1">
              {{ t(`LABELS.Type`) }}:
              {{ t(`TYPES.${section.type}`) || section.type }}
            </p>

            <div
              class="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-sm font-medium"
              :class="
                section.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="section.is_active ? 'bg-green-500' : 'bg-red-500'"
              ></span>
              {{ section.is_active ? $t("LABELS.active") : $t("LABELS.inactive") }}
            </div>
          </base-card>

          <base-card class="md:col-span-2 p-6 border border-gray-100 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <svg-icon name="info" />
              {{ $t("LABELS.section_details") }}
            </h3>

            <div class="space-y-5">
              <div
                v-if="section.icon?.url && section.icon.url.trim() !== ' '"
                class="flex items-center justify-start mb-4"
              >
                <h4 class="text-sm text-gray-500 mb-1">
                  {{ $t("LABELS.Icon") }}
                </h4>
                <img
                  :src="section.icon.url"
                  alt="Section icon"
                  class="w-16 h-16 object-contain rounded-xl border border-gray-100 shadow-sm bg-white p-2"
                />
              </div>
              <div>
                <h4 class="text-sm text-gray-500 mb-1">
                  {{ $t("LABELS.title") }}
                </h4>
                <p class="text-gray-900 font-medium">
                  {{ localizedData.title }}
                </p>
              </div>

              <div>
                <h4 class="text-sm text-gray-500 mb-1">
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
const section = ref(null);
const breads = ref([]);

// 🧠 Dynamically choose English or Arabic content
const localizedData = computed(() => {
  if (!section.value) return {};
  return locale.value === "ar" ? section.value.ar : section.value.en;
});

function fetchSection() {
  loading.value = true;
  axios
    .get(`sections/${route.params.id}`)
    .then((res) => {
      section.value = res.data.data;
      setBreadcrumbs();
    })
    .finally(() => (loading.value = false));
}

function setBreadcrumbs() {
  breads.value = [
    { name: t("TITLES.home"), path: "/", imgIcon: "menu-setup.svg" },
    { name: t("LABELS.sections"), path: "/sections" },
    {
      path: `/sections/show/${route.params.id}`,
      name: localizedData.value.title || t("LABELS.section_details"),
    },
  ];
}

onMounted(fetchSection);
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75rem;
}
</style>
