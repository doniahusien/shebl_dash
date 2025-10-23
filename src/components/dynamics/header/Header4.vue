<template>
  <div>
    <div class="grid grid-cols-2 py-11 font-montserrat">
      <div>
        <div
          v-html="item.title"
          class="text-4xl font-bold mb-5 capitalize text-text"
        ></div>
        <p class="text-[#737195]">
          {{ item.desc }}
        </p>
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
import { HeaderAttrs, FormFields, Values } from "../types";
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

const btnLoading = ref<boolean>(false);

const schema = object().shape({
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
  title: "اضف عنوان هنا من نوع h1",
  desc: "اضف وصف هنا",
});
const initialValues = reactive<HeaderAttrs>({
  icon: "",
  icon_preview: "",

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
  initialValues.icon_preview = props.data.icon;
  initialValues.ar = props.data.ar;
  initialValues.en = props.data.en;
}

onMounted(() => {
  if (props.data) {
    setData();
  }
});

function submit(values: HeaderAttrs) {
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

  if (values.icon) frmData.append("icon", values.icon);
  frmData.append("ar[name]", values.ar.name);
  frmData.append("en[name]", values.en.name);

  frmData.append("ar[title]", values.ar.title);
  frmData.append("ar[slug]", values.ar.slug.trim().split(" ").join("-"));
  frmData.append("ar[desc]", values.ar.desc);
  frmData.append("en[title]", values.en.title);
  frmData.append("en[slug]", values.en.slug.trim().split(" ").join("-"));
  frmData.append("en[desc]", values.en.desc);
  frmData.append("type", "Header4");
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

<!-- <script>
export default {
  props: {
    type: {
      required: true,
    },
    mainService: {
      required: false,
    },
    data: {
      required: false,
    },

    editable: {
      required: false,
    },
    url: {
      required: true,
    },
    urlModal: {
      required: true,
    },
    formName: {
      required: true,
    },
  },
  data() {
    return {
      closeModal: false,
      btnLoading: true,
      item: {
        title: "اضف عنوان هنا من نوع h1",
        desc: "اضف وصف هنا",
      },
      formData: [
        {
          fullWidth: true,
          inputType: "app-text-editor",
          type: "text",
          name: this.$t("labels.title") + this.$t("inArabic"),
          placeholder: this.$t("labels.title") + this.$t("inArabic"),
          label: this.$t("labels.title") + this.$t("inArabic"),
          modelValue: "",
          rules: "required",
          key: "ar[title]",
        },

        {
          fullWidth: true,
          inputType: "app-text-editor",
          type: "text",
          name: this.$t("labels.title") + this.$t("inEnglish"),
          placeholder: this.$t("labels.title") + this.$t("inEnglish"),
          label: this.$t("labels.title") + this.$t("inEnglish"),
          modelValue: "",
          rules: "required",
          key: "en[title]",
        },
        {
          inputType: "app-textarea",
          type: "text",
          name: this.$t("labels.desc") + this.$t("inArabic"),
          placeholder: this.$t("labels.desc") + this.$t("inArabic"),
          label: this.$t("labels.desc") + this.$t("inArabic"),
          modelValue: "",
          rules: "required",
          key: "ar[desc]",
        },
        {
          inputType: "app-textarea",
          type: "text",
          name: this.$t("labels.desc") + this.$t("inArabic"),
          placeholder: this.$t("labels.desc") + this.$t("inArabic"),
          label: this.$t("labels.desc") + this.$t("inArabic"),
          modelValue: "",
          rules: "required",
          key: "en[desc]",
        },
      ],
    };
  },
  methods: {
    submit(e) {
      let url;
      this.btnLoading = true;
      const frmData = new FormData();
      if (this.item.id) {
        frmData.append("id", this.item.id);
        frmData.append("_method", "PUT");
        url = `${this.url}/${this.item.id}`;
      } else {
        frmData.append("id", "");
        url = this.url;
      }
      e.map((el) => {
        if (el.key == "category_id") {
          frmData.append(el.key, el.modelValue.id);
        } else if (el.key == "is_active") {
          frmData.append(el.key, +el.modelValue);
        } else if (el.key == "ar[slug]") {
          frmData.append(el.key, this.getSlugFormate(el.modelValue));
        } else if (el.key == "en[slug]") {
          frmData.append(el.key, this.getSlugFormate(el.modelValue));
        } else if (el.key == "background") {
          if (el.modelValue && el.modelValue.image) {
            if (el.modelValue.id) {
              frmData.append(`background[id]`, el.modelValue.id);
            } else {
              frmData.append(`background[id]`, "");
            }
            frmData.append(`background[media]`, el.modelValue.image);
          }
        } else if (el.key == "icon") {
          if (el.modelValue.image) {
            frmData.append("icon[media]", el.modelValue.image);
            if (el.modelValue.id) {
              frmData.append("icon[id]", el.modelValue.id);
            } else {
              frmData.append("icon[id]", "");
            }
          }
        } else {
          frmData.append(el.key, el.modelValue ?? "");
        }
        frmData.append("type", this.type);
      });

      this.axios
        .post(url, frmData)
        .then((res) => {
          this.btnLoading = false;
          this.closeModal = true;
          if (!this.item.id) {
            this.$router.push(`/${this.formName}/form/${res.data.data.id}`);
          } else {
            this.$emit("refresh");
          }
        })
        .catch((err) => {
          this.btnLoading = false;
          this.$iziToast.error({
            timeout: 2000,
            message: err.response?.data.message ?? err.response?.data.messages,
            position: "bottomRight",
          });
        });
    },
  },
  mounted() {
    if (this.mainService && !this.$route.params.id) {
      this.formData.unshift(
        ...[
          {
            inputType: "app-checkbox",
            name: this.$t("labels.is_active"),
            placeholder: this.$t("labels.is_active"),
            label: this.$t("labels.is_active"),
            modelValue: true,
            fullWidth: true,
            key: "is_active",
          },
          {
            fullWidth: true,
            inputType: "app-input-image",
            type: "text",
            noAlt: true,
            name: this.$t("labels.icon"),
            placeholder: this.$t("labels.icon"),
            label: this.$t("labels.icon"),
            modelValue: "",
            rules: "required",
            key: "icon",
            modalName: this.url,
          },
          {
            inputType: "app-input",
            type: "number",
            name: this.$t("labels.ordering"),
            placeholder: this.$t("labels.ordering"),
            label: this.$t("labels.ordering"),
            modelValue: "",
            rules: "required|numeric|min_value:0",
            key: "ordering",
          },
          {
            inputType: this.$route.path.includes("systems")
              ? ""
              : "app-input-select",
            type: "",
            apiUrl: this.$route.path.includes("solutions")
              ? "solution_category_without_pagination"
              : this.$route.path.includes("services")
              ? "service_category_without_pagination"
              : "",
            name: this.$t("labels.category"),
            placeholder: this.$t("labels.category"),
            label: this.$t("labels.category"),
            modelValue: "",
            rules: "required",
            key: "category_id",
          },
          {
            inputType: "app-input",
            type: "text",
            name: this.$t("labels.name") + this.$t("inArabic"),
            placeholder: this.$t("labels.name") + this.$t("inArabic"),
            label: this.$t("labels.name") + this.$t("inArabic"),
            modelValue: "",
            rules: "required",
            key: "ar[name]",
          },
          {
            inputType: "app-input",
            type: "text",
            name: this.$t("labels.name") + this.$t("inEnglish"),
            placeholder: this.$t("labels.name") + this.$t("inEnglish"),
            label: this.$t("labels.name") + this.$t("inEnglish"),
            modelValue: "",
            rules: "required",
            key: "en[name]",
          },
          {
            inputType: "app-input",
            type: "text",
            name: this.$t("labels.slug") + this.$t("inArabic"),
            placeholder: this.$t("labels.slug") + this.$t("inArabic"),
            label: this.$t("labels.slug") + this.$t("inArabic"),
            modelValue: "",
            rules: "required",
            key: "ar[slug]",
          },
          {
            inputType: "app-input",
            type: "text",
            name: this.$t("labels.slug") + this.$t("inEnglish"),
            placeholder: this.$t("labels.slug") + this.$t("inEnglish"),
            label: this.$t("labels.slug") + this.$t("inEnglish"),
            modelValue: "",
            rules: "required",
            key: "en[slug]",
          },
        ]
      );
    }
    if (this.data) {
      this.item = this.data;
      this.formData.map((el) => {
        if (el.key == "ar[title]") {
          el.modelValue = this.item.ar.title;
        } else if (el.key == "en[title]") {
          el.modelValue = this.item.en.title;
        } else if (el.key == "ar[desc]") {
          el.modelValue = this.item.ar.desc;
        } else if (el.key == "en[desc]") {
          el.modelValue = this.item.en.desc;
        } else if (el.key == "ar[name]") {
          el.modelValue = this.item.ar.name;
        } else if (el.key == "en[name]") {
          el.modelValue = this.item.en.name;
        } else if (el.key == "ar[slug]") {
          el.modelValue = this.item.ar.slug;
        } else if (el.key == "en[slug]") {
          el.modelValue = this.item.en.slug;
        } else {
          el.modelValue = this.item[el.key];
        }
      });
    }
  },
};
</script> -->
