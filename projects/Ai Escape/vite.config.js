import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-512x512.png"],
      manifest: {
        name: "Escape Room - Multiplayer",
        short_name: "EscapeRoom",
        description: "Real-time multiplayer escape room game",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        icons: [
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,mp4,mp3}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for videos
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "firebase-storage-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.mp4$/,
            handler: "CacheFirst",
            options: {
              cacheName: "video-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              rangeRequests: true,
            },
          },
          {
            urlPattern: /\.mp3$/,
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});
