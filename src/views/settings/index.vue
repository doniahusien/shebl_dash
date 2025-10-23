<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.webSettings')"
      back="/"
      class="mb-7"
    />

    <loader v-if="loading" />

    <VeeForm
      v-else
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
      class="w-full"
    >
      <base-card1 :title="$t('TITLES.generalSettings')" class="w-full mb-7">
        <div class="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 mt-4">
          <base-input
            id="email"
            name="email"
            :placeholder="$t('LABELS.email')"
            :label="$t('LABELS.email')"
            type="email"
            icon="envelope"
            v-model="initialValues.email"
          />

          <base-input
            id="phone"
            name="phone"
            :placeholder="$t('LABELS.phone')"
            :label="$t('LABELS.phone')"
            icon="phone"
            type="text"
            v-model="initialValues.phone"
          />

          <base-input
            id="address"
            name="address"
            :placeholder="$t('LABELS.address')"
            :label="$t('LABELS.address')"
            type="text"
            icon="location"
            v-model="initialValues.address"
          />

          <base-input
            id="appoitnments"
            name="appoitnments"
            :placeholder="$t('LABELS.appoitnments')"
            :label="$t('LABELS.appoitnments')"
            type="text"
            icon="calendar"
            v-model="initialValues.appoitnments"
          />

          <base-input
            id="facebook"
            name="facebook"
            :label="$t('LABELS.facebook')"
            :placeholder="$t('LABELS.enterFacebookLink')"
            type="url"
            icon="facebook"
            v-model="initialValues.facebook"
          />

          <base-input
            id="instagram"
            name="instagram"
            :label="$t('LABELS.instagram')"
            :placeholder="$t('LABELS.enterInstagramLink')"
            type="url"
            icon="instagram"
            v-model="initialValues.instagram"
          />
        </div>
      </base-card1>

      <div class="flex items-center justify-end gap-7">
        <router-link to="/" class="capitalize font-semibold text-sub">
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button
        
          type="submit"
          class="base-btn rounded-md"
          :disabled="btnLoading"
        >
          {{ $t("BUTTONS.save") }}
        </button>
      
      </div>
    </VeeForm>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();

const btnLoading = ref(false);
const loading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "",
    name: t("TITLES.home"),
  },
  {
    path: "/settings",
    imgIcon: "",
    name: t("TITLES.webSettings"),
  },
];

const initialValues = reactive({
  ar_desc: "",
  en_desc: "",
  email: "",
  phone: "",
  address: "",
  appoitnments: "",
  facebook: "",
  instagram: "",
  x: "",
});

const schema = yup.object().shape({
  email: yup
    .string()
    .email(t("ERRORS.validEmailAddress"))
    .required(t("ERRORS.isRequired", { name: t("LABELS.email") })),
  phone: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.phone") })),
  address: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.address") })),
  appoitnments: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.appoitnments") })),
  facebook: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .nullable(),
  instagram: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .nullable(),
});

function handleSubmit(values) {
  btnLoading.value = true;

  axios
    .post("/contact-info", values)
    .then((res) => {
      router.push("/settings");
      toast.success(("updateSuccess"));
      btnLoading.value = false;
    })
    .catch((e) => {
      toast.error(e.response.data.message);
      btnLoading.value = false;
    });
}

function getData() {
  loading.value = true;
  axios
    .get("/contact-info")
    .then((res) => {
      if (res.data.status === "success") {
        setData(res.data.data);
      } else {
        loading.value = false;
      }
    })
    .catch((error) => {
      toast.error(t("ERRORS.fetchFailed"));
      loading.value = false;
    });
}

function setData(result) {
  result.forEach((el) => {
    initialValues[el.key] = el.value;
  });
  setTimeout(() => (loading.value = false), 300);
}

onMounted(() => {
    getData();
});
</script>

