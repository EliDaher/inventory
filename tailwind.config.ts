import { theme } from "./src/styles/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // أو 'media' حسب تفضيلك
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light
        primary: theme.colors.light.primary,
        "primary-hover": theme.colors.light.primaryHover,
        secondary: theme.colors.light.secondary,
        accent: theme.colors.light.accent,
        "accent-hover": theme.colors.light.accentHover,
        background: theme.colors.light.background,
        card: theme.colors.light.card,
        text: theme.colors.light.text,
        border: theme.colors.light.border,

        // Dark
        "dark-primary": theme.colors.dark.primary,
        "dark-primary-hover": theme.colors.dark.primaryHover,
        "dark-secondary": theme.colors.dark.secondary,
        "dark-accent": theme.colors.dark.accent,
        "dark-accent-hover": theme.colors.dark.accentHover,
        "dark-background": theme.colors.dark.background,
        "dark-card": theme.colors.dark.card,
        "dark-text": theme.colors.dark.text,
        "dark-border": theme.colors.dark.border,
      },
      fontFamily: theme.fontFamily,

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.1)",
        "card-dark": "0 2px 10px rgba(255, 255, 255, 0.05)",
      },

      transitionProperty: {
        theme: "background-color, color, border-color",
      },

      animation: {
        fade: "fadeIn 0.5s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
