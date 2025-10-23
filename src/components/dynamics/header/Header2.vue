<template>
  <div>
    <div class="py-24 flex flex-wrap items-center gap-5">
      <div class="w-full lg:flex-1 order-2 lg:order-1">
        <div
          class="text-text text-4xl md:text-5xl 2xl:text-6xl max-w-[500px] 2xl:max-w-[700px] font-montserrat md:leading-[3.5rem] font-bold max-h-fit"
          v-html="item.title"
        ></div>
        <p class="max-w-[500px] text-sm mt-5 text-[#737195]">
          {{ item.desc }}
        </p>
        <div class="flex items-center gap-5 mt-8">
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
      <div
        class="rounded-2xl flex justify-center items-center lg:justify-end w-full lg:w-[450px] order-1 lg:order-2"
        v-if="item.image"
      >
        <img
          :src="item.image"
          :alt="item.name"
          class="relative object-cover max-h-[350px] rounded-2xl"
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
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import FormAdd from "@/components/dynamicForms/Add.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { object, string, mixed } from "yup";
import { Header2, FormFields, Values } from "../types";
import { toast } from "vue3-toastify";
import BaseFile from "@/components/inputs/BaseFile1.vue";
const { t } = useI18n();
const typedSubmit = submit as (values: Values) => void;
interface Props {
  data?: any;
  editable?: boolean;
  url: string;
  formName: string;
}

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
  video: "",
  image: "",
});
const initialValues = reactive<Header2>({
  icon: "",
  icon_preview: "",
  video: "",
  preview: "",
  image: "",
  image_preview: "",
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
  item.name = props.data.name;
  item.title = props.data.title;
  item.video = props.data.video;
  item.image = props.data.image;
  initialValues.preview = props.data.video;
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

function submit(values: Header2) {
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
  if ("image" in values && values.image) frmData.append("image", values.image);
  frmData.append("ar[name]", values.ar.name);
  frmData.append("en[name]", values.en.name);

  frmData.append("ar[title]", values.ar.title);
  frmData.append("ar[slug]", values.ar.slug.trim().split(" ").join("-"));
  frmData.append("ar[desc]", values.ar.desc);
  frmData.append("en[title]", values.en.title);
  frmData.append("en[slug]", values.en.slug.trim().split(" ").join("-"));
  frmData.append("en[desc]", values.en.desc);
  frmData.append("type", "Header2");
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
