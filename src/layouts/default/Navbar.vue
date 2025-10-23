<template>
  <header :class="{ scrolled: scrolled }" class="base-header">
    <div class="flex items-center">
      <button
        type="button"
        v-if="!appStore.sidebar"
        @click="appStore.sidebar = !appStore.sidebar"
        class="me-auto px-2 text-2xl text-primary"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>
    <div class="flex items-center flex-wrap gap-3">
      <button
        type="button"
        class="flex items-center gap-1 text-primary"
        @click="changeLocale"
      >
        <svg-icon name="language-circle" />

        <span class="font-bold">{{ $t(`locale.${locale}`) }}</span>
      </button>
      <ProfileMenu v-if="profileData" :profile="profileData" />

    </div>
  </header>
</template>
<script setup>
import { watch, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAppStore } from "@/store/app";
import { useAppAuth } from "@/store/auth";

import ProfileMenu from "./ProfileMenu.vue";

import Cookies from "js-cookie";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const appAuth = useAppAuth();
const user_type = appAuth.user_type || localStorage.getItem('shebl_global_user_type');
const adminUrl = import.meta.env.VITE_BASE_URL;

const scrolled = ref(false);

const { locale } = useI18n();
const appStore = useAppStore();
const route = useRoute();

const navMenu = ref(false);

function changeLocale() {
  if (locale.value === "ar") {
    Cookies.set("SHEBL_DASHBOARD_LANG", "en");
  } else {
    Cookies.set("SHEBL_DASHBOARD_LANG", "ar");
  }
  window.location.reload();
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 0;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => route.path,
  () => {
    if (window.innerWidth < 678) {
      appStore.sidebar = false;
    }
  }
);

const profileData = computed(() => appAuth.getUserData);
</script>

<style lang="scss">
header.base-header {
  @apply top-0 z-50 sticky px-2 md:px-5 h-16 flex items-center  justify-between;
  box-shadow: 35px 0px 58px 0px #b1b1b11a;

  &.scrolled {
    background-color: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .logo-image {
    animation: rotation infinite 8s linear;
    z-index: 1;
  }
}

@keyframes rotation {
  100% {
    transform: rotate(360deg);
  }
}

.top_button {
  @apply relative flex  items-center justify-center rounded-full;
  .count {
    @apply absolute end-3 -top-1 flex size-4 items-center justify-center rounded-full border-[1px] border-white bg-red-500 text-[12px] text-white;
  }
  .notificationLoader {
    @apply box-border inline-block size-1.5 animate-spin rounded-full border-[1px] border-white border-b-transparent;
  }
}
</style>
