/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        neon: {
          blue: '#22d3ee',
          green: '#34d399',
          purple: '#a78bfa',
          pink: '#f472b6',
        },
        glass: {
          border: 'rgba(255,255,255,0.08)',
          surface: 'rgba(15, 23, 42, 0.55)',
        },
      },
      backgroundImage: {
        'grid-glow':
          'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 211, 238, 0.15)',
        'glow-purple': '0 0 40px rgba(167, 139, 250, 0.2)',
      },
    },
  },
  plugins: [],
}
