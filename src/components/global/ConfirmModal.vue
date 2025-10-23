<template>
  <Modal
    @close="emit('cancel')"
    class="z-[1013]"
    :title="$t('TITLES.confirmProcess')"
  >
    <img
      width="60"
      class="mx-auto"
      src="@/assets/images/icons/check.png"
      alt="check"
    />
    <h4 class="text-center font-bold text-lg mt-4" v-if="title">
      {{ title }}
    </h4>
    <h4 class="text-center text-sub mt-1" v-if="message">
      {{ message }}
    </h4>

    <div class="flex items-center justify-center gap-2 mt-5">
      <button
        :disabled="disabled"
        type="button"
        :class="btnConfirm"
        @click="emit('confirm')"
      >
        {{ $t(buttonName) }}
      </button>
      <button type="button" :class="btnCancel" @click="emit('cancel')">
        {{ $t("BUTTONS.cancel") }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
defineProps({
  disabled: {
    required: false,
  },

  classes: {
    required: false,
  },
  title: {
    required: false,
  },

  btnCancel: {
    required: false,
    default: "capitalize base-btn-white  rounded-xl py-4",
  },
  btnConfirm: {
    required: false,
    default: "capitalize base-btn-red rounded-xl py-4",
  },
  buttonName: {
    required: false,
    default: "BUTTONS.Yes Confirm",
  },
  message: {
    required: false,
  },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>
