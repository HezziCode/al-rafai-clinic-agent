/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0A1628",
          800: "#111D35",
          700: "#1E2C4F",
        },
        teal: {
          400: "#2DD4BF",
          500: "#00BFA6",
          600: "#0D9488",
        },
        cyan: {
          400: "#4DD0E1",
          500: "#06B6D4",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
