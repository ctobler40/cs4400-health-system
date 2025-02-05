import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:6500',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    // support `describe`, `test` etc. globally, 
    // so you don't need to import them every time
    globals: true, 
    // run tests in jsdom environment
    environment: "jsdom",
    // global test setup
    setupFiles: "./tests/setup.js",
  },
})
