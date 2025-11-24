import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const isCloudflare = process.env.VITE_USE_CLOUDFLARE === 'true'

  return {
    plugins: [react()],
    server: {
      port: 3000, // ubah port default ke 3000
      host: true, // allow external access
      allowedHosts: ['ppl.vinmedia.my.id', '.vinmedia.my.id'], // allow cloudflare tunnel domain
      hmr: isCloudflare ? {
        // Production with Cloudflare Tunnel
        protocol: 'wss', // Use WSS for secure WebSocket
        clientPort: 443, // Port that browser will use to connect
      } : {
        // Local development
        protocol: 'ws', // Use regular WebSocket for localhost
        port: 3000, // Use same port as dev server
      }
    },
  }
})
