import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "hud-cyan":  "#00d4ff",
        "hud-amber": "#ffb300",
        "hud-green": "#00ff88",
        "hud-red":   "#ff3366",
        "hud-bg":    "#000a14",
        border:      "hsl(var(--border))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "hud-blink": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.2" },
        },
        "hud-flicker": {
          "0%, 100%": { opacity: "1" },
          "92%":      { opacity: "1" },
          "93%":      { opacity: "0.4" },
          "94%":      { opacity: "1" },
          "96%":      { opacity: "0.6" },
          "97%":      { opacity: "1" },
        },
      },
      animation: {
        "hud-blink":   "hud-blink 2s ease-in-out infinite",
        "hud-flicker": "hud-flicker 8s linear infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config
