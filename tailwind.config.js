/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background hierarchy — slate/navy with depth
        base:        '#0B0F1A',
        surface:     '#131826',
        card:        '#1A2030',
        'card-elev': '#222B40',
        input:       '#0F1422',

        // Borders
        border:        '#2A3145',
        'border-strong': '#3D4660',

        // Text
        'txt-1': '#FFFFFF',
        'txt-2': '#E2E8F0',
        'txt-3': '#94A3B8',
        'txt-4': '#64748B',

        // Accent palette — vibrant but cohesive
        emerald:    '#00D67D',
        'emerald-2': '#10B981',
        cyan:       '#06B6D4',
        sky:        '#0EA5E9',
        violet:     '#8B5CF6',
        amber:      '#FBBF24',
        orange:     '#FB923C',
        rose:       '#F87171',
        crimson:    '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero:        ['64px',  { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
        mega:        ['44px',  { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'mega-hero': ['120px', { lineHeight: '1.0',  letterSpacing: '-0.03em', fontWeight: '800' }],
        'ultra-hero':['144px', { lineHeight: '1.0',  letterSpacing: '-0.04em', fontWeight: '800' }],
      },
      backgroundImage: {
        'gradient-card':       'linear-gradient(165deg, rgba(34,43,64,0.55), rgba(26,32,48,0.55))',
        'gradient-card-hi':    'linear-gradient(165deg, rgba(0,214,125,0.06), rgba(6,182,212,0.04))',
        'gradient-base':       'radial-gradient(circle at 18% -10%, rgba(0,214,125,0.08), transparent 42%), radial-gradient(circle at 92% 6%, rgba(6,182,212,0.07), transparent 42%), #0B0F1A',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,214,125,0.20), 0 8px 32px -8px rgba(0,214,125,0.30)',
        'glow-rose':   '0 0 0 1px rgba(248,113,113,0.25), 0 8px 32px -8px rgba(248,113,113,0.35)',
        'inset-1':     'inset 0 1px 0 rgba(255,255,255,0.04)',
        'soft':        '0 6px 24px -10px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-gap':       'pulseGap 2.6s ease-in-out infinite',
        'pulse-gap-soft':  'pulseGapSoft 3s ease-in-out infinite',
        'fade-up':         'fadeUp 500ms cubic-bezier(0.4,0,0.2,1) both',
        'shimmer':         'shimmer 2.4s linear infinite',
      },
      keyframes: {
        pulseGap: {
          '0%, 100%': { transform: 'scale(1)',     boxShadow: '0 0 0 0   rgba(248,113,113,0.45)' },
          '50%':      { transform: 'scale(1.018)', boxShadow: '0 0 0 16px rgba(248,113,113,0)'    },
        },
        pulseGapSoft: {
          '0%, 100%': { transform: 'scale(1)',     boxShadow: '0 0 60px -20px rgba(239,68,68,0.4)' },
          '50%':      { transform: 'scale(1.005)', boxShadow: '0 0 80px -20px rgba(239,68,68,0.6)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0'  },
        },
      },
    },
  },
  plugins: [],
};
