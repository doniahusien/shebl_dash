import { createI18n } from "vue-i18n";
import Cookies from "js-cookie";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";



export default createI18n({
  legacy: false,
  locale: Cookies.get("SHEBL_DASHBOARD_LANG") || "ar",
  fallbackLocale: Cookies.get("SHEBL_DASHBOARD_LANG") || "ar",

  messages: {
    ar,
    en,
  },
});
