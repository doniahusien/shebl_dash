import { defineStore } from 'pinia'
import router from "../router";
import axios from "axios";
const adminUrl = import.meta.env.VITE_BASE_URL as string;

export const useAppAuth = defineStore("authStore", {
  state: () => ({
    adminUrl,
    user_type: localStorage.getItem('shebl_global_user_type')!,
    token: localStorage.getItem('jwt_token_shebl_global')!,
    userData: null,
  }),
  getters: {

    isLoggedIn: (state) => !!state.token,
    getUserData: (state) => state.userData,
    getUserType: (state) => state.user_type,

  },
  actions: {
    getProfile() {
      if (!this.token) return
      axios.get( this.adminUrl + "/profile").then((res) => {
        this.userData = res.data.data;
        this.user_type = res.data.data.user_type;
      })

    },

    logout() {
      this.token = "";
      axios.defaults.headers.common["Authorization"] = null;
      localStorage.removeItem("shebl_global_user_data");
      localStorage.removeItem("jwt_token_shebl_global");
      localStorage.removeItem("shebl_global_user_type")
      router.push('/auth/login');
    },
  },
});
