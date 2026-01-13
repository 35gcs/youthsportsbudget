/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sports-primary': '#1E40AF', // Blue
        'sports-secondary': '#059669', // Green
        'sports-accent': '#DC2626', // Red
        'sports-warning': '#F59E0B', // Amber
        'bg-primary': '#0F172A',
        'bg-secondary': '#1E293B',
        'bg-tertiary': '#334155',
        'text-primary': '#F1F5F9',
        'text-secondary': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
