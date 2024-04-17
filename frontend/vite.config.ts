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
        icons: [
          {
            src: 'icons/favicon-196x196.png',
            type: 'image/png',
            sizes: '196x196'
          },
          {
            src: 'icons/favicon-196x196.png',
            type: 'image/png',
            sizes: '196x196',
            purpose: 'maskable'
          },
          {
            src: 'icons/favicon-512x512.png',
            type: 'image/png',
            sizes: '512x512'
          },
          {
            src: 'icons/favicon-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
