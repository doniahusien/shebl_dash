
import i18n from "./i18n";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "../router"
import { useAppAuth } from "@/store/auth";
import type { App } from "vue"
import { useAppStore } from "@/store/app";
export async function registerAxios(app: App) {
  app.use(VueAxios, axios);
  const appAuth = useAppAuth();


  const TOKEN = localStorage.getItem("jwt_token_shebl_global");


  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  if (TOKEN) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
  }
  axios.defaults.headers.common["Accept-language"] = i18n.global.locale.value;

  axios.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      if (error.response?.status == "401") {
        localStorage.setItem("lastPage", router.currentRoute.value.path);
        appAuth.logout()
      }

      if (error.response.status === 403) {


        router.push("/402");
      }
      if (error.response.status == "402" || error.response.status == "429") {
        router.replace("/403");
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {

      if (error.code === 'ERR_NETWORK') useAppStore().no_internet = true




      if (error.response?.status == "401") {

        localStorage.setItem("lastPage", router.currentRoute.value.path);

        appAuth.logout()


      }

      if (error.response?.status === 403) {


        router.push("/402");
      }
      if (error.response?.status == "402" || error.response?.status == "429") {
        router.replace("/403");
      }
      return Promise.reject(error);
    }
  );
}


