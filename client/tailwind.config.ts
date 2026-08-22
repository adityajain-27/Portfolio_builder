import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F6F6F3",
        },
        ink: {
          DEFAULT: "#181B22",
          soft: "#FFFFFF",
          line: "#E7E2D3",
        },
        paper: {
          DEFAULT: "#F7F3EA",
          dim: "#EDE7D8",
        },
        cobalt: {
          DEFAULT: "#3E5FE0",
          soft: "#5D7AEA",
          dim: "#2A3F9E",
        },
        gold: {
          DEFAULT: "#A9803F",
          soft: "#C9A66B",
        },
        slate: {
          DEFAULT: "#6B6A5D",
          bright: "#1B1E26",
        },
        danger: "#C4453D",
        warn: "#A9762A",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        doc: ['"Times New Roman"', "Georgia", "serif"],
      },
      boxShadow: {
        paper: "0 1px 2px rgba(24,27,34,0.05), 0 20px 40px -18px rgba(24,27,34,0.22)",
        glow: "0 0 0 1px rgba(62,95,224,0.35), 0 8px 28px -8px rgba(62,95,224,0.35)",
        card: "0 1px 2px rgba(24,27,34,0.04), 0 8px 24px -12px rgba(24,27,34,0.12)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E\")",
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
        "drift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(20px,-25px) scale(1.05)" },
          "66%": { transform: "translate(-15px,15px) scale(0.97)" },
        },
        "spin-slow": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "type-settle": "type-settle 0.35s ease-out",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "drift": "drift 14s ease-in-out infinite",
        "drift-slow": "drift 20s ease-in-out infinite",
        "marquee": "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;