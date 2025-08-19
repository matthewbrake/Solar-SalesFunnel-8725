/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "'Inter', sans-serif",
        heading: "'Poppins', sans-serif",
      },
      colors: {
        primary: {
          DEFAULT: '#0052cc',
          light: '#e6f0ff',
          dark: '#003e99',
        },
        secondary: {
          DEFAULT: '#172b4d',
          light: '#f4f5f7',
          dark: '#091e42',
        },
        background: {
          DEFAULT: '#f8f9fa',
          surface: '#ffffff',
        },
        text: {
          primary: '#172b4d',
          secondary: '#505f79',
          subtle: '#6b778c',
          onPrimary: '#ffffff',
        },
        success: '#00875a',
        danger: '#de350b',
        warning: '#ffab00',
        border: '#dfe1e6',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(9, 30, 66, 0.15), 0 0 1px 0 rgba(9, 30, 66, 0.3)',
        'card': '0 4px 8px 0 rgba(9, 30, 66, 0.1), 0 0 1px 0 rgba(9, 30, 66, 0.25)',
        'overlay': '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 1px 0 rgba(9, 30, 66, 0.31)',
      },
    },
  },
  plugins: [],
}
