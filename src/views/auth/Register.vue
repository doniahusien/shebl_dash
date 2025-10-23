<template>
  <div class="login_page position-relative">
    <div class="mt-24 max-w-[700px] mx-auto">
      <div>
        <h2 class="text-text font-medium mb-11 text-2xl md:text-4xl">
          {{ $t("TITLES.welcomeTo") }}
          <span class="block font-bold mt-4">{{
            $t("TITLES.MEATelecome")
          }}</span>
        </h2>

        <VeeForm as="div" @submit="handleSubmit" :validation-schema="schema">
          <form class="w-100" aria-autocomplete="none">
            <base-input
              id="emailAddress"
              name="emailAddress"
              :placeholder="$t('LABELS.emailAddress')"
              :label="$t('LABELS.emailAddress')"
              type="email"
              label-icon="envelope"
            />
            <base-password
              id="password"
              name="password"
              :placeholder="$t('LABELS.password')"
              :label="$t('LABELS.password')"
              label-icon="key"
            />
            <router-link
              class="block text-end text-primary"
              to="/auth/forget-password"
            >
              {{ $t("LABELS.forgetYourPassword") }}
            </router-link>

            <!-- <div class="d-flex align-items-center justify-content-between">
              <v-checkbox
                v-model="rememberMe"
                :label="$t('LABELS.rememberMe')"
              />

              <RouterLink
                to="/"
                class="text-white text-decoration-none tw-font-light"
                >{{ $t("BUTTONS.resetPassword") }}</RouterLink
              >
            </div> -->

            <button
              :disabled="loading"
              type="submit"
              block
              class="base-btn rounded-lg w-full py-5 mt-11"
            >
              {{ $t("BUTTONS.login") }}
            </button>

            <p class="text-center mt-5">
              {{ $t("TITLES.dontHaveAnAccount") }}
              <router-link
                class="ms-1 text-end text-primary"
                to="/auth/reset-password"
              >
                {{ $t("LABELS.createAccount") }}
              </router-link>
            </p>
          </form>
        </VeeForm>
      </div>
    </div>

    <img
      src="@/assets/images/icons/login.svg"
      class="position-absolute top-0 start-0 h-100 object-fit-contain pointer-events-none user-select-none"
      alt="logo"
    />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import * as yup from "yup";
import { configure } from "vee-validate";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const i18n = useI18n();

const schema = yup.object().shape({
  emailAddress: yup.string().required(i18n.t("ERRORS.emailAddress")),
  password: yup.string().required(i18n.t("ERRORS.password")),
});

const rememberMe = ref(false);

const loading = ref(false);

type schema = {
  emailAddress: string;
  password: string;
};

async function handleSubmit(values) {
  loading.value = true;
  const frmData = new FormData();
  frmData.append("email", values.emailAddress);
  frmData.append("password", values.password);

  try {
    const res = await axios.post("login", frmData);

    const { token, ...userData } = res.data.data;

    localStorage.setItem("jwt_token_lavander_global", token);
    localStorage.setItem("lavander_global_user_data", JSON.stringify(userData));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    toast.success(i18n.t("TEXT.loggedInSuccessfully"));

    setTimeout(() => {
      location.reload();
    }, 100);

  } catch (e) {
    console.error(e.response?.data?.message || e.message);
    toast.error(e.response?.data?.message || i18n.t("TEXT.loginFailed"));
    loading.value = false;
  }
}

</script>

<style lang="scss">
.login_page {
  input {
    @apply py-5;
  }
}
</style>
