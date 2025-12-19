import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc4fc",
          400: "#36a5f8",
          500: "#0c8ae9",
          600: "#006dc7",
          700: "#0157a2",
          800: "#064a85",
          900: "#0b3f6e",
          950: "#072849",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffeed4",
          200: "#ffd9a8",
          300: "#ffbc71",
          400: "#ff9538",
          500: "#fe7711",
          600: "#ef5c07",
          700: "#c64408",
          800: "#9d360f",
          900: "#7e2f10",
          950: "#441506",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-cabinet)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

