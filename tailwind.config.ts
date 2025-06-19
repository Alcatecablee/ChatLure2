import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "ios-blue": "#007AFF",
        "ios-green": "#34C759",
        "ios-red": "#FF3B30",
        "ios-orange": "#FF9500",
        "ios-yellow": "#FFCC00",
        "ios-purple": "#AF52DE",
        "ios-pink": "#FF2D92",
        "ios-teal": "#5AC8FA",
        "ios-indigo": "#5856D6",
        "ios-gray": "#8E8E93",
        "ios-gray2": "#AEAEB2",
        "ios-gray3": "#C7C7CC",
        "ios-gray4": "#D1D1D6",
        "ios-gray5": "#E5E5EA",
        "ios-gray6": "#F2F2F7",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        app: "22px", // iOS app icon radius
        "ios-button": "10px",
      },
      backdropBlur: {
        ios: "20px",
        app: "40px",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "bounce-soft": "bounce-soft 0.6s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "bounce-soft": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0,-8px,0)" },
          "70%": { transform: "translate3d(0,-4px,0)" },
          "90%": { transform: "translate3d(0,-2px,0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(147, 51, 234, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(147, 51, 234, 0.8)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      fontFamily: {
        "sf-pro": [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        "sf-mono": [
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "Roboto Mono",
          "monospace",
        ],
      },
      boxShadow: {
        ios: "0 8px 30px rgba(0, 0, 0, 0.12)",
        "ios-button":
          "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        app: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(147, 51, 234, 0.4)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.4)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.4)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.4)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      aspectRatio: {
        phone: "9 / 19.5", // iPhone aspect ratio
        card: "3 / 4",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
