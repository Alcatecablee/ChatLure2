import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Custom plugin to block @radix-ui/react-tooltip completely
const blockTooltipPlugin = () => ({
  name: "block-tooltip",
  resolveId(id: string) {
    if (id === "@radix-ui/react-tooltip" || id.includes("react-tooltip")) {
      return path.resolve(__dirname, "./src/components/ui/tooltip.tsx");
    }
    return null;
  },
  load(id: string) {
    if (id.includes("react-tooltip")) {
      // Return empty module to prevent any loading
      return "export const TooltipProvider = ({ children }) => children; export const Tooltip = ({ children }) => children; export const TooltipTrigger = ({ children }) => children; export const TooltipContent = () => null; export default {};";
    }
    return null;
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), blockTooltipPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force any @radix-ui/react-tooltip imports to use our safe fallback
      "@radix-ui/react-tooltip": path.resolve(
        __dirname,
        "./src/components/ui/tooltip.tsx",
      ),
      // Force single React instance to prevent hook conflicts
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    exclude: ["@radix-ui/react-tooltip"],
    force: true,
  },
  build: {
    rollupOptions: {
      external: ["@radix-ui/react-tooltip"],
    },
  },
  define: {
    // Prevent any tooltip-related code from executing
    "process.env.DISABLE_TOOLTIPS": '"true"',
    // Completely disable the module at build time
    "@radix-ui/react-tooltip": "undefined",
  },
}));
