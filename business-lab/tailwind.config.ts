import type { Config } from "tailwindcss";

// Mirrors Jarua's tailwind.config.ts. Business Lab only adds the `lab` colour
// group + font families, all driven by CSS variables scoped to `.lab-shell`.
export default {
  darkMode: ["variant", "&:where(html:not(.light) *, html:not(.light))"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans Thai", "system-ui", "sans-serif"],
        "lab-display": ["Prompt", "IBM Plex Sans Thai", "system-ui", "sans-serif"],
        "lab-mono": ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        lab: {
          bg: "hsl(var(--lab-bg))",
          surface: "hsl(var(--lab-surface))",
          surface2: "hsl(var(--lab-surface-2))",
          fg: "hsl(var(--lab-fg))",
          muted: "hsl(var(--lab-muted))",
          subtle: "hsl(var(--lab-subtle))",
          border: "hsl(var(--lab-border))",
          "border-strong": "hsl(var(--lab-border-strong))",
          strong: "hsl(var(--lab-strong))",
          "strong-fg": "hsl(var(--lab-strong-fg))",
          danger: "hsl(var(--lab-danger))",
          "danger-soft": "hsl(var(--lab-danger) / 0.12)",
        },
      },
      borderRadius: {
        "lab-card": "1.25rem",
        "lab-field": "0.875rem",
      },
      keyframes: {
        "lab-in": {
          "0%": { opacity: "0.001", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "lab-pop": {
          "0%": { transform: "scale(0.96)" },
          "60%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "lab-in": "lab-in 0.35s ease-out both",
        "lab-pop": "lab-pop 0.3s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
