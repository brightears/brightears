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
        // NEW EARTH-TONE PALETTE (professionally analyzed)
        'brand-cyan': '#00bbe4',      // Brand Cyan (Primary/Action) - CTAs, links, headlines, icons
        'deep-teal': '#2f6364',       // Deep Teal (Secondary/Anchor) - dark backgrounds, footers, body text
        'earthy-brown': '#a47764',    // Earthy Brown/Taupe (Accent/Warmth) - secondary buttons, cards, info boxes
        'soft-lavender': '#d59ec9',   // Soft Lavender (Highlight) - badges, tags, special callouts (use sparingly)
        'off-white': '#f7f7f7',       // Off-white (backgrounds)
        'dark-gray': '#333333',       // Dark Gray (text)
        'pure-white': '#ffffff',      // Pure white (for cards on dark backgrounds)
        
        // Keep these standard overrides for system compatibility
        background: {
          DEFAULT: '#f7f7f7',         // Off-white
          dark: '#2f6364',            // Deep Teal
        },
        foreground: '#ffffff',        // Text color on dark backgrounds
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