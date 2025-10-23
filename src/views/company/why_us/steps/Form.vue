<template>
  <base-card1>
    <VeeForm
      as="div"
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
    >
      <form class="mt-4 space-y-6">
        <!-- Is Active Switch -->
        <div class="flex gap-2 items-center mb-3">
          <Switch v-model="initialValues.is_active"
            class="relative inline-flex h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
            :class="[initialValues.is_active ? 'bg-primary' : 'bg-gray-200']"
          >
            <span class="sr-only">{{ $t('LABELS.activated') }}</span>
            <span
              :class="[initialValues.is_active ? 'translate-x-5' : 'translate-x-0']"
              class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            />
          </Switch>
          <label class="label capitalize">
            {{ initialValues.is_active ? $t('LABELS.activated') : $t('LABELS.inactivated') }}
          </label>
        </div>

        <!-- Key field for EN -->
        <base-input
          id="enKey"
          name="enKey"
          :label="$t('LABELS.Key') + ' (EN)'"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.Key') })"
          type="text"
        />

        <!-- Key field for AR -->
        <base-input
          id="arKey"
          name="arKey"
          :label="$t('LABELS.Key') + ' (AR)'"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.Key') })"
          type="text"
        />

        <!-- Value field -->
        <base-input
          id="value"
          name="value"
          :label="$t('LABELS.value')"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.value') })"
          type="text"
        />

        <!-- Icon field -->
        <base-file
          id="icon"
          name="icon"
            modalName="Section"
  modalType="image"
          :label="$t('LABELS.icon')"
          v-model:itemValue="initialValues.icon_preview"
          v-model:image="initialValues.icon"
          accept="image/png, image/webp, image/jpeg"
          :no_preview="true"
        />


        <div class="flex justify-end items-center gap-5 pt-4 border-t border-line">
          <router-link to="/why-us" class="text-sub font-semibold">
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
  enKey: "",
  arKey: "",
  value: "",
  icon: "",
  image: "",
  icon_preview: "",
  is_active: true,
});

const schema = yup.object().shape({
  enKey: yup.string().required(),
  arKey: yup.string().required(),
  value: yup.string().required(),

  icon: yup.mixed().test(
    "icon",
    t("ERRORS.isRequired", { name: t("LABELS.icon") }),
    (value) => !!(value || initialValues.icon_preview)
  ),
});

function handleSubmit(values) {
  submitWhyUs(values);
}

function submitWhyUs(values) {
  btnLoading.value = true;
  const frm = new FormData();
  frm.append("en[key]", values.enKey);
  frm.append("ar[key]", values.arKey);
  frm.append("value", values.value);

  if (initialValues.icon) {
    frm.append("icon", initialValues.icon);
  }
  frm.append("is_active", +values.is_active);

  const url = route.params.id
    ? `/why-us/${route.params.id}`
    : `/why-us`;

  axios
    .post(url, frm)
    .then((res) => {
      toast.success(res.data.message || "Success");
      setTimeout(() => router.push("/why_us"), 1200);
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
