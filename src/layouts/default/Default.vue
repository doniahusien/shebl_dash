<template>
  <sidebar />
  <main
    class="flex flex-col main_app"
    :class="appStore.sidebar ? 'ms-[250px]' : ''"
  >
    <navbar class="z-[1006]" />
    <div class="app_warpper flex flex-col flex-1 p-4">
      <router-view />
    </div>
  </main>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { useAppAuth } from "@/store/auth";
import { onMounted } from "vue";
import Navbar from "./Navbar.vue";
import Sidebar from "@/components/navigation/sidebar/index.vue";
const appStore = useAppStore();

const appAuth = useAppAuth();
onMounted(() => {
  appAuth.getProfile();
});
</script>
<style lang="scss">
.main_app {
  min-height: calc(100vh - 55px);
}
.app_warpper {
  > div {
    @apply w-full flex flex-col;
  }
}
</style>
