import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#F2F7F4",
          100: "#E1EDE6",
          200: "#C4DDD0",
          300: "#9EBEB0",
          500: "#2D7A4F",
          700: "#1E4F34",
          800: "#1C3B2B",
          900: "#14291F",
          950: "#0B1711",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F5EFE6",
          200: "#EBDDCB",
          300: "#DFC8AB",
          400: "#C8AA82",
        },
        terracotta: {
          50: "#FDF6F3",
          100: "#F9ECE5",
          200: "#F3D5C7",
          300: "#E7A890",
          400: "#D96B4F",
          500: "#BD5338",
          600: "#A3412B",
          700: "#80311F",
        },
        gold: {
          100: "#FAF3E3",
          300: "#EBD4A7",
          400: "#DFB86C",
          500: "#C5A059",
          600: "#9F7E3B",
          700: "#755B25",
        },
        charcoal: {
          700: "#363F3A",
          800: "#262D29",
          900: "#1A201D",
          950: "#101412",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        'topo-pattern': "radial-gradient(circle at 1px 1px, rgba(28, 59, 43, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;
