import { defineConfig } from "vite";

export default defineConfig({
  root: "test", // Serve files from the `test` directory
  build: {
    outDir: "../dist", // Output files will be built in the `dist` directory
    rollupOptions: {
      input: "test/index.html", // Entry point for the build
    },
  },
  server: {
    open: "/index.html", // Automatically open the browser to this file
    host: "0.0.0.0", // This binds the server to all available network interfaces
    port: 80, // Optional: specify a port (default is 5173)
  },
});
