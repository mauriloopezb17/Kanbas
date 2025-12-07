/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        'kanbas-blue': '#2563eb',
        'kanbas-purple': '#7c3aed',
        'kanbas-red': '#ef4444',
        'kanbas-orange': '#f97316',
        'kanbas-green': '#10b981',
      },
    },
  },
  plugins: [],
}
