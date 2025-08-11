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
        background: {
          DEFAULT: '#EDFDFF',  // Off-white with cyan tint
          dark: '#252525',     // Dark charcoal
          darker: '#1A1A1A',   // Even darker
        },
        brightears: {
          DEFAULT: '#00CFFF',
          50: '#E6F9FF',
          100: '#B3F0FF',
          200: '#80E7FF',
          300: '#4DDDFF',
          400: '#1AD4FF',
          500: '#00CFFF',
          600: '#00A8D6',
          700: '#0082A3',
          800: '#005C73',
          900: '#003643',
        },
        primary: {
          DEFAULT: '#00CFFF',
          dark: '#00A8D6',
          light: '#33DAFF',
          faint: '#E6F9FF',
        },
        secondary: '#FF6B35',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#252525',  // Brand dark gray
          900: '#1A1A1A',
        },
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