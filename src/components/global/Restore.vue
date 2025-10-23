<template>
  <button
    @click="confirmSwith"
    type="button"
    class="flex items-center gap-3 text-xl text-green-500 capitalize"
  >
    <i class="fa-solid fa-rotate-right"></i>
  </button>
  <Teleport to="body">
    <Modal
      :title="$t('TITLES.confirmProcess')"
      v-if="true"
      class="z-[1009]"
      @close="
        emit('close');
        openModal = false;
      "
    >
      <img
        width="60"
        class="mx-auto"
        src="@/assets/images/icons/check.png"
        alt="check"
      />
      <h4 class="text-center font-bold text-lg mt-4">
        {{ $t("TITLES.areYouSureToRestore") }}
      </h4>

      <div class="flex items-center justify-center gap-2 mt-5">
        <button
          type="button"
          class="capitalize base-btn-white"
          @click="
            emit('close');
            openModal = false;
          "
        >
          {{ $t("BUTTONS.cancel") }}
        </button>
        <button
          :disabled="disabled"
          type="button"
          class="capitalize base-btn-red"
          @click="confirm"
        >
          {{ $t("BUTTONS.restore") }}
        </button>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  url: {
    required: false,
  },
});

const disabled = ref(false);
const openModal = ref(false);

const emit = defineEmits(["remove", "close"]);

function confirmSwith() {
  openModal.value = true;
}

function confirm() {
  disabled.value = true;

  const frmData = new FormData();
  frmData.append("_method", "PUT");

  axios
    .post(props.url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      disabled.value = false;
      openModal.value = false;
      emit("remove");
    })
    .catch((err) => {
      disabled.value = false;
      toast.error(err.response.data.message);
    });
}
</script>
