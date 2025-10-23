<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.section'),
        })
      "
      back="/sections"
      class="mb-7"
    />

    <div>
      <FormSkelton v-if="loading" />

      <Form
        v-else
        :data="sectionDetails"
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

const sectionDetails = ref(null);
const loading = ref(false);
const btnLoading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/sections",
    imgIcon: "",
    name: t("LABELS.sections"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.section"),
    }),
    path: `sections/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

async function getData() {
  try {
    const { data } = await axios.get(`sections/${route.params.id}`);
    const result = data.data;

    sectionDetails.value = {
      id: result.id,
      type: result.type,
      is_active: result.is_active,
      image_preview: result.image?.url,
      icon_preview: result.icon?.url,
      titleAr: result.ar?.title || "",
      titleEn: result.en?.title || "",
      descriptionAr: result.ar?.description || "",
      descriptionEn: result.en?.description || "",
      features: result.features || [],
    };
  } catch (err) {
    console.error("❌ Failed to fetch section:", err);
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
