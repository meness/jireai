import headlessTailwind from '@headlessui/tailwindcss';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx', './src/layouts/**/*.tsx'],
  plugins: [headlessTailwind({ prefix: 'ui' })],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '320px',
      ...defaultTheme.screens,
    },
    extend: {
      transitionProperty: {
        'max-height': 'max-height',
      },
    },
  },
} satisfies Config;
