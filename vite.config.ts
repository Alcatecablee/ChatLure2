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
  transform(code: string, id: string) {
    // Transform any remaining tooltip references at the code level
    if (
      code.includes("@radix-ui/react-tooltip") ||
      code.includes("TooltipProvider")
    ) {
      console.log(`🚫 TRANSFORMING TOOLTIP CODE IN: ${id}`);
      return code
        .replace(
          /from\s+['"]@radix-ui\/react-tooltip['"]/g,
          'from "@/components/ui/tooltip"',
        )
        .replace(
          /import\s+.*@radix-ui\/react-tooltip.*/g,
          'import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";',
        );
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

    // Override the resolve to never resolve to the real tooltip
    const originalResolve = config.resolve;
    config.resolve = {
      ...originalResolve,
      alias: {
        ...originalResolve?.alias,
        "@radix-ui/react-tooltip": path.resolve(
          __dirname,
          "./src/components/ui/tooltip.tsx",
        ),
      },
    };
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
    noDiscovery: true,
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "react-router-dom",
    ],
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
