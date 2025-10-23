<template>
  <div>
    <div class="grid gap-5 py-5 grid-cols-1 lg:grid-cols-2 items-center">
      <div class="rounded-2xl">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          class="relative rounded-2xl object-conatin max-h-[550px]"
        />
        <img
          v-else
          src="@/assets/dynamic/section.png"
          :alt="item.title"
          class="relative rounded-2xl object-conatin max-h-[550px]"
        />
      </div>
      <div>
        <h2
          class="text-3xl lg:text-4xl lg:leading-[2.8rem] text-text font-bold leading-[2.5rem] capitalize"
          v-html="item.title"
        ></h2>
        <div class="text-text-light max-w-[500px]" v-html="item.desc"></div>

        <div class="ps-6">
          <ul class="!list-image-[url(@/assets/dynamic/list.webp)]">
            <li
              v-for="(item, index) in item.features"
              :key="index"
              class="text-[#737195]"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
        <button type="button" class="base-btn-white mt-5">
          {{ t("BUTTONS.getServiceNow") }}
        </button>
      </div>
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
      <div>
        <FieldArray name="features" v-slot="{ fields, push, remove }">
          <div
            class="p-2 border col-span-2 border-primary border-solid rounded-xl"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-text text-lg mb-2">اضافة / تعديل ميزة</h3>
              <div
                v-if="!fields.length"
                class="flex items-center gap-2 justify-end pt-2"
              >
                <button
                  class="base-btn w-fit py-1 px-2"
                  type="button"
                  @click="
                    push({
                      titleAr: '',
                      titleEn: '',
                    })
                  "
                >
                  <i class="fas fa-plus"> </i>
                </button>
              </div>
            </div>
            <fieldset v-for="(field, idx) in fields" :key="idx">
              <div class="flex items-center gap-2 justify-end pt-2">
                <button
                  class="base-btn !w-fit !min-w-fit py-1 px-2"
                  type="button"
                  @click="
                    push({
                      ar: {
                        title: '',
                      },
                      en: {
                        title: '',
                      },
                    })
                  "
                >
                  <i class="fas fa-plus"> </i>
                </button>
                <button
                  class="base-btn-white py-1 px-2"
                  type="button"
                  @click="remove(idx)"
                >
                  <i class="fas fa-minus"> </i>
                </button>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <base-input
                  :id="`features[${idx}].ar.title`"
                  :name="`features[${idx}].ar.title`"
                  :placeholder="t('LABELS.Title') + t('inArabic')"
                  :label="t('LABELS.Title') + t('inArabic')"
                />
                <base-input
                  :id="`features[${idx}].en.title`"
                  :name="`features[${idx}].en.title`"
                  :placeholder="t('LABELS.Title') + t('inEnglish')"
                  :label="t('LABELS.Title') + t('inEnglish')"
                />
              </div>
            </fieldset>
          </div>
        </FieldArray>
      </div>
    </form-add>
  </div>
</template>

<script setup lang="ts">
import FormAdd from "@/components/dynamicForms/Add.vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { object, string, mixed, array } from "yup";
import type { Section1, FormFields, Values } from "../types";
import { toast } from "vue3-toastify";
import { ref, onMounted, reactive } from "vue";
import Section2 from "./Section2.vue";
import BaseFile from "@/components/inputs/BaseFile1.vue";
import { FieldArray } from "vee-validate";

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
const initialValues = reactive<Section1>({
  image: "",
  image_preview: "",
  ar: {
    title: "",
    desc: "",
  },
  en: {
    title: "",
    desc: "",
  },
  features: [],
});
const schema = object().shape({
  image: mixed().test(
    "media",
    t("ERRORS.isRequired", {
      name: t("LABELS.image"),
    }),
    (value) => {
      if (value || initialValues.image_preview) {
        return true;
      }
    }
  ),
  features: array().of(
    object().shape({
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
    })
  ),

  ar: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title") + t("inArabic"),
      })
    ),
    desc: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.desc") + t("inArabic"),
      })
    ),
  }),
  en: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title") + t("inEnglish"),
      })
    ),
    desc: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.desc") + t("inEnglish"),
      })
    ),
  }),
});

const emit = defineEmits(["refresh"]);
const item = ref({
  id: "",
  title: "اضف عنوان هنا",
  desc: "اضف وصفا هنا",
  image: "",
  features: [
    {
      title: "(اختياري)اضف ميزة هنا",
    },
  ],
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

function submit(values: Section1): void {
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
  if (values.image) frmData.append("image", values.image);
  frmData.append("ar[title]", values.ar.title);
  frmData.append("ar[desc]", values.ar.desc);
  frmData.append("en[title]", values.en.title);
  frmData.append("en[desc]", values.en.desc);
  frmData.append("type", props.type);

  if (values.features.length > 0) {
    values.features.map((feature, index) => {
      if (feature.id) frmData.append(`features[${index}][id]`, feature.id);
      frmData.append(`features[${index}][ar][title]`, feature.ar.title);
      frmData.append(`features[${index}][en][title]`, feature.en.title);
    });
  }

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
  initialValues.image_preview = props.data.image;
  initialValues.features = props.data.features;
}

onMounted(() => {
  if (props.data) {
    setData();
  }
});
</script>
