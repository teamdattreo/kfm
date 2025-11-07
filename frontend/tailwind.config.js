/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // 👈 set Poppins as default
        anton: ['Anton', 'sans-serif'],
        guerrilla: ['"Protest Guerrilla"', 'sans-serif'],
        rouge: ['"Rouge Script"', 'cursive'],
        ranga: ['Ranga', 'cursive'],
      },
    },
  },
  plugins: [require("daisyui")],
}
