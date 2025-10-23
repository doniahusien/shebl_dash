<template>
  <div
    class="fixed top-0 left-0 bg-[#00000071] flex-col gap-5 w-screen h-screen z-[9000] flex justify-center items-center"
    @click="closingMenu"
  >
    <div class="notification_menu relative" :class="{ closing: closing }">
      <header
        class="px-6 flex items-center flex-row-reverse justify-between h-24 bg-white"
        @click.stop
      >
        <button class="text-3xl font-normal" type="button" @click="closingMenu">
          <svg-icon name="close" />
        </button>
        <div class="flex items-center gap-4 order-2 md:order-1">
          <div>
            <h2 class="text-text text-2xl font-bold text-start">
              {{ $t("LABELS.Notifications") }}
            </h2>
          </div>
        </div>
      </header>
      <div
        class="notification_menu_content px-2"
        @scroll="onScroll"
        ref="notificationMenu"
        @click.stop=""
      >
        <div class="address-menu">
          <ul>
            <li
              class="mb-2 last:mb-0"
              v-for="(item, index) in appStore.notifications"
              :key="item.id"
            >
              <notifications-card
                @close="closingMenu"
                :path="
                  item.notify_type == 'order'
                    ? `/orders/show/${item.notify_id}`
                    : ''
                "
                :item="item"
                @delete="appStore.notifications.splice(index, 1)"
              />
            </li>
          </ul>
          <div
            v-if="!appStore.notifications.length"
            class="flex h-full flex-col items-center justify-center min-h-[550px]"
          >
            <div class="my-auto space-y-4">
              <h3 class="text-center text-2xl font-bold">
                {{ $t("TITLES.No notifications") }}
              </h3>
              <p class="mx-auto max-w-[300px] text-center text-text-light">
                {{ $t("TITLES.You dont have any notifications yet") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Skeleton v-if="appStore.notificationsLoading" height="70px" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import { onMounted, ref } from "vue";

import NotificationsCard from "@/components/cards/NotificationsCard.vue";
import { useAppStore } from "@/store/app";
const appStore = useAppStore();
defineProps({
  closeBtn: {
    required: false,
    default: true,
  },
});
const notificationMenu = ref();

const isOnline = ref(window.navigator.onLine);

const emit = defineEmits(["close"]);

const closing = ref(false);

function closingMenu() {
  closing.value = true;

  setTimeout(() => emit("close"), 300);
}

function onScroll() {
  const container = notificationMenu.value;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    if (appStore.notificationsLoading) return;

    appStore.getNotifications("next");
  }
}

onMounted(() => {
  window.addEventListener("online", () => (isOnline.value = true));
  window.addEventListener("offline", () => (isOnline.value = false));
});
</script>

<style lang="scss">
.notification_menu {
  @apply bg-[#fbfafc] w-full  max-w-[550px]  h-screen overflow-y-auto fixed top-0 -end-[550px];
  animation: show-menu 0.3s 0.1s forwards ease-in;

  &.closing {
    @apply end-0;
    inset-inline-end: 0px;
    animation: hide-menu 0.3s 0.1s forwards ease-in;
  }

  @keyframes show-menu {
    0% {
      @apply -end-[550px] opacity-0;
    }
    100% {
      @apply end-0 opacity-100;
    }
  }
  @keyframes hide-menu {
    0% {
      @apply end-0 opacity-100;
    }
    100% {
      @apply -end-[550px] opacity-0;
    }
  }
  .notification_menu_content {
    height: calc(100vh - 6rem);
    overflow-y: auto;
    @apply pt-4;
  }
}
</style>
