<template>
  <div
    class="fixed top-0 left-0 bg-[#00000071] flex-col gap-5 w-screen h-screen z-[9000] flex justify-center items-center"
    @click="closingMenu"
  >
    <div class="side_menu relative" :class="{ closing: closing }">
      <header
        class="px-6 flex items-center flex-row-reverse justify-between h-24 bg-white"
        @click.stop
      >
        <button class="text-3xl font-normal" type="button" @click="closingMenu">
          <svg-icon name="close" />
        </button>
        <div class="flex items-center gap-4 order-2 md:order-1" v-if="store">
          <img
            :src="store.image"
            alt="profile-image"
            width="48"
            height="48"
            class="rounded-full h-12 w-12 border-2 gap-2 border-solid border-white"
          />

          <div>
            <h2 class="text-text font-semibold text-start">
              {{ store.name }}
            </h2>
            <div class="text-sub font-medium flex gap-2 items-center">
              <span
                class="inline-block w-2 h-2 rounded-full"
                :class="isOnline ? 'bg-success ' : ' bg-red-500'"
              ></span>
              {{ isOnline ? $t("online") : $t("offline") }}
            </div>
          </div>
        </div>
      </header>
      <div class="side_menu_content" @click.stop="">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { usePosStore } from "@/store/pos";

const posStore = usePosStore();
const store = computed(() => posStore.getPosStore);
defineProps({
  closeBtn: {
    required: false,
    default: true,
  },
});

const isOnline = ref(window.navigator.onLine);

const emit = defineEmits(["close"]);

const closing = ref(false);

function closingMenu() {
  closing.value = true;

  setTimeout(() => emit("close"), 300);
}

onMounted(() => {
  window.addEventListener("online", () => (isOnline.value = true));
  window.addEventListener("offline", () => (isOnline.value = false));
});
</script>

<style lang="scss">
.side_menu {
  @apply bg-[#fbfafc] w-full  max-w-[360px]  h-screen overflow-y-auto fixed top-0;
  animation: show-menu 0.3s 0.1s forwards ease-in;
  inset-inline-end: -360px;
  &.closing {
    inset-inline-end: 0px;
    animation: hide-menu 0.3s 0.1s forwards ease-in;
  }

  @keyframes show-menu {
    0% {
      inset-inline-end: -360px;
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
      inset-inline-end: -360px;
      opacity: 0;
    }
  }
  .side_menu_content {
    height: calc(100vh - 6rem);
    overflow-y: auto;
    @apply pt-4;
  }
}
</style>
