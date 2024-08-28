import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "TextInterface",
      formats: ["es", "umd"],
      fileName: (format) => `text-interface.${format}.js`,
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
