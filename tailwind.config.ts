import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - ONLY these colors
        brightears: '#00CFFF',        // Brand cyan for accents, icons, highlights
        'off-white': '#EDFDFF',       // Off-white for light backgrounds
        'primary-dark': '#22242b',    // Primary dark background
        'secondary-dark': '#252525',  // Secondary dark (slightly lighter)
        'button-color': '#294751',    // Button/icon color (dark teal)
        
        // Keep these standard overrides for system compatibility
        background: {
          DEFAULT: '#EDFDFF',         // Off-white
          dark: '#22242b',            // Primary dark
        },
        foreground: '#EDFDFF',        // Text color on dark backgrounds
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animationDelay: {
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
};
export default config;