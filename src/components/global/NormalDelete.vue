<template>
  <button
    @click="confirmSwith"
    type="button"
    class="flex items-center gap-3 text-xl text-red-500 capitalize"
  >
    <i class="fa-solid fa-trash"></i>
  </button>
  <Teleport to="body">
    <Modal
      :title="$t('TITLES.confirmProcess')"
      v-if="openModal"
      class="z-[1009]"
      @close="openModal = false"
    >
      <img
        width="60"
        class="mx-auto"
        src="@/assets/images/icons/delete.png"
        alt="delete"
      />
      <h4 class="text-center font-bold text-lg mt-4">
        {{ $t("TITLES.finalDelete") }}
      </h4>

      <div class="flex items-center justify-center gap-2 mt-5">
        <button
          type="button"
          class="capitalize base-btn-white"
          @click="openModal = false"
        >
          {{ $t("BUTTONS.cancel") }}
        </button>
        <button
          :disabled="disabled"
          type="button"
          class="capitalize base-btn-red"
          @click="confirm"
        >
          {{ $t("BUTTONS.delete") }}
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

const emit = defineEmits(["remove"]);

function confirmSwith() {
  openModal.value = true;
}

function confirm() {
  disabled.value = true;

  axios
    .delete(props.url)
    .then((res) => {
      toast.success(res.data.messages);
      disabled.value = false;
      openModal.value = false;
      emit("remove");
    })
    .catch((err) => {
      disabled.value = false;
      toast.error(t(err.response.data.message));
    });
}
</script>
