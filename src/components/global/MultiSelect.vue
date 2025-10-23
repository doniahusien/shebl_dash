<template>
  <button
    @click="openModal = true"
    class="flex items-center gap-1 text-primary text-lg capitalize"
  >
    <span class="w-[20px]">
      <input-icon name="print" />
    </span>
    <span class="font-semibold">{{ btnName }}</span>
  </button>

  <Teleport to="body">
    <Modal
      :title="$t('TITLES.confirmProcess')"
      v-if="openModal"
      @close="openModal = false"
      class="z-[1009]"
    >
      <!-- <input-icon name="print" class="mx-auto text-4xl w-7" /> -->

      <h4 class="text-center font-bold text-lg mt-4">
        {{ message }}
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
          {{ $t("BUTTONS.print") }}
        </button>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  message: {
    required: true,
  },
  btnName: {
    required: true,
  },
});

const openModal = ref(false);

const emit = defineEmits(["print"]);

function confirm() {
  emit("print");
  openModal.value = false;
}
</script>
