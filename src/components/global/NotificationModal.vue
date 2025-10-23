<template>
  <div
    class="base-modal px-3 bg-[#00000083] flex items-center justify-center fixed top-0 left-0 w-screen h-screen z-[1005]"
    @click="close"
  >
    <div
      class="base-modal-content w-[320px] rounded-[30px] bg-white"
      @click.stop
      :class="classes"
    >
      <slot />
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
  classes: {
    required: false,
  },
});

const emit = defineEmits(["close"]);

function close() {
  if (props.persist) return;

  emit("close");
}
</script>

<style lang="scss" scoped>
.base-modal {
  .base-modal-content {
    box-shadow: 0px 7px 58px 0px #b1b1b11a;
  }
}
</style>
