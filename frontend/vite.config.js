import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const apiBaseUrl = env.VITE_API_BASE_URL || ''
  const isHttps = apiBaseUrl.startsWith('https://')

  // Use WSS if in production OR if API uses HTTPS OR if VITE_USE_CLOUDFLARE is explicitly set
  const useSecureWebSocket = isProduction || isHttps || env.VITE_USE_CLOUDFLARE === 'true'

  return {
    plugins: [react()],
    server: {
      port: 3000, // ubah port default ke 3000
      host: true, // allow external access
      allowedHosts: ['ppl.vinmedia.my.id', '.vinmedia.my.id'], // allow cloudflare tunnel domain
      hmr: useSecureWebSocket ? {
        // Production or HTTPS environment
        protocol: 'wss', // Use WSS for secure WebSocket
        clientPort: 443, // Port that browser will use to connect
      } : {
        // Local development with HTTP
        protocol: 'ws', // Use regular WebSocket for localhost
        port: 3000, // Use same port as dev server
      }
    },
  }
})
