import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets so it works on itch.io/GitHub Pages
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
})
