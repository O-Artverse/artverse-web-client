import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide'
const {heroui} = require("@heroui/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#d243cf",
        "secondary": "#000000",
        "tertiary": "#000000",
        "quaternary": "#000000",
        "quinary": "#000000",
        background: "rgb(var(--background-start-rgb))",
        foreground: "rgb(var(--foreground-rgb))",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), scrollbarHide],
};
export default config;
