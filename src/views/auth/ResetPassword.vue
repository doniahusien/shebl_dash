<template>
  <div class="change_password_page">
    <h1 class="mb-11">
      <span class="text-5xl capitalize font-bold leading-9 block">
        {{ $t("TITLES.Change Password") }}
      </span>
    </h1>
    <VeeForm
      @click.stop
      as="div"
      @submit="onSubmit"
      :validation-schema="schema"
    >
      <form>
        <div class="grid gap-2">
          <base-password
            id="password"
            name="password"
            :placeholder="$t('LABELS.newPassword')"
            label="newPassword"
            icon="key"
          />
          <base-password
            id="cPassword"
            name="cPassword"
            :placeholder="$t('LABELS.cNewPassword')"
            label="cNewPassword"
            icon="key"
          />
        </div>

        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="base-btn rounded-lg w-full py-4 mt-11"
            :disabled="btnLoading"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
      </form>
    </VeeForm>
    <teleport to="body">
      <notify
        v-if="showMessage"
        @close="
          showMessage = false;
          $router.push('/auth/login');
        "
      >
        <div class="p-2 py-5">
          <img
            class="mx-auto"
            src="@/assets/images/icons/success.png"
            alt="sucess"
          />
          <p
            class="font-bold mt-4 text-text max-w-[214px] mx-auto text-center text-2xl"
          >
            {{ message }}
          </p>
        </div>
      </notify>
    </teleport>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { onMounted, ref, computed } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import axios from "axios";
const message = ref("");
const showMessage = ref(false);
const router = useRouter();

const i18n = useI18n();
const schema = yup.object({
  password: yup.string().required(i18n.t("ERRORS.newPassword")),
  cPassword: yup
    .string()
    .when("password", (password, field) =>
      password
        ? field
            .required(i18n.t("ERRORS.confirmNewPassword"))
            .oneOf([yup.ref("password")], i18n.t("ERRORS.notEqualPasswords"))
        : field
    ),
});
const emailAddress = computed(() => sessionStorage.getItem("emailAddress"));
const verifyCode = computed(() => sessionStorage.getItem("verifyCode"));

const btnLoading = ref(false);

function onSubmit(e, actions) {
  const SUBMITDATA = new FormData();

  SUBMITDATA.append("email", emailAddress.value);
  SUBMITDATA.append("password", e.password);
  SUBMITDATA.append("code", verifyCode.value);
  axios
    .post("reset_password", SUBMITDATA)
    .then((res) => {
      sessionStorage.removeItem("emailAddress");
      sessionStorage.removeItem("verifyCode");

      message.value = res.data.message;

      setTimeout(() => (showMessage.value = true), 300);
      setTimeout(() => {
        showMessage.value = false;
        router.push("/auth/login");
      }, 3000);

      actions.resetForm();
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

onMounted(() => {
  if (!emailAddress.value) {
    router.push("/auth/forget-password");
  } else if (!verifyCode.value) {
    router.push("/auth/verify");
  }
});
</script>
<style lang="scss">
.change_password_page {
  .inset-xe-3 {
    inset-inline-end: 1rem;
  }
  input {
    @apply py-5;
  }
}
</style>
