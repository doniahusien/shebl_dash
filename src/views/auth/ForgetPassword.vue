<template>
  <div class="mt-24 flex flex-col justify-between">
    <div>
      <h2
        class="text-text font-bold mb-3 text-3xl md:text-4xl flex items-center gap-3"
      >
        <!-- <router-link
            class="block text-end text-xl text-primary"
            to="/auth/login"
          >
            <i
              class="fas"
              :class="$i18n.locale == 'en' ? 'fa-arrow-left' : 'fa-arrow-right'"
            ></i>
          </router-link> -->
        {{ $t("TITLES.resetPassword") }}
      </h2>
      <p class="text-sub mb-7 capitalize">
        {{
          $t("TITLES.pleaseEnterYourEmailAddressBelowToRecoveryYourPassword")
        }}
      </p>

      <VeeForm as="div" @submit="handleSubmit" :validation-schema="schema">
        <form class="w-100" aria-autocomplete="none">
          <base-input
            id="emailAddress"
            name="emailAddress"
            :placeholder="$t('LABELS.emailAddress')"
            :label="$t('LABELS.emailAddress')"
            type="email"
            icon="envelope"
          />

          <button
            :disabled="loading"
            type="submit"
            block
            class="base-btn capitalize rounded-lg w-full py-5 mt-11"
          >
            {{ $t("BUTTONS.send") }}
          </button>
        </form>
      </VeeForm>
    </div>
  </div>
  <router-link
    to="/auth/login"
    class="text-primary flex items-center gap-2 mt-auto pb-5"
  >
    <i
      class="fas mt-1"
      :class="$i18n.locale == 'en' ? ' fa-arrow-left' : ' fa-arrow-right'"
    ></i>
    {{ $t("BUTTONS.back") }}
  </router-link>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import * as yup from "yup";
import { configure } from "vee-validate";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const i18n = useI18n();

const schema = yup.object().shape({
  emailAddress: yup.string().required(i18n.t("ERRORS.emailAddress")),
});

const loading = ref(false);

type schem = {
  emailAddress: string;
};

function handleSubmit(values: schem) {
  loading.value = true;
  const frmData = new FormData();
  frmData.append("email", values.emailAddress);

  axios
    .post("forgot_password", frmData)
    .then((res) => {
      sessionStorage.setItem("emailAddress", values.emailAddress);

      setTimeout(() => toast.success(res.data.message), 400);

      loading.value = false;
      router.push("/auth/verify");
    })
    .catch((e) => {
      loading.value = false;

      toast.error(e.response.data.message);
    });
}
</script>

<style lang="scss">
.login_page {
  input {
    @apply py-5;
  }
}
</style>
