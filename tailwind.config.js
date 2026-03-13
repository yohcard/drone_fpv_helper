/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          secondary: "#111111",
          card: "#1a1a1a",
        },
        border: "#2a2a2a",
        text: {
          primary: "#f5f5f5",
          muted: "#888888",
        },
        accent: {
          DEFAULT: "#f97316",
          hover: "#ea6c0a",
        },
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
      },
      fontFamily: {
        heading: ["Space Mono", "monospace"],
        body: ["DM Sans", "sans-serif"],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          'from': { opacity: '0', transform: 'translateX(24px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(249, 115, 22, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
