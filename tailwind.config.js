/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // safe even if app/ is renamed
  ],
  theme: {
    extend: {
      borderRadius: { '2xl': '1rem' },
      boxShadow: { 'soft': '0 10px 30px rgba(0,0,0,0.25)' },
    },
  },
  plugins: [],
}
