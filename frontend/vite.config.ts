import { fileURLToPath, URL } from 'node:url'
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
      workbox: {
        navigateFallbackDenylist: [/^\/jenkins/]
      },
      manifest: {
        theme_color: '#ffffff',
        name: 'S-Tailor',
        short_name: 'S-Tailor',
        start_url: '/',
        display: 'standalone',
        description: 'A virtual cloth app.',
        icons: [
          {
            src: 'favicon-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any'
          },
          {
            src: 'favicon-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: 'favicon-maskable-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
