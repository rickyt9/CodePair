/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    minWidth: {
      12: '3rem',
    },
    extend: {
      colors: {
        darkgrey: '#383A45',
        darkblue: {
          200: '#373A50',
          500: '#313446',
          800: '#262837',
        },
        charcoal: '#292626',
        beige: '#DBC8C8',
        palecyan: '#6C849A',
      },
    },
  },
  plugins: [],
};
