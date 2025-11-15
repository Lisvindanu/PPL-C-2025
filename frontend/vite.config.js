import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ubah port default ke 3000
    host: true, // allow external access
    allowedHosts: ['ppl.vinmedia.my.id', '.vinmedia.my.id'], // allow cloudflare tunnel domain
    hmr: {
      // Development: use localhost for HMR to avoid WebSocket disconnect loop
      // Remove external domain config — it causes continuous reconnect/reload in dev
      protocol: 'ws', // Use WebSocket (not WSS) for local dev
      host: 'localhost', // Local dev server
      port: 3000 // Match server port
      // For production with tunnel, configure in separate production config if needed
    }
  },
})
