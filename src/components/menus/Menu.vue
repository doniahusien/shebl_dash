<template>
  <div
    class="fixed top-0 left-0 bg-[#00000071] flex-col gap-5 w-screen h-screen z-[9000] flex justify-center items-center"
    @click="closingMenu"
  >
    <div class="side_menu_normal relative" :class="{ closing: closing }">
      <button class="close-btn" type="button" @click.stop="closingMenu">
        <svg-icon name="close" />
        <!-- <img src="@/assets/images/icons/close.svg" alt="close" /> -->
      </button>

      <div class="side_menu_content" @click.stop>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  closeBtn: {
    required: false,
    default: true,
  },
  title: {
    required: false,
  },
});

const emit = defineEmits(["close"]);

const closing = ref(false);

function closingMenu() {
  closing.value = true;

  setTimeout(() => emit("close"), 300);
}
</script>

<style lang="scss">
.side_menu_normal {
  @apply bg-[#fbfafc] w-full max-w-[500px]  h-screen overflow-y-auto fixed top-0;
  animation: show-menu 0.3s 0.1s forwards ease-in;
  inset-inline-end: -500px;
  &.closing {
    @apply right-0;
    animation: hide-menu 0.3s 0.1s forwards ease-in;
  }

  @keyframes show-menu {
    0% {
      inset-inline-end: -500px;
      opacity: 0;
    }
    100% {
      inset-inline-end: 0px;
      opacity: 1;
    }
  }
  @keyframes hide-menu {
    0% {
      inset-inline-end: 0px;
      opacity: 1;
    }
    100% {
      inset-inline-end: -500px;
      opacity: 0;
    }
  }
  .side_menu_content {
    @apply h-screen overflow-y-auto;
  }
  .close-btn {
    @apply text-3xl  font-normal absolute top-5 z-[9000];
    inset-inline-end: 1rem;
  }
}
</style>
