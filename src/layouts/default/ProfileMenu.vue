<template>
  <Menu as="div" class="relative inline-block" v-slot="{ open }">
    <MenuButton>
      <div class="size-11">
        <img
          :src="profile.image.url"
          alt="profile-image"
          width="48"
          height="48"
          @error="imgError"
          class="rounded-full object-contain size-11"
        />
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute min-w-[220px] w-fit origin-top-right divide-y z-30 divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="$i18n.locale == 'ar' ? 'left-0' : ' right-0'"
      >
        <MenuItem>
          <div class="flex items-center p-1 gap-1">
            <div class="size-7">
              <img  
                :src="profile.image.url"
                alt="profile-image"
                width="48"
                height="48"
                @error="imgError"
                class="rounded-full object-cover size-7"
              />
            </div>
            <div>
              <h2 class="text-text text-sm font-medium text-start">
                {{ profile.full_name }}
              </h2>
              <p class="mb-0 text-sub text-[12px] text-start">
                {{ profile.email }}
              </p>
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <button
            @click=" $router.push('/profile')"
            type="button"
            class="flex items-center py-3 px-2 gap-2 w-full outline-none border-line"
          >
            <svg-icon name="profile" />

            <span class="text-sm text-text">{{
              $t("BUTTONS.View Profile")
            }}</span>
          </button>
        </MenuItem>

        <MenuItem>
          <button
            @click="logout"
            type="button"
            class="flex items-center p-2 gap-2 w-full outline-none border-line"
          >
            <svg-icon name="logout" />

            <span class="font-semibold text-red-500">{{
              $t("BUTTONS.logout")
            }}</span>
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import axios from "axios";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { toast } from "vue3-toastify";
const props = defineProps({
  profile: {
    required: true,
    type: Object,
  },
});

import { useI18n } from "vue-i18n";
import { useAppAuth } from "@/store/auth";

const { t } = useI18n();
const appAuth = useAppAuth();
const user_type = appAuth.user_type || localStorage.getItem('shebl_global_user_type');
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function logout() {
  axios({
    method: "POST",
    url: "auth/logout",
    baseURL: VITE_BASE_URL,
  })
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 400);

      appAuth.logout();
      // router.push("/auth/login");
    })
    .catch((err) => {
      if (err.response?.status == 401) {
        appAuth.logout();
        // router.push("/auth/login");
      }
    });
}
</script>

<style></style>
