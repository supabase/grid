module.exports = {
  mode: 'jit',
  prefix: 'grid-',
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#82dab0',
          100: '#82dab0',
          200: '#69d3a0',
          300: '#50cb90',
          400: '#C5F1DD',
          500: '#9FE7C7',
          600: '#65D9A5',
          700: '#3ECF8E',
          800: '#24b47e', // green-500 in dashboard
          900: '#2c9c6a',
        },

        gray: {
          100: '#eeeeee',
          200: '#e0e0e0',
          300: '#bbbbbb',
          400: '#666666',
          500: '#444444',
          600: '#2a2a2a',
          650: '#333',
          700: '#1f1f1f',
          800: '#181818',
          900: '#0f0f0f',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
