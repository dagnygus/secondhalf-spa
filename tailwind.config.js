/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    screens: {
      'min580': '580px',
      'max580': { max: '579px' },
      'min610': '610px',
      'max610': { max: '609px' },
      'min640': '640px',
      'max640': { max: '639px' },
      'min720': '720px',
      'max720': { max: '719px' },
      'min800': '800px',
      'max800': { max: '799px' },
      'min840': '840px',
      'max840':  { max: '839px' },
      'min870': '870px',
      'max870': { max: '869px' },
      'min900': '900px',
      'max900': { max: '899px' },
      'min980': '980px',
      'max980': { max: '979px' },
      'min1024': '1024px',
      'max1024': { max: '1023px' }
    }
  },
  plugins: [],
}
