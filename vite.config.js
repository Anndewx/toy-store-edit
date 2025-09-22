// vite.config.js — ถ้ายังไม่ได้ตั้ง ให้ใช้ชุดนี้
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // หรือพอร์ตที่คุณใช้จริง
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Express backend
        changeOrigin: true,
      },
    },
  },
})
