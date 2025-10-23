<template>
  <div
    class="base-modal px-3 bg-[#00000083] flex items-center justify-center fixed top-0 left-0 w-screen h-screen z-[9901]"
    @click="close"
    :class="mainClass"
  >
    <div
      @click.stop
      :class="classes"
      class="relative base-modal-content w-fit rounded-2xl bg-white md:w-fit max-w-[700px] md:min-w-[450px]"
    >
      <button
        type="button"
        class="size-9 rounded-full shadow-card absolute start-5 -top-4 z-10 bg-white"
        :class="iconColor"
        @click="emit('close')"
      >
        <i class="fas fa-times"></i>
      </button>
      <div
        class="relative w-full md:w-fit max-w-[700px] md:min-w-[450px] max-h-[90vh] overflow-y-auto"
        :class="classes"
      >
        <div
          v-if="!hideHeader"
          class="flex items-center justify-between bg-gray-100 gap-5 p-5"
        >
          <h3 v-if="title" class="text-lg font-semibold" :class="titleClasses">
            {{ title }}
          </h3>
        </div>

        <div class="modalStyle p-5 overflow-x-hidden">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  persist: {
    required: false,
    default: false,
  },
  title: {
    required: false,
  },
  hideHeader: {
    required: false,
    default: false,
  },
  classes: {
    type: String,
    required: false,
    default: null,
  },
  mainClass: {
    type: String,
    required: false,
    default: null,
  },
  titleClasses: {
    type: String,
    required: false,
    default: null,
  },
  iconColor: {
    type: String,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["close"]);

function close() {
  if (props.persist) return;

  emit("close");
}
</script>

<style lang="scss">
.base-modal {
  .base-modal-content {
    box-shadow: 0px 7px 58px 0px #b1b1b11a;
  }
}
.p-dropdown-panel {
  z-index: 99999 !important;
}
</style>
