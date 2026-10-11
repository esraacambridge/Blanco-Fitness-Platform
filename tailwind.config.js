/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // BLANCO — cinematic black & gold
        blanco: {
          'black': 'rgb(var(--blanco-black) / <alpha-value>)',
          'secondary': 'rgb(var(--blanco-secondary) / <alpha-value>)',
          'elevated': 'rgb(var(--blanco-elevated) / <alpha-value>)',
          'gold': 'rgb(var(--blanco-gold) / <alpha-value>)',
          'gold-light': 'rgb(var(--blanco-gold-light) / <alpha-value>)',
          'gold-dark': 'rgb(var(--blanco-gold-dark) / <alpha-value>)',
          'white': 'rgb(var(--blanco-white) / <alpha-value>)',
          'muted': 'rgb(var(--blanco-muted) / <alpha-value>)',
          'muted-dark': 'rgb(var(--blanco-muted-dark) / <alpha-value>)',
          'line': 'rgb(var(--blanco-line) / <alpha-value>)',
        },
        // Light theme tokens
        surface: {
          light: 'rgb(var(--surface-light) / <alpha-value>)',
          'light-2': 'rgb(var(--surface-light-2) / <alpha-value>)',
          'light-3': 'rgb(var(--surface-light-3) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'Impact', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
        'arabic-display': ['Tajawal', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'fade-in-down': 'fadeInDown 0.7s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-gold': 'pulseGold 2s infinite',
        'glow': 'glow 3s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer-border': 'shimmerBorder 3s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown: { '0%': { opacity: '0', transform: 'translateY(-30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(40px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideInLeft: { '0%': { opacity: '0', transform: 'translateX(-40px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { textShadow: '0 0 40px rgba(212, 175, 55, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmerBorder: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F1D98A 100%)',
        'gold-gradient-rev': 'linear-gradient(135deg, #F1D98A 0%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #080808 0%, #111111 100%)',
        'elevated-gradient': 'linear-gradient(180deg, #111111 0%, #191919 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.25)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};
