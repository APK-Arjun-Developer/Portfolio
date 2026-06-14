/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        canvas: '#08080e',
        'canvas-2': '#0d0d17',
        'canvas-3': '#12121f',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'aurora-1': 'aurora-drift-1 14s ease-in-out infinite',
        'aurora-2': 'aurora-drift-2 18s ease-in-out infinite',
        'aurora-3': 'aurora-drift-3 22s ease-in-out infinite',
        'scan': 'scan 3.5s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'aurora-drift-1': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.6' },
          '33%': { transform: 'translate(8%, -10%) scale(1.12)', opacity: '0.8' },
          '66%': { transform: 'translate(-4%, 7%) scale(0.92)', opacity: '0.5' },
        },
        'aurora-drift-2': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1.1)', opacity: '0.5' },
          '33%': { transform: 'translate(-7%, 9%) scale(0.88)', opacity: '0.7' },
          '66%': { transform: 'translate(11%, -5%) scale(1.18)', opacity: '0.4' },
        },
        'aurora-drift-3': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(0.9)', opacity: '0.7' },
          '50%': { transform: 'translate(5%, 6%) scale(1.1)', opacity: '0.5' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6,182,212,0.2), 0 0 60px rgba(6,182,212,0.05)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.2), 0 0 60px rgba(139,92,246,0.05)',
        'glass': '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card': '0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
}
