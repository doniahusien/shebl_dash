<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="t('LABELS.About')"
      back="/"
      class="mb-7"
    />

    <div class="">
      <FormSkelton v-if="loading" />
      <base-card1
        v-else
        :title="$t('TITLES.Details', { name: $t('LABELS.About') })"
      >
        <VeeForm
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
        >
          <div class="mb-5 grid md:grid-cols-2 gap-2">
            <Quill
              id="descAr"
              name="descAr"
              :placeholder="$t('LABELS.desc') + $t('inArabic')"
              :label="$t('LABELS.desc') + $t('inArabic')"
              type="textarea"
            />
            <Quill
              id="descEn"
              name="descEn"
              :placeholder="$t('LABELS.desc') + $t('inEnglish')"
              :label="$t('LABELS.desc') + $t('inEnglish')"
              type="textarea"
            />
          </div>
          

          <div class="flex items-center justify-end gap-7">
            <button
              type="submit"
              class="base-btn rounded-md"
              :disabled="btnLoading"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </VeeForm>
      </base-card1>
    </div>
  </div>
</template>
<script setup>
import Quill from "@/components/inputs/Quill.vue";
import BaseFile from "@/components/inputs/BaseFile1.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { mixed, object, string } from "yup";

const route = useRoute();
const router = useRouter(); 
const loading = ref(false); 
const btnLoading = ref(false); 

const { t } = useI18n(); 

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/about",
    imgIcon: "",
    name: t("LABELS.About"),
  },
];

const initialValues = reactive({
  descAr: "",
  descEn: "",
  preview: "",
  video: "",
});

const schema = object().shape({
  descAr: string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.desc") + t("inArabic"),
    })
  ),
  descEn: string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.desc") + t("inEnglish"),
    })
  ),
});

function handleSubmit(values) {
  btnLoading.value = true;

  const frmData = new FormData();

  frmData.append("ar[description]", values.descAr); 
  frmData.append("en[description]", values.descEn);  
  axios
    .post(`sections/27`, frmData) 
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      btnLoading.value = false;
      router.push("/"); 
    })
    .catch((e) => {
      console.log(e);
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function getData() {
  loading.value = true;
  axios.get(`sections?type=contact_info`).then((res) => {
    const result = res.data.data[0]; 
    initialValues.descAr = result?.ar?.description || "";  
    initialValues.descEn = result?.en?.description || "";  
    initialValues.preview = result?.image?.url || "";  

    loading.value = false;
  }).catch((error) => {
    loading.value = false;
    console.error(error);
    toast.error("Failed to fetch data.");
  });
}

onMounted(() => {
  getData();
});
</script>
