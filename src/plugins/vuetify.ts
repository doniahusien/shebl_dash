/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */


import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
import i18n from "./i18n";










// Styles
import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
// Composables
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },

  theme: {
    themes: {
      light: {
        colors: {
          primary: "#6A449A",
          secondary: "#7E94B0",
          title: "#171717",
          error: "#FF445B",
          warning: "#FF445B",
          success: "#0FB015",
        },
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
