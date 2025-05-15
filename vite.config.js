import { fileURLToPath, URL } from 'node:url'

import { defineConfig, process } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
  base: process.env.NODE_ENV === 'production' ? '/tour-guide/' : '/',
})
