import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Jesus Festival identity: black + royal purple + gold.
        ink: "#0a0510",
        navy: {
          950: "#0b0616",
          900: "#170a29",
          800: "#2a0f4d",
          700: "#4a1d8a",
        },
        gold: {
          DEFAULT: "#f5a623",
          400: "#ffc24d",
          500: "#f5a623",
          600: "#d98a00",
        },
        // "ember" slot repurposed as the purple accent (keeps class names working).
        ember: {
          DEFAULT: "#9333ea",
          400: "#a855f7",
          500: "#9333ea",
          600: "#7a1fc9",
        },
        purple: {
          DEFAULT: "#9333ea",
          300: "#c084fc",
          400: "#a855f7",
          500: "#9333ea",
          600: "#7e22ce",
          700: "#5b1898",
          900: "#2a0a3f",
        },
        sky: {
          glow: "#a855f7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -4px rgba(245,166,35,0.45)",
        "glow-ember": "0 0 50px -6px rgba(147,51,234,0.55)",
        "glow-purple": "0 0 50px -6px rgba(147,51,234,0.55)",
        card: "0 20px 50px -20px rgba(0,0,0,0.75)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "75%, 100%": { transform: "scale(2.6)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0,0,0.2,1) infinite",
        shimmer: "shimmer 6s linear infinite",
        "gradient-pan": "gradient-pan 12s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
