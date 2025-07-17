/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {
      colors: {
        primary: "#4C6EF5",
        secondary: "#EDF2FF",
        accent: "#74C69D",
        textDark: "#1E293B",
        textLight: "#475569",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}