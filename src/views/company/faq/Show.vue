<template>
  <div class="h-full flex flex-col">
    <div class="bg-white rounded-3xl h-full shadow-md md:p-6 flex-1 flex flex-col">
      <div class="bg-white p-4">
        <loader v-if="loading" />

        <div v-else-if="questionItem">
          <!-- Breadcrumb -->
          <breadcrumbs
            :items="breads"
            :title="localizedData.question"
            back="/faq"
            class="mb-8 text-xl font-medium text-gray-700"
          />

          <!-- Active Status (Top) -->
          <div
            class="px-4 py-2 mb-6 rounded-full text-sm font-medium"
            :class="questionItem.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
          >
            {{ questionItem.is_active ? t('STATUS.active') : t('STATUS.inactive') }}
          </div>

          <!-- Question and Answer Stack -->
          <div class="flex flex-col gap-6">
            <!-- Question Text -->
            <h2 class="text-3xl font-semibold text-gray-900 mb-4">
              {{ localizedData.question }}
            </h2>

            <!-- Answer -->
            <div>
              <h3 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg-icon name="message-square" class="text-primary w-5 h-5" />
                {{ t("LABELS.answer") }}
              </h3>

              <div class="text-gray-800 leading-relaxed prose max-w-none">
                <p
                  v-html="localizedData.answer"
                  :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                ></p>
              </div>
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
const questionItem = ref(null);
const breads = ref([]);

const localizedData = computed(() => {
  if (!questionItem.value) return {};
  return locale.value === "ar" ? questionItem.value.ar : questionItem.value.en;
});

function fetchQuestion() {
  loading.value = true;
  axios
    .get(`faq/${route.params.id}`)
    .then((res) => {
      questionItem.value = res.data.data;
      setBreadcrumbs();
    })
    .finally(() => (loading.value = false));
}

function setBreadcrumbs() {
  breads.value = [
    { name: t("TITLES.home"), path: "/", imgIcon: "menu-setup.svg" },
    { name: t("LABELS.Questions"), path: "/questions" },
    {
      path: `/questions/show/${route.params.id}`,
      name: localizedData.value.question || t("LABELS.question_details"),
    },
  ];
}

onMounted(fetchQuestion);
</script>

<style scoped>
/* Typography for clarity */
.prose p {
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.6;
}

/* Question Text Styling */
.text-3xl {
  font-size: 1.875rem;
}

/* Answer section */
.text-2xl {
  font-size: 1.5rem;
}

/* Status styling */
.bg-green-100 {
  background-color: #d1f7c4;
}

.bg-red-100 {
  background-color: #f7d0d0;
}

.text-gray-700 {
  color: #4a4a4a;
}

/* Flex container for vertical stack */
.flex-col {
  flex-direction: column;
}

/* Text and spacing improvements */
.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}
</style>
