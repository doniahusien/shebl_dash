import { loadFonts } from "./webfontloader";
import { registerAxios } from "./axios";
import { registerVeeValidate } from "./veeValidate";
import { registerComponents } from "./components";
// import vuetify from "./vuetify";
import pinia from "../store";
import i18n from "./i18n";
import router from "../router";
import type { App } from 'vue'
export function registerPlugins(app: App) {
  app.use(pinia)
  loadFonts();
  registerAxios(app);
  registerComponents(app);
  registerVeeValidate(app);
  app.use(i18n).use(router);
}
