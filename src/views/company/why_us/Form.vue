<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, { name: t('LABELS.why_us') })"
      back="/why-us"
      class="mb-7"
    />

    <div>
      <FormSkelton v-if="loading" />

      <Form
        v-else
        :data="whyUsDetails"
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

const whyUsDetails = ref(null);
const loading = ref(false);
const btnLoading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/why_us",
    imgIcon: "",
    name: t("LABELS.why_us"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.why_us"),
    }),
    path: `why_us/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

async function getData() {
  try {
    const { data } = await axios.get(`why-us/${route.params.id}`);
    const result = data.data;

    whyUsDetails.value = {
      id: result.id,
      enKey: result.en?.key || "",
      arKey: result.ar?.key || "",
      value: result.value,
      icon_preview: result.icon?.url || "",
      is_active: result.is_active,
    };
  } catch (err) {
    console.error("❌ Failed to fetch Why Us data:", err);
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
