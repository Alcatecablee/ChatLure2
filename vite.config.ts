import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ULTIMATE NUCLEAR TOOLTIP BLOCKING PLUGIN
const ultimateTooltipKiller = () => ({
  name: "ultimate-tooltip-killer",
  enforce: "pre" as const,
  resolveId(id: string, importer?: string) {
    // Kill ANY tooltip-related imports
    if (id.includes("tooltip") || id.includes("Tooltip")) {
      console.log(`🚫 BLOCKED TOOLTIP IMPORT: ${id} from ${importer}`);
      return "\0virtual:empty-tooltip";
    }
    return null;
  },
  load(id: string) {
    if (id === "\0virtual:empty-tooltip") {
      return `
        export const TooltipProvider = ({ children }) => children;
        export const Tooltip = ({ children }) => children;
        export const TooltipTrigger = ({ children }) => children;
        export const TooltipContent = () => null;
        export default {};
      `;
    }
    return null;
  },
  configResolved(config) {
    // Force exclude from optimization
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
    config.optimizeDeps.exclude.push("@radix-ui/react-tooltip");
  },
  buildStart() {
    console.log("🔥 ULTIMATE TOOLTIP KILLER ACTIVATED");
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [ultimateTooltipKiller(), react()],
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
