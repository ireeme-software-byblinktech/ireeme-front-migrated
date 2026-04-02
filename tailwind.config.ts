import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F6EF7",
          dark: "#3B56D9",
          light: "#EEF1FE",
          muted: "#8FA3FA",
        },
        sidebar: {
          bg: "#0F172A",
          border: "#1E293B",
          hover: "#1E293B",
        },
        page: "#F1F5F9",
        success: {
          DEFAULT: "#22C55E",
          bg: "#F0FDF4",
          text: "#15803D",
        },
        danger: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
          text: "#DC2626",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FFFBEB",
          text: "#D97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
        modal: "14px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        modal: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
