import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import fs from "fs";
import path from "path";

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
    dts({
      rollupTypes: true,
      afterBuild: () => {
        // Rename the generated type file
        const oldPath = path.resolve(__dirname, 'dist', 'index.d.ts');
        const newPath = path.resolve(__dirname, 'dist', 'text-interface.d.ts');
        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
        }
      }
    }),
  ],
});
