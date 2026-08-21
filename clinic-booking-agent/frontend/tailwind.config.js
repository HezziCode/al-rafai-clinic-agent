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
          DEFAULT: "#2B6CB0",
          light: "#EBF4FF",
          mid: "#4A90D9",
          dark: "#1A4971",
        },
        accent: {
          DEFAULT: "#38A169",
          light: "#F0FFF4",
          dark: "#276749",
        },
        warm: "#F6F0E8",
        "text-dark": "#1A202C",
        "text-mid": "#4A5568",
        "text-light": "#718096",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(43, 108, 176, 0.08), 0 2px 4px -2px rgba(43, 108, 176, 0.05)',
        'lg': '0 10px 15px -3px rgba(43, 108, 176, 0.1), 0 4px 6px -4px rgba(43, 108, 176, 0.05)',
        'xl': '0 20px 25px -5px rgba(43, 108, 176, 0.12), 0 8px 10px -6px rgba(43, 108, 176, 0.05)',
        '2xl': '0 25px 50px -12px rgba(43, 108, 176, 0.18)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
