/**
 * Brand palette — exactly four colours (tints are tonal steps of the same hue):
 *  primary   River Teal   #0E3A47  (Shatt Al-Arab water, trust)
 *  secondary Warm Sand    #E8DCC8  (Basra stone / facade warmth)
 *  accent    Date Bronze  #95601F  (date-palm bronze, calls to action; 5.3:1 on white)
 *  neutral   Ivory        #F7F4EE  (calm reading surface)
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,ts,md,mdx}'],
  theme: {
    extend: {
      colors: {
        river: {
          DEFAULT: '#0E3A47',
          900: '#082731',
          800: '#0E3A47',
          700: '#15505F',
          600: '#1E6677',
          100: '#DCE8EA',
        },
        sand: {
          DEFAULT: '#E8DCC8',
          50: '#F3ECE0',
          200: '#E8DCC8',
          300: '#D9C7A8',
        },
        bronze: {
          DEFAULT: '#95601F',
          700: '#7A4E18',
          300: '#D9A560',
        },
        ivory: {
          DEFAULT: '#F7F4EE',
          50: '#FBFAF7',
        },
        ink: '#1B2A30',
        danger: '#B42318',
      },
      fontFamily: {
        display: ['"Noto Kufi Arabic"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans Arabic"', 'system-ui', '-apple-system', '"Segoe UI"', 'Tahoma', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(8, 39, 49, 0.25)',
      },
    },
  },
  plugins: [],
};