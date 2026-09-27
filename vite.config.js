import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Portfolio/", /* This only for github page repo name*/
  plugins: [
    vue({})
  ],

  server: {
    host: true,
    // Allow the sandbox live-preview host (https://<port>-<sandboxId>.e2b.app)
    allowedHosts: true
  },
  preview: {
    host: true,
    allowedHosts: true
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
})
