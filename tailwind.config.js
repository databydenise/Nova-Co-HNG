/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          'deep-emerald': '#064E3B',
          'emerald': '#047857',
          'jade': '#059669',
          'soft-jade': '#10B981',
          'muted-sage': '#A7C4B5',
          'light-green': '#ECFDF5',
          'off-white': '#F8FAF7',
          'charcoal': '#1F2933',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
      }
    },
  },
  plugins: [],
};
