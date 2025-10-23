<template>
  <button
    @click="confirmSwith"
    type="button"
    :class="classes"
    class="flex items-center gap-1 text-xl capitalize text-red-500"
  >
    <i v-if="icon" :class="icon"></i>
    <svg-icon :class="iconClass" v-else-if="!noIcon" :name="iconName" />

    <span v-if="title" class="!text-[16px]">{{ title }}</span>
  </button>
  <Teleport to="body">
    <Modal
      class="z-[1013]"
      :title="$t('TITLES.confirmProcess')"
      v-if="openModal"
      @close="openModal = false"
    >
      <img
        width="60"
        class="mx-auto"
        src="@/assets/images/icons/delete.png"
        alt="delete"
      />
      <h4 class="text-center font-bold text-lg mt-4">
        {{ $t(message) }}
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
          {{ $t(buttonName) }}
        </button>
      </div>
    </Modal>
  </Teleport>
  <teleport to="body">
    <notify
      @close="failmodal = false"
      v-if="failmodal"
      class="z-[99999]"
      classes=" px-6  py-11 !w-full  !max-w-[350px]"
    >
      <svg-icon name="warning-2" class="mb-4 mx-auto" />
      <h3 class="text-text font-bold mb-2 text-2xl text-center">
        {{ $t("Sorry") }}
      </h3>
      <p class="text-center text-sub">
        {{ failmessage }}
      </p>
    </notify>
  </teleport>
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
  modalType: {
    required: false,
  },
  icon: {
    required: false,
  },
  method: {
    required: false,
    default: "post",
  },
  iconName: {
    required: false,
    default: "trash",
  },
  iconClass: {
    required: false,
    default: "",
  },
  id: {
    required: true,
  },
  classes: {
    required: false,
  },
  title: {
    required: false,
  },
  noIcon: {
    required: false,
    default: false,
  },
  buttonName: {
    required: false,
    default: "BUTTONS.delete",
  },
  message: {
    required: false,
    default: "TITLES.finalDelete",
  },
});

const disabled = ref(false);
const openModal = ref(false);
const failmodal = ref(false);
const failmessage = ref("");

const emit = defineEmits(["remove"]);

function confirmSwith() {
  openModal.value = true;
}

function confirm() {
  if (!props.url) {
    openModal.value = false;
    emit("remove");
    return;
  }
  disabled.value = true;
  const frmData = new FormData();
  if (props.id) {
    frmData.append("id", props.id);
  }
  if (props.modalType) {
    frmData.append("model", props.modalType);
  }
  axios({
    method: props.method,
    url: props.url,
    data: frmData,
  })
    .then((res) => {
      toast.success(res.data.message ? res.data.message : res.data.messages);
      disabled.value = false;
      openModal.value = false;
      emit("remove", res.data.data);
    })
    .catch((err) => {
      console.log(err);
      failmessage.value = err.response.data?.message;
      failmodal.value = true;

      setTimeout(() => {
        failmodal.value = false;
        failmessage.value = "";
      }, 2000);
      disabled.value = false;
    });
}
</script>
