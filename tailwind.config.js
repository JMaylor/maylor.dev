/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['components/**/*.vue', '.vitepress/theme/**/*.vue'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
    },
  },
  plugins: [],
}
