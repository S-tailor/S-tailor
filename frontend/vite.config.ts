import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'S-tailor',
        short_name: 'S-tailor',
        start_url: '/',
        display: 'standalone',
        description: 'A virtual cloth app.',
        icons: [
          {
            src: 'favicon-196x196.png',
            type: 'image/png',
            sizes: '196x196',
            purpose: 'any'
          },
          {
            src: 'favicon-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any'
          },
          {
            src: 'favicon-maskable-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
