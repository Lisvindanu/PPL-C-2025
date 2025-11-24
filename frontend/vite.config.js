import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // allow external access
    allowedHosts: ['ppl.vinmedia.my.id', '.vinmedia.my.id'],
    hmr: {
      // Auto-detect: WSS untuk production domain, WS untuk localhost
      protocol: process.env.VITE_HMR_PROTOCOL || 'ws',
      host: 'localhost',
      // Hanya set clientPort untuk production (Cloudflare Tunnel)
      ...(process.env.VITE_HMR_PROTOCOL === 'wss' && { clientPort: 443 })
    }
  },
})
