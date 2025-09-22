// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// แมพ /api/* ของ Frontend -> http://localhost/toy_store_api/*
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost",       // ✅ ชี้ไป Apache
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/toy_store_api"), // /api/x -> /toy_store_api/x
      },
    },
  },
});
