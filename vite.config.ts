// Plugins
import vue from "@vitejs/plugin-vue";
// import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import svgLoader from 'vite-svg-loader';
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
    vue({
      // template: { transformAssetUrls },

      reactivityTransform: true,
    }),
    svgLoader(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    // vuetify({
    //   // autoImport: true,
    //   styles: {
    //     configFile: "src/styles/settings.scss",
    //   },
    // }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/styles/abstracts/_variables.scss";`,
      },
    },
  },
  base: command === "build" ? "/dashboard/lavender" : "/",

  server: {
    port: 3039,
    host: "0.0.0.0",
    hmr: {
      clientPort: 3039,
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },

  define: { 'process.env': {} },
}
}
);
