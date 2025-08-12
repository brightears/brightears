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
        // ONLY these 4 colors from Huemint
        'brand-cyan': '#00bbe4',      // Brand cyan (updated brand color to match logo)
        'deep-purple': '#12011f',     // Deep purple-black (darkest backgrounds)
        'medium-purple': '#373855',   // Medium purple-gray (secondary backgrounds, buttons)
        'near-white': '#fbfdff',      // Near white (light backgrounds, text on dark)
        
        // Keep these standard overrides for system compatibility
        background: {
          DEFAULT: '#fbfdff',         // Near white
          dark: '#12011f',            // Deep purple-black
        },
        foreground: '#fbfdff',        // Text color on dark backgrounds
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