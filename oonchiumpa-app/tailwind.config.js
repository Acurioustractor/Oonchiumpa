/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Inspired by Aboriginal art and the Australian landscape
        ochre: {
          50: '#fef6ee',
          100: '#fde9d6',
          200: '#fbd0ac',
          300: '#f8af77',
          400: '#f48740',
          500: '#f16a1a',
          600: '#e24e10',
          700: '#bc3a10',
          800: '#962e14',
          900: '#792813',
          950: '#411108',
        },
        earth: {
          50: '#f9f7f4',
          100: '#f0eae3',
          200: '#e0d3c5',
          300: '#ccb5a0',
          400: '#b7937a',
          500: '#a87a5f',
          600: '#9b6852',
          700: '#815445',
          800: '#6a463c',
          900: '#583b33',
          950: '#2f1e1a',
        },
        eucalyptus: {
          50: '#f4f7f5',
          100: '#e4ebe7',
          200: '#cbd9d1',
          300: '#a6bfb3',
          400: '#7a9d8d',
          500: '#5d8172',
          600: '#49675a',
          700: '#3c534a',
          800: '#33443d',
          900: '#2b3934',
          950: '#161f1b',
        },
        sunset: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fececa',
          300: '#fcaba5',
          400: '#f77b71',
          500: '#ed5244',
          600: '#da3426',
          700: '#b7281c',
          800: '#96251b',
          900: '#7c241c',
          950: '#430f0a',
        },
        sand: {
          50: '#fbf8f3',
          100: '#f5ede2',
          200: '#eadac4',
          300: '#dcc19e',
          400: '#cca477',
          500: '#c08d5b',
          600: '#b37950',
          700: '#946143',
          800: '#795039',
          900: '#624230',
          950: '#342018',
        }
      },
      fontFamily: {
        'display': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dreamtime': 'dreamtime 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        dreamtime: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(1deg)' },
        }
      },
      backgroundImage: {
        'dot-pattern': "url('data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}