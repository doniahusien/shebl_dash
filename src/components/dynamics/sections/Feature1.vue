<template>
  <div>
    <div class="font-montserrat">
      <h2 class="text-3xl font-bold text-text text-center mb-2">
        {{ item.title }}
      </h2>
      <p
        v-if="item.desc"
        class="text-base text-text-light mx-auto max-w-[700px] text-center"
      >
        {{ item.desc }}
      </p>
      <div
        class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-7 grid_area_template items-center"
      >
        <div class="rounded-2xl img_wrapper w-full h-full">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="relative object-cover h-full max-h-[400px] rounded-2xl mx-auto"
          />
          <div
            v-else
            class="relative h-full w-full max-h-[400px] bg-text-light rounded-2xl"
          ></div>
        </div>
        <div
          class="rounded-3xl pb-5 shadow h-fit p-5 space-y-3 border border-solid border-[#F5F5FC]"
          v-for="(item, index) in item.features"
          :key="index"
        >
          <div
            class="rounded-full font-bold w-11 h-11 border border-solid flex justify-center items-center"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              width="44"
              height="44"
              class="size-11 rounded-full"
            />
            <span v-else>
              {{ index < 10 ? "0" + (index + 1) : index + 1 }}</span
            >
          </div>
          <h2 class="font-bold text-black text-lg line-clamp-1">
            {{ item.title }}
          </h2>
          <p class="text-text-light line-clamp-3">
            {{ item.desc }}
          </p>
        </div>
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
      <div class="p-2 border col-span-2 border-primary border-solid rounded-xl">
        <FieldArray name="features" v-slot="{ fields, push, remove }">
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
                    icon: '',
                    icon_preview: '',
                    ar: {
                      title: '',
                      desc: '',
                    },
                    en: {
                      title: '',
                      desc: '',
                    },
                  })
                "
              >
                <i class="fas fa-plus"> </i>
              </button>
            </div>
          </div>
          <fieldset v-for="(field, idx) in fields" :key="idx">
            <div class="p-2 border col-span-2 border-primary mb-3 rounded-xl">
              <div class="flex items-center gap-2 justify-end pt-2">
                <button
                  class="base-btn !w-fit !min-w-fit py-1 px-2"
                  type="button"
                  v-if="fields.length < 4"
                  @click="
                    push({
                      icon: '',
                      icon_preview: '',
                      ar: {
                        title: '',
                        desc: '',
                      },
                      en: {
                        title: '',
                        desc: '',
                      },
                    })
                  "
                >
                  <i class="fas fa-plus"> </i>
                </button>
                <Deleter
                  v-if="field.value.id"
                  :url="`section-features/${field.value.id}`"
                  :id="field.value.id"
                  method="DELETE"
                  @remove="remove(idx)"
                />

                <button
                  v-else
                  class="base-btn-white py-1 px-2"
                  type="button"
                  @click="remove(idx)"
                >
                  <i class="fas fa-minus"> </i>
                </button>
              </div>

              <div class="mb-5">
                <base-file
                  modalName="section_features"
                  modalType="image"
                  :id="`features[${idx}].icon`"
                  :name="`features[${idx}].icon`"
                  :placeholder="t('LABELS.Icon')"
                  :label="t('LABELS.Icon')"
                  accept="image/png, image/webp, image/jpeg"
                  v-model:itemValue="field.value.icon_preview"
                  v-model:image="field.value.icon"
                />
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
                <base-input
                  type="textarea"
                  :id="`features[${idx}].ar.desc`"
                  :name="`features[${idx}].ar.desc`"
                  :placeholder="t('LABELS.desc') + t('inArabic')"
                  :label="t('LABELS.desc') + t('inArabic')"
                />
                <base-input
                  type="textarea"
                  :id="`features[${idx}].en.desc`"
                  :name="`features[${idx}].en.desc`"
                  :placeholder="t('LABELS.desc') + t('inEnglish')"
                  :label="t('LABELS.desc') + t('inEnglish')"
                />
              </div>
            </div>
          </fieldset>
        </FieldArray>
      </div>
    </form-add>
  </div>
</template>

<script setup lang="ts">
import FormAdd from "@/components/dynamicForms/Add.vue";
import BaseFile from "@/components/inputs/BaseFile1.vue";
import axios from "axios";
import { FieldArray } from "vee-validate";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { array, mixed, object, string } from "yup";
import type { Feature1, FormFields, Values } from "../types";

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
const initialValues = reactive<Feature1>({
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
  features: [
    {
      icon: "",
      icon_preview: "",
      ar: {
        title: "",
        desc: "",
      },
      en: {
        title: "",
        desc: "",
      },
    },
    {
      icon: "",
      icon_preview: "",
      ar: {
        title: "",
        desc: "",
      },
      en: {
        title: "",
        desc: "",
      },
    },
    {
      icon: "",
      icon_preview: "",
      ar: {
        title: "",
        desc: "",
      },
      en: {
        title: "",
        desc: "",
      },
    },
    {
      icon: "",
      icon_preview: "",
      ar: {
        title: "",
        desc: "",
      },
      en: {
        title: "",
        desc: "",
      },
    },
  ],
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
      icon: string(),
      // icon: mixed().test(
      //   "media",
      //   t("ERRORS.isRequired", {
      //     name: t("LABELS.Icon"),
      //   }),
      //   (value, ctx) => {
      //     if (value || ctx.parent.icon_preview) {
      //       return true;
      //     }
      //   }
      // ),
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
    })
  ),

  ar: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title") + t("inArabic"),
      })
    ),
    desc: string().nullable(),
  }),
  en: object().shape({
    title: string().required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Title") + t("inEnglish"),
      })
    ),
    desc: string().nullable(),
  }),
});

const emit = defineEmits(["refresh"]);
const item = ref({
  id: "",
  title: "اكتب عنوان السكشن هنا",
  desc: "",
  image: "",
  features: [
    {
      icon: "",

      title: "ادخل عنوان هنا",
      desc: "ادخل وصف  هنا",
    },
    {
      icon: "",

      title: "ادخل عنوان هنا",
      desc: "ادخل وصف  هنا",
    },
    {
      icon: "",

      title: "ادخل عنوان هنا",
      desc: "ادخل وصف  هنا",
    },
    {
      icon: "",

      title: "ادخل عنوان هنا",
      desc: "ادخل وصف  هنا",
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

function submit(values: Feature1): void {
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
  if (values.ar.desc) frmData.append("ar[desc]", values.ar.desc);
  frmData.append("en[title]", values.en.title ?? "");
  if (values.en.desc) frmData.append("en[desc]", values.en.desc);
  frmData.append("type", props.type);

  if (values.features.length > 0) {
    values.features.map((feature, index) => {
      if (feature.id) frmData.append(`features[${index}][id]`, feature.id);
      frmData.append(`features[${index}][ar][title]`, feature.ar.title);
      frmData.append(`features[${index}][en][title]`, feature.en.title);
      frmData.append(`features[${index}][ar][desc]`, feature.ar.desc);
      frmData.append(`features[${index}][en][desc]`, feature.en.desc);
      if (feature.icon) {
        frmData.append(`features[${index}][icon]`, feature.icon);
      }
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
  if (props.data) {
    item.value = props.data;
    initialValues.ar = props.data.ar;
    initialValues.en = props.data.en;
    initialValues.image_preview = props.data.image;
    initialValues.features = props.data.features.map((feature: any) => ({
      id: feature.id,
      ar: feature.ar,
      en: feature.en,
      icon: "",
      icon_preview: feature.icon,
    }));
  }
}

onMounted(() => {
  if (props.data) {
    setData();
  }
});
</script>

<style lang="scss">
.grid_area_template {
  .img_wrapper {
    @media (min-width: 992px) {
      grid-row-start: 1;
      grid-column-start: 2;
      grid-row-end: 3;
      grid-column-end: 2;
    }
  }
}
</style>
