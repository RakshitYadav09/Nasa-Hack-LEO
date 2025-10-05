import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname || __dirname, "./src"),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@heroicons/react', 'framer-motion'],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  server: {
    port: 5173,
    host: true,
  },
})
