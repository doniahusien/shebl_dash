<template>
  <aside
    :class="{ hidden: !appStore.sidebar }"
    class="fixed h-screen w-[250px] start-0 top-0 bg-white"
  >
    <div class="mb-2 p-2 flex flex-col justify-center items-center">
      <button
        v-if="appStore.sidebar && smallScreen"
        type="button"
        @click="appStore.sidebar = !appStore.sidebar"
        class="text-lg text-primary self-end"
      >
        <i class="fa-solid fa-times"></i>
      </button>
      <router-link to="/" class="flex-1 inline-flex justify-center w-full h-20">
        <img
          src="/logo.png"
          width="80"
          class="object-contain h-20 w-full"
          alt="logo"
        />
      </router-link>
    </div>
    <div
      :class="
        smallScreen ? 'h-[calc(100vh_-_120px)]' : 'h-[calc(100vh_-_95px)]'
      "
      class="overflow-y-auto px-2 pb-4"
    >
      <div
        class="mb-2 last:mb-0"
        v-for="(menu, index) in sidebar"
        :key="`menu-${index}`"
      >
        <Menu :label="menu.label" :lists="menu.list" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Menu from "@/components/navigation/sidebar/Menu.vue";
import { useI18n } from "vue-i18n";
import { useAppAuth } from "@/store/auth";
const { t } = useI18n();

const route = useRoute();
const appAuth = useAppAuth();
const appStore = useAppStore();
const user_type = appAuth.user_type || localStorage.getItem('shebl_global_user_type');

const sidebar = ref([
  {
    label: t("TITLES.home"),

    list: [
      {
        title: t("TITLES.home"),
        path: "",
        icon: "dashboard",
        type: "general",
        active: "home-page",
      },
         {
        title: t("LABELS.sections"),
        path: "sections",
        icon: "pages",
        type: "general",
        active: "sections",
      },  

    ],
  },
 
  {
    label: t("LABELS.General"),
    list: [
     
     /*  {
        title: t("LABELS.About"),
        path: "about",
        icon: "pages",
        type: "general",
        active: "about",
      }, */
      {
        title: t("LABELS.Features"),
        path: "our_features",
        icon: "pages",
        type: "general",
        active: "features",
      },
         {
        title: t("LABELS.faq"),
        path: "faq",
        icon: "pages",
        type: "general",
        active: "faq",
      },
      {
        title: t("LABELS.why_us"),
        path: "why_us",
        icon: "pages",
        type: "general",
        active: "why_us",
      },
     /*  {
        title: t("LABELS.policy"),
        path: "policy",
        icon: "pages",
        type: "general",
        active: "policy",
      },
      {
        title: t("LABELS.terms"),
        path: "terms",
        icon: "pages",
        type: "general",
        active: "terms",
      },
      {
        title: t("LABELS.contactUs"),
        path: "contact-us",
        icon: "message-plus",
        type: "general",
        active: "contact-us",
      },*/
       {
        title: t("LABELS.About"),
        path: "about",
        icon: "about",
        type: "general",
        active: "about",
      }, 
      {
        title: t("TITLES.webSettings"),
        path: "settings",
        icon: "settings",
        type: "general",
        active: "settings",
      }, 
    ],
  },
]);

const smallScreen = ref(false);

onMounted(() => {
  const updateScreen = () => {
    if (window.innerWidth < 992) {
      appStore.sidebar = false;
      smallScreen.value = true;
    } else {
      appStore.sidebar = true;
      smallScreen.value = false;
    }
  };

  updateScreen();
  window.addEventListener("resize", updateScreen);
});

watch(
  () => route.path,
  () => {
    if (smallScreen.value) {
      appStore.sidebar = false;
    }
  }
);
</script>
