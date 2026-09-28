/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0A',
        charcoal: {
          DEFAULT: '#141416',
          800: '#1B1B1E',
          700: '#242428',
          600: '#2F2F34'
        },
        marble: {
          DEFAULT: '#F7F7F5',
          200: '#EDECE7',
          300: '#DEDCD4'
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#EBCF7A',
          pale: '#F6E7B6',
          dark: '#A8862A'
        },
        bronze: {
          DEFAULT: '#B87333',
          dark: '#8C5424'
        },
        ember: {
          DEFAULT: '#FF9F1C',
          deep: '#C8751A'
        }
      },
      fontFamily: {
        display: ['Syncopate', 'Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        arabic: ['"Noto Kufi Arabic"', 'Tajawal', 'system-ui', 'sans-serif']
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-quint': 'cubic-bezier(0.83, 0, 0.17, 1)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '150% 0' },
          '100%': { backgroundPosition: '-150% 0' }
        },
        floaty: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.6)', opacity: '0.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' }
        },
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' }
        },
        scrollCue: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' }
        },
        kenburns: {
          '0%': { transform: 'scale(1.02) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.14) translate3d(-2%,-2%,0)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.2s cubic-bezier(0.19,1,0.22,1) infinite',
        marquee: 'marquee 38s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'scroll-cue': 'scrollCue 2.2s cubic-bezier(0.83,0,0.17,1) infinite',
        kenburns: 'kenburns 14s ease-in-out infinite alternate'
      }
    }
  },
  plugins: []
};