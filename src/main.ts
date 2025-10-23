// Components
import PrimeVue from "primevue/config";
// @ts-ignore: allow side-effect CSS import without type declarations
import "primevue/resources/primevue.css";
import "primevue/resources/themes/tailwind-light/theme.css";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import "@/styles/main.scss";
import mitt from 'mitt'
import mainMixin from "./mixins/mixins"
import App from "./App.vue";


// Composables
import { createApp } from "vue";
import "vue3-toastify/dist/index.css";
// Plugins
import { registerPlugins } from "@/plugins";

const emitter = mitt()
const app = createApp(App);
app.config.globalProperties.emitter = emitter
registerPlugins(app);
app.use(PrimeVue);
app.mixin(mainMixin)

app.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyA8qi0TK3EDod0LlTXbQFf_DyEptiGgPFU",
    libraries: "places",
  },
});
app.mount("#app");
