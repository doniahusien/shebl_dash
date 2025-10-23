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

        <!-- Text Inputs -->
        <div class="grid md:grid-cols-2 gap-4">
          <base-input id="quetionAr" name="quetionAr" :label="$t('LABELS.Question') + ' (AR)'" type="text" />
          <base-input id="quetionEn" name="quetionEn" :label="$t('LABELS.Question') + ' (EN)'" type="text" />
          <base-input
            id="answerAr"
            name="answerAr"
            :label="$t('LABELS.answer') + ' (AR)'"
            type="textarea"
          />
          <base-input
            id="answerEn"
            name="answerEn"
            :label="$t('LABELS.answer') + ' (EN)'"
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
  quetionAr:  "",
  quetionEn: "",
  answerAr: "",
  answerEn: "",
  is_active: true,  // Add the is_active field here
});

const schema = yup.object().shape({
  quetionAr: yup.string().required(),
  quetionEn: yup.string().required(),
  answerAr: yup.string().required(),
  answerEn: yup.string().required(),
  is_active: yup.boolean().required(),  // Optionally validate the is_active field
});

function handleSubmit(values) {
  submitFeature(values);
}

function submitFeature(values) {
  btnLoading.value = true;
  const frm = new FormData();

  frm.append("ar[question]", values.quetionAr);
  frm.append("en[question]", values.quetionEn);
  frm.append("ar[answer]", values.answerAr);
  frm.append("en[answer]", values.answerEn);
  frm.append("is_active", values.is_active ? 1 : 0); // Add is_active to form data

  const url = route.params.id
    ? `/faq/${route.params.id}`
    : `/faq`;

  axios
    .post(url, frm)
    .then((res) => {
      toast.success(res.data.message || "Success");
      setTimeout(() => router.push("/faq"), 1200);
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
