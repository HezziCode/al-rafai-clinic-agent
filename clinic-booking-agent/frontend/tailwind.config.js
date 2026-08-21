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
        primary: {
          DEFAULT: "#4A90D9",
          dark: "#2C6FAC",
          light: "#EAF3FB",
        },
        medical: {
          bg: "#FFFFFF",
          surface: "#F0F6FF",
          card: "#FFFFFF",
          accent: "#EAF3FB",
          primary: "#4A90D9",
          primaryDark: "#2C6FAC",
          text: "#1A1A2E",
          muted: "#5A6A7A",
          border: "#E0EAF4",
          success: "#27AE60",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'medical': '0 4px 20px -2px rgba(74, 144, 217, 0.12)',
        'medical-hover': '0 10px 30px -4px rgba(74, 144, 217, 0.2)',
        'card': '0 2px 12px rgba(26, 26, 46, 0.04)',
      },
      borderRadius: {
        'card': '16px',
      }
    },
  },
  plugins: [],
}
