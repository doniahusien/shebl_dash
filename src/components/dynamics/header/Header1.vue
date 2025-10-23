<template>
  <div>
    <div class="bg-cover py-24">
      <div
        class="text-4xl text-text md:text-5xl font-montserrat text-center md:leading-[3.5rem] font-bold max-w-[500px] md:max-w-[600px] max-h-fit mx-auto"
        v-html="item.title"
      ></div>
      <p class="max-w-[500px] mx-auto text-center text-sm mt-5 text-text">
        {{ item.desc }}
      </p>
      <div class="flex items-center gap-5 justify-center mt-8">
        <button type="button" class="base-btn py-2">Get Start</button>
        <button
          v-if="item.video"
          type="button"
          @click="openPreview = true"
          class="text-primary font-medium gap-2 flex items-center"
        >
          <span
            class="border border-primary flex items-center justify-center rounded-full w-10 h-10"
          >
            <i class="fa-solid fa-play"></i>
          </span>
          {{ t("Intro Video") }}
        </button>

        <media-modal
          v-if="openPreview && item.video"
          :preview="item.video"
          type="video"
          @close="openPreview = false"
        />
      </div>
    </div>

    <form-add
      :editable="editable"
      :form-data="formFields"
      @submit="typedSubmit"
      :loading="btnLoading"
      :close-modal="closeModal"
      :schema="schema"
      :initialValues="initialValues"
    >
      <div class="mb-5">
        <base-file
          modalName="services"
          modalType="image"
          id="icon"
          name="icon"
          :placeholder="t('LABELS.Icon')"
          :label="t('LABELS.Icon')"
          accept="image/png, image/webp, image/jpeg"
          v-model:itemValue="initialValues.icon_preview"
          v-model:image="initialValues.icon"
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
      <div class="mb-5">
        <base-file
          modalName="services"
          modalType="file"
          id="video"
          name="video"
          :placeholder="t('LABELS.Video')"
          :label="t('LABELS.Video')"
          accept="video/*"
          v-model:itemValue="initialValues.preview"
          v-model:image="initialValues.video"
        />
      </div>
    </form-add>
  </div>
</template>

<script setup lang="ts">
import BaseFile from "@/components/inputs/BaseFile1.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import FormAdd from "@/components/dynamicForms/Add.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { object, string, mixed } from "yup";
import { Header1, FormFields, Values } from "../types";
import { toast } from "vue3-toastify";

const { t } = useI18n();

interface Props {
  data?: any;
  editable?: boolean;
  url: string;
  formName: string;
}

const typedSubmit = submit as (values: Values) => void;

const props = defineProps<Props>();
const emit = defineEmits(["refresh"]);
const router = useRouter();

const closeModal = ref<boolean>(false);
const openPreview = ref<boolean>(false);
const btnLoading = ref<boolean>(false);

const schema = object().shape({
  video: mixed().test(
    "media",
    t("ERRORS.isRequired", {
      name: t("LABELS.Video"),
    }),
    (value) => {
      if (value || initialValues.preview) {
        return true;
      }
    }
  ),
  icon: mixed().test(
    "media",
    t("ERRORS.isRequired", {
      name: t("LABELS.Icon"),
    }),
    (value) => {
      if (value || initialValues.icon_preview) {
        return true;
      }
    }
  ),
  ar: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title", { name: t("LABELS.Service") }) + t("inArabic"),
      })
    ),
    desc: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.desc", { name: t("LABELS.Service") }) + t("inArabic"),
      })
    ),
    slug: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Slug") + t("inArabic"),
      })
    ),
    name: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Name", { name: t("LABELS.Service") }) + t("inArabic"),
      })
    ),
  }),
  en: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title", { name: t("LABELS.Service") }) + t("inEnglish"),
      })
    ),
    desc: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.desc", { name: t("LABELS.Service") }) + t("inEnglish"),
      })
    ),
    slug: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Slug") + t("inEnglish"),
      })
    ),
    name: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Name", { name: t("LABELS.Service") }) + t("inEnglish"),
      })
    ),
  }),
});

const item = reactive({
  id: null,
  title: "اضف عنوان من نوع h1",
  desc: "اضافه وصف ",
  video: "",
});
const initialValues = reactive<Header1>({
  icon: "",
  icon_preview: "",
  video: "",
  preview: "",
  ar: {
    name: "",
    title: "",
    slug: "",
    desc: "",
  },
  en: {
    name: "",
    title: "",
    desc: "",
    slug: "",
  },
});

const formFields = ref<FormFields[]>([
  {
    id: "ar_name",
    inputType: "base-input",
    type: "text",
    placeholder:
      t("LABELS.Name", { name: t("LABELS.Service") }) + t("inArabic"),
    label: t("LABELS.Name", { name: t("LABELS.Service") }) + t("inArabic"),
    name: "ar.name",
  },
  {
    id: "en_name",
    inputType: "base-input",
    type: "text",
    placeholder:
      t("LABELS.Name", { name: t("LABELS.Service") }) + t("inEnglish"),
    label: t("LABELS.Name", { name: t("LABELS.Service") }) + t("inEnglish"),
    name: "en.name",
  },
  {
    id: "ar_slug",
    inputType: "base-input",
    type: "text",
    placeholder: t("LABELS.Slug") + t("inArabic"),
    label: t("LABELS.Slug") + t("inArabic"),
    name: "ar.slug",
  },
  {
    id: "en_slug",
    inputType: "base-input",
    type: "text",
    placeholder: t("LABELS.Slug") + t("inEnglish"),
    label: t("LABELS.Slug") + t("inEnglish"),
    name: "en.slug",
  },
  {
    inputType: "base-editor",
    type: "text",
    name: "ar.title",
    id: "ar_title",
    placeholder: t("LABELS.Title") + t("inArabic"),
    label: t("LABELS.Title") + t("inArabic"),
  },
  {
    inputType: "base-editor",
    placeholder: t("LABELS.Title") + t("inEnglish"),
    label: t("LABELS.Title") + t("inEnglish"),
    id: "en_title",
    type: "text",
    name: "en.title",
  },
  {
    inputType: "base-input",
    type: "textarea",
    placeholder: t("LABELS.desc") + t("inArabic"),
    label: t("LABELS.desc") + t("inArabic"),
    id: "en_desc",
    name: "ar.desc",
  },
  {
    inputType: "base-input",
    type: "textarea",
    placeholder: t("LABELS.desc") + t("inEnglish"),
    label: t("LABELS.desc") + t("inEnglish"),
    id: "en_desc",
    name: "en.desc",
  },
]);

function setData() {
  item.id = props.data.id;
  item.desc = props.data.desc;
  item.title = props.data.title;
  item.video = props.data.video;
  initialValues.preview = props.data.video;
  initialValues.icon_preview = props.data.icon;
  initialValues.ar = props.data.ar;
  initialValues.en = props.data.en;
}

onMounted(() => {
  if (props.data) {
    setData();
  }
});

function submit(values: Header1) {
  let url;
  btnLoading.value = false;
  const frmData = new FormData();
  let method = "POST";
  if (item.id) {
    method = "PUT";
    url = `${props.url}/${item.id}`;
  } else {
    url = props.url;
  }
  if ("video" in values && values.video) frmData.append("video", values.video);
  if (values.icon) frmData.append("icon", values.icon);
  frmData.append("ar[name]", values.ar.name);
  frmData.append("en[name]", values.en.name);

  frmData.append("ar[title]", values.ar.title);
  frmData.append("ar[slug]", values.ar.slug.trim().split(" ").join("-"));
  frmData.append("ar[desc]", values.ar.desc);
  frmData.append("en[title]", values.en.title);
  frmData.append("en[slug]", values.en.slug.trim().split(" ").join("-"));
  frmData.append("en[desc]", values.en.desc);
  frmData.append("type", "Header1");
  axios({
    method,
    url,
    data: frmData,
  })
    .then((res) => {
      btnLoading.value = false;
      closeModal.value = true;
      if (item.id) {
        emit("refresh");
      } else {
        router.push(`/${props.formName}/form/${res.data.data.id}`);
      }
    })
    .catch((err) => {
      btnLoading.value = false;
      toast.error(err.response?.data.message);
    });
}
</script>
