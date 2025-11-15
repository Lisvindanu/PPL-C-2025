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
      protocol: 'wss', // Use WebSocket Secure for tunnel
      host: 'ppl.vinmedia.my.id', // Tunnel domain
      clientPort: 443 // HTTPS port
    }
  },
})
