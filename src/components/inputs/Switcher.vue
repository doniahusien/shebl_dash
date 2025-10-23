<template>
  <div class="switcher">
    <v-switch
      :disabled="loading || disabled"
      :loading="loading"
      :color="color"
      :value="modalValue"
      :model-value="true"
      @click="confirmSwith"
    ></v-switch>

    <Teleport to="body">
      <Modal
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

        <div
          class="input_wrapper"
          v-if="name == 'is_ban' && modalValue == false"
        >
          <label for="ban_reason">{{ $t("LABELS.banReason") }}</label>
          <textarea
            name="ban_reason"
            id="ban_reason"
            rows="5"
            v-model="ban_reason"
          ></textarea>
        </div>

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
import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
const props = defineProps({
  url: {
    required: true,
  },
  modalValue: {
    required: true,
  },
  name: {
    required: false,
  },
  color: {
    required: false,
    default: "success",
  },
});
const ban_reason = ref("");
const loading = ref(false);
const disabled = ref(false);
const openModal = ref(false);

const emit = defineEmits(["update:modalValue", "close"]);

function confirmSwith(event) {
  event.preventDefault();
  openModal.value = true;
}

function confirm() {
  const frmData = new FormData();
  let status = !props.modalValue;

  frmData.append("_method", "PUT");

  frmData.append(props.name, +status);

  if (props.name == "is_ban" && status) {
    frmData.append("ban_reason", ban_reason.value);
  }
  axios.post(props.url, frmData).then((res) => {
    emit("update:modalValue", !props.modalValue);
    toast.success(res.data.message);
    openModal.value = false;
  });
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
