<template>
  <div class="lg:container">
    <div class="text-black capitalize space-y-3">
      <div
        class="font-bold text-center text-5xl max-w-[650px] mx-auto tracking-wide"
        v-html="item.title"
      ></div>
      <p class="text-text-light text-center text-sm mx-auto max-w-[500px]">
        {{ item.desc }}
      </p>
      <div class="min-h-[300px] max-h-[600px] bg-third rounded-2xl">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="mb-5 mx-auto max-w-[100%] max-h-[600px] w-full rounded-xl object-fit"
          height="600"
        />
        <img v-else src="@/assets/images/header_bg.png" alt="" />
      </div>

      <div class="grid md:grid-cols-2 pt-5 gap-4">
        <h2 class="text-3xl max-w-[400px] font-bold mb-4">
          {{ item.sub_title }}
        </h2>
        <div class="text-[#737195] text-sm max-w-[400px] leading-6">
          {{ item.sub_desc }}
        </div>
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
      <div class="mb-5">
        <base-file
          modalName="services"
          modalType="image"
          id="image"
          name="image"
          :placeholder="t('LABELS.Image')"
          :label="t('LABELS.Image')"
          accept="image/png, image/webp, image/jpeg"
          v-model:itemValue="initialValues.image_preview"
          v-model:image="initialValues.image"
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
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import FormAdd from "@/components/dynamicForms/Add.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { object, string, mixed } from "yup";
import { Header3, FormFields, Values } from "../types";
import { toast } from "vue3-toastify";
import BaseFile from "@/components/inputs/BaseFile1.vue";
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

const btnLoading = ref<boolean>(false);

const schema = object().shape({
  image: mixed().test(
    "media",
    t("ERRORS.isRequired", {
      name: t("LABELS.Image"),
    }),
    (value) => {
      if (value || initialValues.image_preview) {
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
  name: "",
  title: "اضف عنوان من نوع h1",
  desc: "اضافه وصف ",
  image: "",
  sub_title: "اضافه عنوان فرعي",
  sub_desc: "اضافة وصف فرعي اضافة وصف فرعي اضافة وصف فرعي",
});
const initialValues = reactive<Header3>({
  icon: "",
  icon_preview: "",
  image: "",
  image_preview: "",
  ar: {
    name: "",
    title: "",
    sub_title: "",
    slug: "",
    desc: "",
    sub_desc: "",
  },
  en: {
    name: "",
    title: "",
    sub_title: "",
    desc: "",
    sub_desc: "",
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
  {
    inputType: "base-input",
    type: "text",
    placeholder: t("LABELS.subTitle") + t("inArabic"),
    label: t("LABELS.subTitle") + t("inArabic"),
    id: "ar_sub_title",
    name: "ar.sub_title",
  },
  {
    inputType: "base-input",
    type: "text",
    placeholder: t("LABELS.subTitle") + t("inEnglish"),
    label: t("LABELS.subTitle") + t("inEnglish"),
    id: "en_sub_title",
    name: "en.sub_title",
  },
  {
    inputType: "base-input",
    type: "text",
    placeholder: t("LABELS.subDesc") + t("inArabic"),
    label: t("LABELS.subDesc") + t("inArabic"),
    id: "ar_sub_desc",
    name: "ar.sub_desc",
  },
  {
    inputType: "base-input",
    type: "text",
    placeholder: t("LABELS.subDesc") + t("inEnglish"),
    label: t("LABELS.subDesc") + t("inEnglish"),
    id: "en_sub_desc",
    name: "en.sub_desc",
  },
]);

function setData() {
  item.id = props.data.id;
  item.name = props.data.name;
  item.desc = props.data.desc;
  item.title = props.data.title;
  item.sub_title = props.data.sub_title;
  item.sub_desc = props.data.sub_desc;
  item.image = props.data.image;
  initialValues.icon_preview = props.data.icon;
  initialValues.image_preview = props.data.image;
  initialValues.ar = props.data.ar;
  initialValues.en = props.data.en;
}

onMounted(() => {
  if (props.data) {
    setData();
  }
});

function submit(values: Header3) {
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
  if ("image" in values && values.image) frmData.append("image", values.image);
  if (values.icon) frmData.append("icon", values.icon);
  frmData.append("ar[name]", values.ar.name);
  frmData.append("en[name]", values.en.name);

  frmData.append("ar[title]", values.ar.title);
  frmData.append("ar[slug]", values.ar.slug.trim().split(" ").join("-"));
  frmData.append("ar[desc]", values.ar.desc);

  frmData.append("en[title]", values.en.title);
  frmData.append("en[slug]", values.en.slug.trim().split(" ").join("-"));
  frmData.append("en[desc]", values.en.desc);
  if ("sub_desc" in values.ar) {
    frmData.append("ar[sub_desc]", values.ar.sub_desc);
  }
  if ("sub_title" in values.ar) {
    frmData.append("ar[sub_title]", values.ar.sub_title);
  }
  if ("sub_desc" in values.en) {
    frmData.append("en[sub_desc]", values.en.sub_desc);
  }
  if ("sub_title" in values.en) {
    frmData.append("en[sub_title]", values.en.sub_title);
  }

  frmData.append("type", "Header3");
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
