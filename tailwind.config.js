/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height'
      },
      screens: {
        'xs': '480px',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      backgroundPosition: {
        '0': '0% 0%',
        '100': '100% 100%',
      }
    },
  },
  plugins: [
      require('tailwind-scrollbar')({ nocompatible: true })
  ],
}