import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#08752B',
          dark: '#063B1B',
          deeper: '#042912',
          forest: '#0A5426',
          emerald: '#16A34A',
          mint: '#ECF6EE',
          light: '#F5F8F5',
          orange: '#F28C18',
          orangeHover: '#DF7A0B',
          charcoal: '#17231C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(16, 42, 25, 0.07), 0 2px 8px -2px rgba(16, 42, 25, 0.04)',
        card: '0 8px 30px rgba(7, 45, 21, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
