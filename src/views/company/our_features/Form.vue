<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.feature'),
        })
      "
      back="/our_features"
      class="mb-7"
    />

    <div>
      <FormSkelton v-if="loading" />

      <Form
        v-else
        :data="featureDetails"
        :is-loading="btnLoading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";
import Form from "./steps/Form.vue";

const route = useRoute();
const { t } = useI18n();

const featureDetails = ref(null);
const loading = ref(false);
const btnLoading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/our_features",
    imgIcon: "",
    name: t("LABELS.features"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.feature"),
    }),
    path: `our_features/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

async function getData() {
  try {
    const { data } = await axios.get(`/our-features/${route.params.id}`);
    const result = data.data;

    featureDetails.value = {
      id: result.id,
      background_preview: result.background,
      icon_preview: result.icon,
      titleAr: result.ar?.title || "",
      titleEn: result.en?.title || "",
      descriptionAr: result.ar?.description || "",
      descriptionEn: result.en?.description || "",
    };
  } catch (err) {
    console.error("❌ Failed to fetch feature:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>
