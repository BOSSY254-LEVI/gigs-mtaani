import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Gigs Mtaani",
        short_name: "Mtaani",
        description: "Hyperlocal secure gig platform for students",
        theme_color: "#0f172a",
        background_color: "#020617",
        display: "standalone",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "https-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 86400
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000
  }
});

