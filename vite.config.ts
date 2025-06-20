import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force any @radix-ui/react-tooltip imports to use our safe fallback
      "@radix-ui/react-tooltip": path.resolve(
        __dirname,
        "./src/components/ui/tooltip.tsx",
      ),
    },
  },
}));
