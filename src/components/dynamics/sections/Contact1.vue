<template>
  <div>
    <div
      class="lg:container flex flex-col items-center justify-center text-center border border-solid rounded-3xl py-20 font-montserrat"
      :class="
        !item.background
          ? ' bg-gradient-to-r from-[#0037a9] via-[#a470ed] via-70% to-[#0037a9]'
          : ' !bg-no-repeat !bg-cover'
      "
      :style="item.background ? `background:url(${item.background})` : ''"
    >
      <h2
        class="lg:text-4xl text-3xl font-bold mb-5 capitalize max-w-[700px] leading-[3rem] lg:leading-[3.7rem] text-white"
      >
        {{ item.title }}
      </h2>
      <span
        class="base-btn-white w-fit !py-2 bg-transparent !mt-0 text-white border-white"
      >
        Get Service Now
      </span>
    </div>
    <form-add
      :editable="editable"
      @submit="typedSubmit"
      :loading="btnLoading"
      :close-modal="closeModal"
      :schema="schema"
      :initialValues="initialValues"
    >
      <div class="mb-5">
        <base-file
          :modalName="modal"
          modalType="image"
          id="background"
          name="background"
          :placeholder="t('LABELS.Background')"
          :label="t('LABELS.Background')"
          accept="image/png, image/webp, image/jpeg"
          v-model:itemValue="initialValues.background"
          v-model:image="initialValues.background_preview"
        />
      </div>
      <div class="mb-5 grid md:grid-cols-2 gap-2">
        <template v-for="field in formFields" :key="field.name">
          <component
            :is="field.inputType"
            :id="field.id"
            :name="field.name"
            :label="field.label"
            :placeholder="field.placeholder"
            :type="field.type"
          />
        </template>
      </div>
    </form-add>
  </div>
</template>

<script setup lang="ts">
import FormAdd from "@/components/dynamicForms/Add.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { mixed, object, string } from "yup";
import type { Contact1, FormFields, Values } from "../types";

import BaseFile from "@/components/inputs/BaseFile1.vue";

interface Props {
  data?: any;
  editable?: boolean;
  url: string;
  modal: string;
  currentIndex: number;
  type: string;
}
const typedSubmit = submit as (values: Values) => void;
const props = defineProps<Props>();
const route = useRoute();

const { t } = useI18n();

const closeModal = ref(false);
const loading = ref(false);
const btnLoading = ref(false);
const initialValues = reactive<Contact1>({
  background: "",
  background_preview: "",
  ar: {
    title: "",
  },
  en: {
    title: "",
  },
});
const schema = object().shape({
  background: mixed(),

  ar: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title") + t("inArabic"),
      })
    ),
  }),
  en: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title") + t("inEnglish"),
      })
    ),
  }),
});

const emit = defineEmits(["refresh"]);
const item = ref({
  id: "",
  title: "اضف عنوان هنا",

  background: "",
});
const formFields = ref<FormFields[]>([
  {
    inputType: "base-input",
    type: "text",
    name: "ar.title",
    id: "ar_title",
    placeholder: t("LABELS.Title") + t("inArabic"),
    label: t("LABELS.Title") + t("inArabic"),
  },
  {
    inputType: "base-input",
    placeholder: t("LABELS.Title") + t("inEnglish"),
    label: t("LABELS.Title") + t("inEnglish"),
    id: "en_title",
    type: "text",
    name: "en.title",
  },
]);

function submit(values: Contact1): void {
  let url;
  btnLoading.value = false;
  const frmData = new FormData();
  let method = "POST";
  if (item.value.id) {
    method = "PUT";
    url = `${props.url}/${route.params.id}/section/${item.value.id}`;
  } else {
    url = `${props.url}/${route.params.id}/section`;
  }
  if (values.background) frmData.append("background", values.background);
  frmData.append("ar[title]", values.ar.title);

  frmData.append("en[title]", values.en.title);

  frmData.append("type", props.type);

  axios({
    method,
    url,
    data: frmData,
  })
    .then(() => {
      btnLoading.value = false;
      closeModal.value = true;
      emit("refresh");
    })
    .catch((err) => {
      btnLoading.value = false;
      toast.error(err.response?.data.message);
    });
}

function setData() {
  item.value = props.data;
  initialValues.ar = props.data.ar;
  initialValues.en = props.data.en;
  initialValues.background_preview = props.data.background;
}

onMounted(() => {
  if (props.data) {
    setData();
  }
});
</script>
