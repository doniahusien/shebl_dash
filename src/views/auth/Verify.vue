<template>
  <div class="flex flex-col flex-1 justify-center">
    <button type="button" class="w-fit mb-4" @click="$router.back(-1)">
      <i
        :class="
          $i18n.locale == 'ar'
            ? ' fas fa-arrow-right-long'
            : 'fas fa-arrow-left-long'
        "
      ></i>
    </button>
    <h1 class="mb-12 text-text font-bold text-2xl">
      {{ $t("TITLES.verifyPhoneNumber") }}
    </h1>

    <div class="register_form">
      <VeeForm @submit="onSubmit">
        <div
          class="input_wrapper otp_inputs justify-between"
          :class="errorMessage ? 'error' : ''"
        >
          <v-otp-input
            ref="otpInput"
            input-classes="otp-input"
            separator=" "
            v-model="verify_code"
            :value="verify_code"
            :num-inputs="4"
            :should-auto-focus="true"
            input-type="letter-numeric"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />
          <p class="text-red-500 mt-2 text-sm mb-0" v-if="errorMessage">
            {{ errorMessage }}
          </p>
        </div>

        <div class="flex items-center mb-6">
          <p>
            {{ $t("TITLES.ifYouDontReceiveCode") }}
            <span>
              <bdi>00:{{ seconds < 10 ? "0" : "" }}{{ seconds }}</bdi>
            </span>
            {{ $t("LABELS.Second") }}
          </p>
          <button
            :disabled="seconds != 0 || minutes != 0"
            class="text-primary ms-2 font-medium disabled:!text-sub disabled:cursor-default"
            type="button"
            @click="resendCode"
            v-if="seconds == 0"
          >
            {{ $t("BUTTONS.resend") }}
          </button>
        </div>

        <button
          type="submit"
          :disabled="isSubmitLoading"
          class="base-btn rounded-full w-full py-5 mt-6"
        >
          {{ $t("BUTTONS.confirm") }}
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import VOtpInput from "vue3-otp-input";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const verify_code = ref("");
const errorMessage = ref("");
const router = useRouter();

const validation = reactive({
  valid: false,
  touched: false,
});

const emailAddress = computed(() => sessionStorage.getItem("emailAddress"));
function handleOnComplete(event) {
  validation.touched = false;
  validation.valid = true;

  verify_code.value = event;
}
function handleOnChange(e) {
  validation.touched = true;
  validation.valid = false;

  if (e.length == 4) {
    errorMessage.value = "";
  } else {
    errorMessage.value = i18n.t("ERRORS.verificationCode");
  }
}

const seconds = ref(30);
const minutes = ref(0);

function countDown() {
  seconds.value = 30;
  let secondsInterval = setInterval(() => {
    if (seconds.value <= 0) {
      clearTimeout(secondsInterval);
      if (minutes.value == 0) return;
    }
    seconds.value--;
  }, 1000);
}

const loggedInSuccess = ref(false);

const isSubmitLoading = ref(false);
function onSubmit() {
  if (!verify_code.value || verify_code.value.length != 4) {
    errorMessage.value = i18n.t("ERRORS.verificationCode");
    return;
  }

  isSubmitLoading.value = true;
  const frmData = new FormData();
  frmData.append("code", verify_code.value);

  frmData.append("email", emailAddress.value);
  axios
    .post("check_code", frmData)
    .then((res) => {
      sessionStorage.setItem("verifyCode", verify_code.value);
      validation.touched = false;
      validation.valid = false;
      verify_code.value = "";
      toast.success(res.data.message, {
        autoClose: 3000,
      });
      setTimeout(() => {
        isSubmitLoading.value = false;
        router.push("/auth/reset-password");
      }, 1000);
    })
    .catch((e) => {
      verify_code.value = "";
      isSubmitLoading.value = false;

      toast.error(e.response.data.message);
    });
  validation.touched = false;
  validation.valid = true;
}
function resendCode() {
  isSubmitLoading.value = true;
  const frmData = new FormData();

  frmData.append("email", emailAddress.value);

  axios
    .post("resend_code", frmData)
    .then((res) => {
      validation.touched = false;
      validation.valid = false;
      verify_code.value = "";
      toast.success(res.data.message, {
        autoClose: 3000,
      });
      countDown();
      isSubmitLoading.value = false;
    })
    .catch((e) => {
      isSubmitLoading.value = false;

      toast.error(e.response.data.message);
    });
}

function changeEmail() {
  emailAddress.value = null;
  sessionStorage.removeItem("emailAddress");
  router.push("/auth/forget-password");
}

onMounted(() => {
  countDown();

  // if (!emailAddress.value) {
  //   router.push("/auth/forget-password");
  // }
});
</script>

<style lang="scss">
.otp_inputs {
  @apply w-full;

  & > div {
    @apply justify-center;

    & > div {
      @apply me-3 flex-1 last:me-0;

      input {
        @apply text-center font-bold text-xl w-[104px] h-[104px];
        border-color: #e3f0fa !important;
      }
    }
  }
}
</style>
