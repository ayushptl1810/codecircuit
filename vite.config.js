import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    include: ["cesium"],
    exclude: ["@cesium/widgets"],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      external: ["cesium"],
      output: {
        globals: {
          cesium: "Cesium",
        },
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
