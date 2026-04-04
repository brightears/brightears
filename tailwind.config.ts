import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'Georgia', 'serif'],
        'noto-thai': ['var(--font-noto-thai)', 'sans-serif'],
      },
      colors: {
        // MIDNIGHT RESONANCE PALETTE
        'brand-cyan': '#00bbe4',
        'deep-teal': '#1a5152',
        'earthy-brown': '#a47764',
        'soft-lavender': '#d59ec9',
        'off-white': '#e5e2e1',
        'dark-gray': '#333333',
        'pure-white': '#ffffff',
        'luxury-black': '#0a0a0a',

        // Midnight Resonance surfaces
        'mr-bg': '#131313',
        'mr-surface': '#131313',
        'mr-surface-lowest': '#0e0e0e',
        'mr-surface-low': '#1c1b1b',
        'mr-surface-container': '#201f1f',
        'mr-surface-high': '#2a2a2a',
        'mr-surface-highest': '#353534',
        'mr-surface-bright': '#3a3939',

        // Midnight Resonance primary (cyan)
        'mr-primary': '#4fd6ff',
        'mr-primary-container': '#00bbe4',
        'mr-primary-fixed': '#b6eaff',

        // Midnight Resonance tertiary (warm)
        'mr-tertiary': '#f1bca6',
        'mr-tertiary-container': '#d3a18c',

        // Midnight Resonance secondary
        'mr-secondary': '#9cd0d1',
        'mr-secondary-container': '#1a5152',

        // Midnight Resonance text
        'mr-on-surface': '#e5e2e1',
        'mr-on-surface-variant': '#bcc9ce',

        // Midnight Resonance borders
        'mr-outline': '#869398',
        'mr-outline-variant': '#3d494e',

        // System compatibility
        background: {
          DEFAULT: '#131313',
          dark: '#0e0e0e',
        },
        foreground: '#e5e2e1',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'cyan-glow': '0px 20px 40px rgba(0, 187, 228, 0.08)',
        'cyan-glow-md': '0px 20px 40px rgba(0, 187, 228, 0.15)',
        'cyan-glow-lg': '0px 20px 40px rgba(0, 187, 228, 0.2)',
        'cyan-glow-hover': '0 0 30px rgba(79, 214, 255, 0.4)',
        'deep-shadow': '0px 40px 80px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        blob: "blob 7s infinite",
        "float-slow": "float 20s ease-in-out infinite",
        "float-medium": "float 15s ease-in-out infinite",
        "float-fast": "float 10s ease-in-out infinite",
        "hero-search-enter": "hero-search-enter 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        "suggestion-slide-in": "suggestion-slide-in 250ms cubic-bezier(0.23, 1, 0.32, 1) both",
        "filter-panel-expand": "filter-panel-expand 350ms cubic-bezier(0.16, 1, 0.3, 1)",
        "card-entrance": "card-entrance 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "activity-slide-in": "activity-slide-in 350ms cubic-bezier(0.23, 1, 0.32, 1) both",
        "live-pulse": "live-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "count-up": "count-up 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "step-transition": "step-transition 250ms cubic-bezier(0.23, 1, 0.32, 1)",
        "modal-slide-up": "modal-slide-up 350ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "backdrop-fade-in": "backdrop-fade-in 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        "loader-spin": "loader-spin 1s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "skeleton-loading": "skeleton-loading 1.5s ease-in-out infinite",
        "thai-loader": "thai-loader 1.2s cubic-bezier(0.23, 1, 0.32, 1) infinite",
        "swipe-hint": "swipe-hint 2s cubic-bezier(0.23, 1, 0.32, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "25%": { transform: "translateY(-20px) translateX(10px)" },
          "50%": { transform: "translateY(10px) translateX(-10px)" },
          "75%": { transform: "translateY(-10px) translateX(5px)" },
        },
        "hero-search-enter": {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "suggestion-slide-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "filter-panel-expand": {
          "0%": { "max-height": "0", opacity: "0", transform: "translateY(-10px)" },
          "50%": { opacity: "0.5" },
          "100%": { "max-height": "300px", opacity: "1", transform: "translateY(0)" },
        },
        "card-entrance": {
          "0%": { opacity: "0", transform: "translateY(40px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "activity-slide-in": {
          "0%": { opacity: "0", transform: "translateX(-20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.1)" },
        },
        "count-up": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "step-transition": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "modal-slide-up": {
          "0%": { opacity: "0", transform: "translateY(50px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "backdrop-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "loader-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "skeleton-loading": {
          "0%": { "background-position": "200% 0" },
          "100%": { "background-position": "-200% 0" },
        },
        "thai-loader": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "swipe-hint": {
          "0%, 100%": { transform: "translateX(0)", opacity: "1" },
          "50%": { transform: "translateX(10px)", opacity: "0.7" },
        },
      },
      animationDelay: {
        '50': '50ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '1000': '1s',
        '2000': '2s',
        '4000': '4s',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};
export default config;
