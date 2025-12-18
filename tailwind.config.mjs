/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        accent: '#d4af37',
        background: '#f8fafc',
        text: '#334155',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}