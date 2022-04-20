const ui = require('@supabase/ui/dist/config/ui.config.js');

const gray = {
  100: '#eeeeee',
  200: '#e0e0e0',
  300: '#bbbbbb',
  400: '#666666',
  500: '#444444',
  650: '#333',
  600: '#2a2a2a',
  700: '#1f1f1f',
  800: '#181818',
  900: '#0f0f0f',
};

const green = {
  100: '#c5f1dd',
  200: '#c5f1dd',
  300: '#9fe7c7',
  400: '#65d9a5',
  500: '#24b47e',
  600: '#38bc81',
  700: '#1c8656',
  800: '#10633e',
  900: '#10633e',
};

const blueGray = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
};

const coolGray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

module.exports = ui({
  mode: 'jit',
  darkMode: 'class',
  // purge: ['./src/**/*.tsx'],
  theme: {
    borderColor: (theme) => ({
      ...theme('colors'),
      DEFAULT: '#f0f2f5',
      dark: theme('colors.gray.600', 'currentColor'),
    }),
    extend: {
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        lg: '18px',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      colors: {
        gray: { ...gray },
        green: { ...green },
        blueGray: { ...blueGray },
        coolGray: { ...coolGray },

        /* 
          typography
        */
        'typography-body': {
          light: coolGray[600],
          dark: gray[100],
        },
        'typography-body-secondary': {
          light: coolGray[400],
          dark: gray[300],
        },
        'typography-body-secondary': {
          light: coolGray[500],
          dark: gray[100],
        },
        'typography-body-strong': {
          light: coolGray[800],
          dark: 'white',
        },
        'typography-body-faded': {
          light: coolGray[400],
          dark: gray[300],
        },

        /*
          Tables
        */
        'table-body': {
          light: 'var(--colors-scale2)',
          dark: 'var(--colors-scale2)',
        },
        'table-header': {
          light: 'var(--colors-scale1)',
          dark: 'var(--colors-scale3)',
        },
        'table-footer': {
          light: 'var(--colors-scale1)',
          dark: 'var(--colors-scale3)',
        },
        'table-border': {
          light: 'var(--colors-scale5)',
          dark: 'var(--colors-scale5)',
        },

        /* 
          app backgrounds
        */
        'bg-secondary': {
          light: blueGray[100],
          dark: gray[700],
        },
        'bg-alt': {
          light: blueGray[50], // gray[100],
          dark: gray[600],
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
});
