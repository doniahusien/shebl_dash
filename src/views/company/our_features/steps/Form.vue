<template>
  <base-card1>
    <VeeForm
      as="div"
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
    >
      <form class="mt-4 space-y-6">


        <!-- Uploads -->
        <div class="grid md:grid-cols-2 gap-5">
          <base-file
            id="background"
            modalName="Feature"
            modalType="image"
            name="background"
            :label="$t('LABELS.background')"
            v-model:itemValue="initialValues.background_preview"
            v-model:image="initialValues.background"
            accept="image/png, image/webp, image/jpeg"
            :no_preview="true"
          />
          <base-file
            id="icon"
            modalName="Feature"
            modalType="image"
            name="icon"
            :label="$t('LABELS.icon')"
            v-model:itemValue="initialValues.icon_preview"
            v-model:image="initialValues.icon"
            accept="image/png, image/webp, image/jpeg"
            :no_preview="true"
          />
        </div>

        <!-- Text Inputs -->
        <div class="grid md:grid-cols-2 gap-4">
          <base-input id="titleAr" name="titleAr" :label="$t('LABELS.title') + ' (AR)'" type="text" />
          <base-input id="titleEn" name="titleEn" :label="$t('LABELS.title') + ' (EN)'" type="text" />
          <base-input
            id="descriptionAr"
            name="descriptionAr"
            :label="$t('LABELS.description') + ' (AR)'"
            type="textarea"
          />
          <base-input
            id="descriptionEn"
            name="descriptionEn"
            :label="$t('LABELS.description') + ' (EN)'"
            type="textarea"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end items-center gap-5 pt-4 border-t border-line">
          <router-link to="/our_features" class="text-sub font-semibold">
            {{ $t('BUTTONS.cancel') }}
          </router-link>
          <button type="submit" class="base-btn" :disabled="btnLoading">
            {{ $t('BUTTONS.save') }}
          </button>
        </div>
      </form>
    </VeeForm>
  </base-card1>
</template>

<script setup>
import { Switch } from "@headlessui/vue";
import { reactive, ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import axios from "axios";
import { toast } from "vue3-toastify";

const props = defineProps({
  data: Object,
  isLoading: Boolean,
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const btnLoading = ref(false);

const initialValues = reactive({
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  background: "",
  icon: "",
  background_preview: "",
  icon_preview: "",
});

const schema = yup.object().shape({
  titleAr: yup.string().required(),
  titleEn: yup.string().required(),
  descriptionAr: yup.string().required(),
  descriptionEn: yup.string().required(),
  background: yup.mixed().test(
    "background",
    t("ERRORS.isRequired", { name: t("LABELS.background") }),
    (value) => !!(value || initialValues.background_preview)
  ),
  icon: yup.mixed().test(
    "icon",
    t("ERRORS.isRequired", { name: t("LABELS.icon") }),
    (value) => !!(value || initialValues.icon_preview)
  ),
});

function handleSubmit(values) {
  submitFeature(values);
}

function submitFeature(values) {
  btnLoading.value = true;
  const frm = new FormData();

  frm.append("ar[title]", values.titleAr);
  frm.append("en[title]", values.titleEn);
  frm.append("ar[description]", values.descriptionAr);
  frm.append("en[description]", values.descriptionEn);

  if (initialValues.background) frm.append("background", initialValues.background);
  if (initialValues.icon) frm.append("icon", initialValues.icon);

  const url = route.params.id
    ? `/our-features/${route.params.id}`
    : `/our-features`;

  axios
    .post(url, frm)
    .then((res) => {
      toast.success(res.data.message || "Success");
      setTimeout(() => router.push("/our_features"), 1200);
    })
    .catch((err) => {
      toast.error(err.response?.data?.message || "Error occurred");
    })
    .finally(() => (btnLoading.value = false));
}

function setData() {
  if (!props.data) return;
  Object.assign(initialValues, props.data);
}

onBeforeMount(setData);
</script>
