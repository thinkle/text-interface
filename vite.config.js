import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "TextInterface",
      fileName: "textInterface",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        globals: {
          // external dependencies, if any
        },
      },
    },
  },
  plugins: [
    cssInjectedByJsPlugin(), // Inline CSS into JS
    dts(),
  ],
});
