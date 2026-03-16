/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* ── FraudEye Color Tokens ─────────────────────────── */
      colors: {
        fe: {
          bg:          '#020617',
          surface:     '#0F172A',
          card:        '#111827',
          'card-light':'#1E293B',
          border:      '#334155',
          cyan:        '#22D3EE',
          violet:      '#8B5CF6',
          success:     '#22C55E',
          warning:     '#F59E0B',
          danger:      '#F43F5E',
          text:        '#F8FAFC',
          muted:       '#94A3B8',
          dim:         '#475569',
          faint:       '#334155',
        },
      },

      /* ── Typography ──────────────────────────────────────── */
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        'xs':  ['11px', { lineHeight: '16px' }],
        'sm':  ['13px', { lineHeight: '20px' }],
        'base':['14px', { lineHeight: '22px' }],
      },

      /* ── Spacing / sizing ────────────────────────────────── */
      spacing: {
        sidebar:      '240px',
        'sidebar-mini':'64px',
        topbar:       '56px',
      },

      /* ── Screens ─────────────────────────────────────────── */
      screens: {
        xs: '480px',
      },

      /* ── Animation ───────────────────────────────────────── */
      keyframes: {
        'fe-shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'fe-live-pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%':       { opacity: 0.6, transform: 'scale(1.2)' },
        },
        'fe-row-flash': {
          '0%':   { backgroundColor: 'rgba(34,211,238,0.08)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'fade-in-up': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: 0, transform: 'translateX(16px)' },
          to:   { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'fe-shimmer':    'fe-shimmer 1.5s infinite',
        'fe-live-pulse': 'fe-live-pulse 2s ease-in-out infinite',
        'fe-row-flash':  'fe-row-flash 1.2s ease-out forwards',
        'fade-in-up':    'fade-in-up 0.35s ease-out forwards',
        'slide-right':   'slide-in-right 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};