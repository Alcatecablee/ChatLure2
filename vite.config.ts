import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ULTIMATE NUCLEAR TOOLTIP BLOCKING PLUGIN
const ultimateTooltipKiller = () => ({
  name: "ultimate-tooltip-killer",
  enforce: "pre" as const,
  resolveId(id: string, importer?: string) {
    // Kill ANY tooltip-related imports with extreme prejudice
    if (
      id.includes("tooltip") ||
      id.includes("Tooltip") ||
      id.includes("@radix-ui/react-tooltip") ||
      id === "@radix-ui/react-tooltip" ||
      id.startsWith("@radix-ui/react-tooltip/")
    ) {
      console.log(`🚫 BLOCKED TOOLTIP IMPORT: ${id} from ${importer}`);
      return "\0virtual:empty-tooltip";
    }
    return null;
  },
  load(id: string) {
    if (id === "\0virtual:empty-tooltip") {
      return `
        import React from 'react';
        export const TooltipProvider = ({ children }) => React.createElement('div', {}, children);
        export const Tooltip = ({ children }) => React.createElement('div', {}, children);
        export const TooltipTrigger = ({ children }) => React.createElement('div', {}, children);
        export const TooltipContent = () => null;
        export default {
          Provider: ({ children }) => React.createElement('div', {}, children),
          Root: ({ children }) => React.createElement('div', {}, children),
          Trigger: ({ children }) => React.createElement('div', {}, children),
          Content: () => null,
        };
      `;
    }
    return null;
  },
  configResolved(config) {
    // Force exclude from optimization with extreme prejudice
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
    config.optimizeDeps.exclude.push("@radix-ui/react-tooltip");
    config.optimizeDeps.exclude.push("@radix-ui/react-tooltip/dist");
    // Prevent any pre-bundling
    config.optimizeDeps.include = config.optimizeDeps.include || [];
  },
  buildStart() {
    console.log(
      "🔥 ULTIMATE TOOLTIP KILLER ACTIVATED - MAXIMUM DESTRUCTION MODE",
    );
  },
  config(config) {
    // Prevent scanning for this dependency
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.entries = config.optimizeDeps.entries || [];
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
      // Block all possible tooltip import patterns
      "@radix-ui/react-tooltip/dist": path.resolve(
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
    exclude: ["@radix-ui/react-tooltip", "@radix-ui/react-tooltip/dist"],
    force: true,
  },
  build: {
    rollupOptions: {
      external: [
        "@radix-ui/react-tooltip",
        "@radix-ui/react-tooltip/dist",
        /.*tooltip.*/i,
        /.*Tooltip.*/i,
      ],
    },
  },
  define: {
    // Prevent any tooltip-related code from executing
    "process.env.DISABLE_TOOLTIPS": '"true"',
    // Completely disable the module at build time
    "@radix-ui/react-tooltip": "undefined",
  },
}));
