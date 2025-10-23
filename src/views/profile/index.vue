<template>
  <div>
    <div class="flex gap-4 flex-wrap">
      <div class="min-w-40 pe-4">
        <ul class="inline-nav">
          <li v-if="user_type != 'doctor'">
            <router-link to="/profile">
              <svg-icon name="user" />

              {{ $t("TITLES.Account Information") }}
            </router-link>
          </li>
          <li v-else>
            <router-link to="/profile/doctor">
              <svg-icon name="user" />

              {{ $t("TITLES.Account Information") }}
            </router-link>
          </li>
          <li>
            <router-link to="/profile/reset-password">
              <svg-icon name="password" />

              {{ $t("TITLES.Change Password") }}
            </router-link>
          </li>
          <li> 
            <button
              @click="logout"
              type="button"
              class="flex items-center gap-2 w-full outline-none"
            >
              <svg-icon name="logout" />

              <span class="font-semibold text-red-500">{{
                $t("BUTTONS.logout")
              }}</span>
            </button>
          </li>
        </ul>
      </div>
      <div class="lg:flex-1 w-full min-w-[300px] max-w-[900px]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useAppAuth } from "@/store/auth";
import axios from "axios";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const router = useRouter();
const appAuth = useAppAuth();
const user_type = appAuth.user_type || localStorage.getItem('shebl_global_user_type');
function logout() {
  axios({
    method: "POST",
    url: "auth/logout",
    baseURL: VITE_BASE_URL,
  })
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 400);
      appAuth.logout();
    })
    .catch((err) => {
      if (err.response?.status == 401) {
        appAuth.logout();
      }
    });
}
</script>
