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
      // Use WSS for external domain access, WS for localhost
      protocol: 'wss', // Use WSS for secure WebSocket
      clientPort: 443, // Port that browser will use to connect (Cloudflare Tunnel uses 443)
      // Don't set host - let it use the current hostname automatically
      // For production with tunnel, this will use ppl.vinmedia.my.id
    }
  },
})
