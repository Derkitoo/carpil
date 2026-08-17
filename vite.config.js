import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'CarePill AI — Suivi Médical Papa',
        short_name: 'CarePill',
        description: 'Application révolutionnaire de suivi de traitement médical pour polymédication senior et supervision familiale.',
        theme_color: '#0284c7',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Valider Matin 🟢',
            short_name: 'Matin 🟢',
            description: 'Valider instantanément les médicaments du matin',
            url: './?action=validate_Matin',
            icons: [{ src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }]
          },
          {
            name: 'Valider Midi ☀️',
            short_name: 'Midi ☀️',
            description: 'Valider instantanément les médicaments du midi',
            url: './?action=validate_Midi',
            icons: [{ src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }]
          },
          {
            name: 'Valider Soir 🌅',
            short_name: 'Soir 🌅',
            description: 'Valider instantanément les médicaments du soir',
            url: './?action=validate_Soir',
            icons: [{ src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ],
  base: '/carpil/',
})
