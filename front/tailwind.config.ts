import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "968px",
      xl: "1200px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: "#292929",
        second: "#423F50",
        third: "#FDFBF2",
        accent: {
          DEFAULT: "#F56F5E",
          hover: "#FFFFFF",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
