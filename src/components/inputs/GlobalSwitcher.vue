<template>
  <div class="switcher">
    <Switch
      :disabled="loading || disabled"
      :loading="loading"
      :value="modalValue"
      @click="confirmSwith"
      :class="modalValue ? 'bg-primary' : 'bg-gray-200'"
      class="relative inline-flex h-6 w-11 items-center rounded-full disabled:opacity-50"
    >
      <span class="sr-only">Enable publish</span>
      <span
        :class="
          modalValue
            ? locale === 'ar'
            ? '-translate-x-6'
            : 'translate-x-6'
            : locale === 'ar'
            ? '-translate-x-1'
            : 'translate-x-1'
        "
        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
      ></span>
    </Switch>
    <Teleport to="body">
      <Modal
        class="z-[1009]"
        :title="$t('TITLES.confirmProcess')"
        v-if="openModal"
        @close="openModal = false"
      >
        <img
          width="60"
          class="mx-auto"
          src="@/assets/images/icons/check.png"
          alt="check"
        />
        <h4 class="text-center font-bold text-lg mt-4">
          {{ $t("TITLES.areYouSureToConfirm") }}
        </h4>

        <div class="flex items-center justify-center gap-2 mt-5">
          <button
            type="button"
            class="capitalize base-btn-white"
            @click="openModal = false"
          >
            {{ $t("BUTTONS.cancel") }}
          </button>
          <button type="button" class="capitalize base-btn" @click="confirm">
            {{ $t("BUTTONS.confirm") }}
          </button>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup>
import { Switch } from "@headlessui/vue";
import { toast } from "vue3-toastify";
import { ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
const props = defineProps({
  model: {
    required: false,
  },
  id: {
    required: true,
  },
  url: {
    required: false,
  },
  modalValue: {
    required: false,
  },
  method: {
    required: false,
    default: "PATCH",
  },

  color: {
    required: false,
    default: "success",
  },
  disabled: {
    required: false,
    default: false,
  },
});

const loading = ref(false);

const openModal = ref(false);
const { t, locale } = useI18n();

const emit = defineEmits(["update:modalValue", "close", "refresh"]);

function confirmSwith(event) {
  event.preventDefault();
  openModal.value = true;
}

function confirm() {
  const frmData = new FormData();
  const status = !props.modalValue;

  let url;
  if (props.url) {
    url = props.url;
    frmData.append("_method", props.method);
  } else {
    url = `is_active/${props.id}`;

    frmData.append("model", props.model);
    frmData.append("is_active", +status);
    frmData.append("_method", "PUT");
  }

  axios
    .post(url, frmData)
    .then((res) => {
      emit("update:modalValue", !props.modalValue);
      emit("refresh");

      toast.success(t("Edited successfully"));
      openModal.value = false;
    })
    .catch((err) =>
      toast.error(err.response.data.message ?? err.response.data.messages)
    );
}
</script>

<style lang="scss">
.switcher {
  .v-input__details {
    display: none !important;
  }
  .v-input {
    padding: 0;
    width: fit-content;
  }
  .v-input__control {
    height: 25px;
    align-items: center;
    .v-selection-control {
      display: inline;
      min-height: 25px !important;
      height: 25px;
      .v-selection-control__wrapper {
        height: fit-content;
        .v-selection-control__input {
          height: fit-content;
          input,
          &::before {
            display: none;
          }
        }
      }
    }
  }
}
</style>
