<template>
  <base-card1>
    <VeeForm
      as="div"
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
    >
      <form class="mt-4 space-y-6">
        <div class="flex gap-2 items-center mb-3">
          <Switch
            v-model="initialValues.is_active"
            class="relative inline-flex h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
            :class="[initialValues.is_active ? 'bg-primary' : 'bg-gray-200']"
          >
            <span class="sr-only">{{ $t("LABELS.activated") }}</span>
            <span
              :class="[initialValues.is_active ? 'translate-x-5' : 'translate-x-0']"
              class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            />
          </Switch>
          <label class="label capitalize">
            {{
              initialValues.is_active ? $t("LABELS.activated") : $t("LABELS.inactivated")
            }}
          </label>
        </div>

        <base-input
          id="type"
          name="type"
          :label="$t('LABELS.type')"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.type') })"
          type="text"
        />
        <div class="grid md:grid-cols-2 gap-5">
          <base-file
            id="image"
            modalName="Section"
            modalType="image"
            name="image"
            :label="$t('LABELS.section image')"
            v-model:itemValue="initialValues.image_preview"
            v-model:image="initialValues.image"
            accept="image/png, image/webp, image/jpeg"
            :no_preview="true"
          />

          <base-file
            modalName="Section"
            modalType="image"
            id="icon"
            name="icon"
            :label="$t('LABELS.section icon')"
            v-model:itemValue="initialValues.icon_preview"
            v-model:image="initialValues.icon"
            accept="image/png, image/webp, image/jpeg"
            :no_preview="true"
          />
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <base-input
            id="titleAr"
            name="titleAr"
            :label="$t('LABELS.title') + ' (AR)'"
            type="text"
          />
          <base-input
            id="titleEn"
            name="titleEn"
            :label="$t('LABELS.title') + ' (EN)'"
            type="text"
          />
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

        <FieldArray name="features" v-slot="{ fields, push, remove }">
          <div class="border-t border-line pt-4 mt-4">
            <h3 class="font-semibold mb-3 text-lg">{{ $t("LABELS.features") }}</h3>

            <div
              v-for="(field, idx) in fields"
              :key="idx"
              class="grid md:grid-cols-2 gap-3 items-center border p-3 rounded-2xl"
            >
            <div class="hidden">
               <base-input
                :id="`feature-key-${idx}`"
                :name="`features[${idx}].key`"
                :label="$t('LABELS.key')"
                type="text"
              />
            </div>
         
              <base-file
                :id="`feature-icon-${idx}`"
                modalName="Feature"
                modalType="image"
                name="icon"
                :label="$t('LABELS.Icon')"
                v-model:itemValue="field.value.icon_preview"
                v-model:image="field.value.icon"
                accept="image/png, image/webp, image/jpeg"
                :no_preview="true"
              />
              <div class="flex flex-col">
               <base-input
                :id="`feature-ar-${idx}`"
                :name="`features[${idx}].ar`"
                :label="$t('LABELS.value') + ' (AR)'"
                type="text"
              />

              <base-input
                :id="`feature-en-${idx}`"
                :name="`features[${idx}].en`"
                :label="$t('LABELS.value') + ' (EN)'"
                type="text"
              />
              </div>

             

              <div class="col-span-2 flex justify-end gap-3">
                <button class="text-error" type="button" @click="remove(idx)">
                  <svg-icon name="trash copy" />
                </button>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <button
                type="button"
                class="text-primary font-semibold"
                @click="push({ key: '', icon: '', icon_preview: '', ar: '', en: '' })"
              >
                + {{ $t("BUTTONS.addFeature") }}
              </button>
            </div>
          </div>
        </FieldArray>
        <div class="flex justify-end items-center gap-5 pt-4 border-t border-line">
          <router-link to="/sections" class="text-sub font-semibold">
            {{ $t("BUTTONS.cancel") }}
          </router-link>
          <button type="submit" class="base-btn" :disabled="btnLoading">
            {{ $t("BUTTONS.save") }}
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
import { FieldArray } from "vee-validate";

const props = defineProps({
  data: Object,
  isLoading: Boolean,
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const btnLoading = ref(false);

const initialValues = reactive({
  type: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  image: "",
  icon: "",
  image_preview: "",
  icon_preview: "",
  is_active: true,
  features: [],
});

const schema = yup.object().shape({
  titleAr: yup.string().required(),
  titleEn: yup.string().required(),
  descriptionAr: yup.string().required(),
  descriptionEn: yup.string().required(),
  image: yup
    .mixed()
    .test(
      "image",
      t("ERRORS.isRequired", { name: t("LABELS.image") }),
      (v) => !!(v || initialValues.image_preview)
    ),
  icon: yup
    .mixed()
    .test(
      "icon",
      t("ERRORS.isRequired", { name: t("LABELS.icon") }),
      (v) => !!(v || initialValues.icon_preview)
    ),
});

function handleSubmit(values) {
  submitSection(values);
}

function submitSection(values) {
  btnLoading.value = true;
  const frm = new FormData();

  frm.append("type", values.type);
  frm.append("ar[title]", values.titleAr);
  frm.append("en[title]", values.titleEn);
  frm.append("ar[description]", values.descriptionAr);
  frm.append("en[description]", values.descriptionEn);
  frm.append("is_active", +values.is_active);

  if (initialValues.image) frm.append("image", initialValues.image);
  if (initialValues.icon) frm.append("icon", initialValues.icon);

  if (Array.isArray(values.features)) {
    values.features.forEach((f, i) => {
      frm.append(`features[${i}][key]`, f.key?.trim() || `feature_${i}`);
      frm.append(`features[${i}][ar][value]`, f.ar || "");
      frm.append(`features[${i}][en][value]`, f.en || "");


      if (f.icon) {
        frm.append(`features[${i}][icon]`, f.icon);
      } else if (f.icon_preview) {
        frm.append(`features[${i}][icon_preview]`, f.icon_preview);
      }
    });
  }

  const url = route.params.id ? `/sections/${route.params.id}` : `/sections`;
  axios
    .post(url, frm)
    .then((res) => {
      toast.success(res.data.message || "Success");
      setTimeout(() => router.push("/sections"), 1200);
    })
    .catch((err) => {
      toast.error(err.response?.data?.message || "Error occurred");
    })
    .finally(() => (btnLoading.value = false));
}

function setData() {
  if (!props.data) return;
  Object.assign(initialValues, props.data);

  if (Array.isArray(props.data.features)) {
    initialValues.features = props.data.features.map((f) => ({
      key: f.key || "",
      ar: f.ar?.value || "",
      en: f.en?.value || "",
      icon_preview: f.icon?.url || "",
      icon: "",
    }));
  }
}

onBeforeMount(setData);
</script>
