// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt'],
  routeRules:{
    '/': { prerender: true }
  },
  pwa: {
    workbox: { globPatterns: ['**/*.{js,css,html,png,svg,ico}'] },
    injectManifest: { globPatterns: ['**/*.{js,css,html,png,svg,ico}'] },
    devOptions: {
      enabled: true,
      type: 'module'
    },
    client:{ installPrompt: true },
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      name: 'ShopLink',
      short_name: 'ShopLink',
      description: 'Współdzielona lista zakupów',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
          {
              src: "icons/16x16.png",
              sizes: "16x16",
              type: "image/png"
          },
          {
              src: "icons/32x32.png",
              sizes: "32x32",
              type: "image/png"
          },
          {
              src: "icons/72x72.png",
              sizes: "72x72",
              type: "image/png"
          },
          {
              src: "icons/96x96.png",
              sizes: "96x96",
              type: "image/png"
          },
          {
              src: "icons/120x120.png",
              sizes: "120x120",
              type: "image/png"
          },
          {
              src: "icons/128x128.png",
              sizes: "128x128",
              type: "image/png"
          },
          {
              src: "icons/144x144.png",
              sizes: "144x144",
              type: "image/png"
          },
          {
              src: "icons/152x152.png",
              sizes: "152x152",
              type: "image/png"
          },
          {
              src: "icons/180x180.png",
              sizes: "180x180",
              type: "image/png"
          },
          {
              src: "icons/192x192.png",
              sizes: "192x192",
              type: "image/png"
          },
          {
              src: "icons/384x384.png",
              sizes: "384x384",
              type: "image/png"
          },
          {
              src: "icons/512x512.png",
              sizes: "512x512",
              type: "image/png"
          },
          {
              src: "icons/512x512.png",
              sizes: "512x512",
              type: "image/png",
              "purpose": "maskable"
          }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/css/main.css'],
  
})
