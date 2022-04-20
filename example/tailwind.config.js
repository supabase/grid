const ui = require('@supabase/ui/dist/config/ui.config.js');

module.exports = ui({
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@supabase/ui/dist/config/default-theme.js',
    './../src/components/**/*.{js,ts,jsx,tsx}',
    './../src/components/**/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
