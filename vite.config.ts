import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { apiMiddleware } from "./vite-api-middleware.js";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    hmr: {
      protocol: "wss",
      host: typeof process !== "undefined" && process.env.REPLIT_DEV_DOMAIN 
        ? process.env.REPLIT_DEV_DOMAIN 
        : "localhost",
      clientPort: 443,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  plugins: [react(), apiMiddleware()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
