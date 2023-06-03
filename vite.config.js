import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  define: {
		//global: "globalThis",
	},
  build: {
    sourcemap: true,
    //outDir: '../game.com',
    //emptyOutDir: true,
    //publicDir : './public',
    //minify: false
  },
  server: {
    host: 'sibur.local'
  }
});


// https://vitejs.dev/config/
