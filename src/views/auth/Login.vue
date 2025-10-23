<template>
  <div class="flex flex-col flex-1 justify-center">
    <h2 class="text-text font-bold mb-4 text-2xl">
      <img
        width="68"
        height="68"
        src="@/assets/images/hands.png"
        alt="hands"
        class="mb-6"
      />
      {{ t("TITLES.welcomeTo") }}
      <span>, {{ t("TITLES.Login") }}</span>
    </h2>

    <VeeForm class="w-full" @submit="handleSubmit" :validation-schema="schema">
      <div class="space-y-4">
        <base-input
          id="email"
          name="email"
          :placeholder="t('LABELS.email')"
          :label="t('LABELS.email')"
          icon="envelope"
        />

        <base-password
          id="password"
          name="password"
          :placeholder="t('LABELS.Enter', { name: t('LABELS.password') })"
          icon="key"
        />
      </div>

      <button
        :disabled="loading"
        type="submit"
        class="base-btn w-full rounded-md mt-6"
      >
        {{ t("BUTTONS.login") }}
      </button>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { configure } from "vee-validate";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import * as yup from "yup";

import { useAppStore } from "@/store/app";
import { useAppAuth } from "@/store/auth";

const router = useRouter();
const appStore = useAppStore();
const appAuth = useAppAuth();

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const { t } = useI18n();

const schema = yup.object().shape({
  email: yup
    .string()
    .email(t("ERRORS.validEmailAddress"))
    .required(t("ERRORS.isRequired", { name: t("LABELS.email") })),

  password: yup.string().required(t("ERRORS.password")),
});

const loading = ref(false);

type schem = {
  email: string;
  password: string;
};

async function handleSubmit(values: schem) {
  loading.value = true;

  await axios
    .post("auth/login", values)
    .then(async (res) => {
      localStorage.setItem("jwt_token_shebl_global", res.data.data.token);
      localStorage.setItem(
        "shebl_global_user_data",
        JSON.stringify(res.data.data)
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.data.token}`;
      setTimeout(() => {
        toast.success(res.data.message)
        router.push("/")
      }, 400);

      appAuth.token = res.data.data.token;
      appAuth.userData = res.data.data;
      appAuth.user_type = res.data.data.user_type;
      localStorage.setItem("shebl_global_user_type", res.data.data.user_type);
      appStore.is_auth = `Bearer ${res.data.data.token}`;

      loading.value = false;
    })
    .catch((e) => {
      loading.value = false;
      toast.error(e.response.data.message);
    });
}
</script>
