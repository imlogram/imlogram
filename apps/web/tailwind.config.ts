import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // Class-based so ThemeToggle can override the OS preference. The
  // blocking script in layout.tsx sets this class before first paint,
  // seeded from localStorage or (by default) the OS preference.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          DEFAULT: "#4f46e5",
          light: "#818cf8",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 16px -4px rgb(79 70 229 / 0.08)",
        "soft-lg": "0 8px 30px -8px rgb(79 70 229 / 0.18)",
      },
      backgroundImage: {
        "grid-light": "linear-gradient(to right, rgb(0 0 0 / 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.035) 1px, transparent 1px)",
        "grid-dark": "linear-gradient(to right, rgb(255 255 255 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.045) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        cursive: ["var(--font-cursive)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
