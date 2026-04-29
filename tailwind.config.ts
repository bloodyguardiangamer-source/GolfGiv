import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        serif: ["var(--font-playfair)"],
      },
      colors: {
        background: "#0a0a14",
        surface: "#111120",
        primary: "#b8f55a",
        muted: "#9595b5",
        border: "#2c2c48",
        accent: "#f5c842",
      },
    },
  },
  plugins: [],
};
export default config;
