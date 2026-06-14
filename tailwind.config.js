/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        canvas: '#FAFAFA',
        'canvas-2': '#F9FAFB',
        'canvas-3': '#F3F4F6',
        'glass-border': 'rgba(255,255,255,0.8)',
        'border-default': '#E5E7EB',
        'border-light': '#F3F4F6',
        'text-heading': '#111827',
        'text-body': '#374151',
        'text-secondary': '#6B7280',
        'accent-blue': '#2563EB',
        'accent-violet': '#7C3AED',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'aurora-1': 'aurora-drift-1 14s ease-in-out infinite',
        'aurora-2': 'aurora-drift-2 18s ease-in-out infinite',
        'aurora-3': 'aurora-drift-3 22s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'tech-pop': 'tech-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
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
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.7' },
          '33%': { transform: 'translate(8%, -10%) scale(1.12)', opacity: '0.9' },
          '66%': { transform: 'translate(-4%, 7%) scale(0.92)', opacity: '0.6' },
        },
        'aurora-drift-2': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1.1)', opacity: '0.6' },
          '33%': { transform: 'translate(-7%, 9%) scale(0.88)', opacity: '0.8' },
          '66%': { transform: 'translate(11%, -5%) scale(1.18)', opacity: '0.5' },
        },
        'aurora-drift-3': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(0.9)', opacity: '0.8' },
          '50%': { transform: 'translate(5%, 6%) scale(1.1)', opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'tech-pop': {
          from: { opacity: '0', transform: 'scale(0.85) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'grid-light': 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
        'glass-hover': '0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'blue-glow': '0 4px 20px rgba(37,99,235,0.2)',
        'violet-glow': '0 4px 20px rgba(124,58,237,0.2)',
        'tech': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'tech-hover': '0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
