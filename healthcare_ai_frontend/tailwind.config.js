/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // Extremely deep slate/blue
        secondary: '#0f172a',
        card: 'rgba(255,255,255,0.03)',
        border: 'rgba(255,255,255,0.08)',
        primary: {
          blue: '#06B6D4', // Cyan for medical
          purple: '#10B981', // Emerald for health
        },
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        muted: '#94A3B8',
      },
    },
  },
  plugins: [],
}
