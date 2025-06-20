import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { apiRoutesPlugin } from "./vite-api-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), apiRoutesPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
