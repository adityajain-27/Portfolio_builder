import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F19",
          soft: "#111726",
          line: "#1E2536",
        },
        paper: {
          DEFAULT: "#F7F3EA",
          dim: "#EDE7D8",
        },
        cobalt: {
          DEFAULT: "#4C6FFF",
          soft: "#7C93FF",
          dim: "#33449E",
        },
        gold: {
          DEFAULT: "#C9A66B",
          soft: "#DCC08F",
        },
        slate: {
          DEFAULT: "#8B93A7",
          bright: "#C4C9D6",
        },
        danger: "#FF6B6B",
        warn: "#E8B75C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        paper: "0 2px 4px rgba(0,0,0,0.06), 0 20px 40px -12px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(76,111,255,0.4), 0 0 40px -8px rgba(76,111,255,0.5)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "type-settle": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "type-settle": "type-settle 0.35s ease-out",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;