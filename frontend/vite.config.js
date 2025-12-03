import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to your Node backend
      '/api': {
        target: 'http://localhost:3000', // Change this to your Node port later
        changeOrigin: true,
        secure: false,
      },
    },
  },
})