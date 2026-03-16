// ─── FraudEye Design Tokens ───────────────────────────────────
// Use these in JSX inline styles or Framer Motion variants
// where Tailwind classes are not sufficient.

export const tokens = {
  // Backgrounds
  bg: {
    base:    '#020617',
    surface: '#0F172A',
    card:    '#111827',
    card2:   '#1E293B',
    glass:   'rgba(17, 24, 39, 0.8)',
  },

  // Borders
  border: {
    default: '#334155',
    subtle:  '#1E293B',
    cyan:    'rgba(34, 211, 238, 0.3)',
    violet:  'rgba(139, 92, 246, 0.3)',
    danger:  'rgba(244, 63, 94, 0.3)',
    success: 'rgba(34, 197, 94, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
  },

  // Text
  text: {
    primary:   '#F8FAFC',
    secondary: '#94A3B8',
    muted:     '#475569',
    cyan:      '#22D3EE',
    violet:    '#8B5CF6',
    danger:    '#F43F5E',
    success:   '#22C55E',
    warning:   '#F59E0B',
  },

  // Accents
  accent: {
    cyan:      '#22D3EE',
    cyanDim:   '#0E7490',
    violet:    '#8B5CF6',
    violetDim: '#5B21B6',
  },

  // Status
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger:  '#F43F5E',
    info:    '#22D3EE',
  },

  // Glows (box-shadow values)
  glow: {
    cyan:    '0 0 0 1px rgba(34,211,238,0.3), 0 0 20px rgba(34,211,238,0.1)',
    violet:  '0 0 0 1px rgba(139,92,246,0.3), 0 0 20px rgba(139,92,246,0.1)',
    danger:  '0 0 0 1px rgba(244,63,94,0.3),  0 0 20px rgba(244,63,94,0.1)',
    success: '0 0 0 1px rgba(34,197,94,0.3),  0 0 20px rgba(34,197,94,0.1)',
    warning: '0 0 0 1px rgba(245,158,11,0.3), 0 0 20px rgba(245,158,11,0.1)',
  },

  // Shadows
  shadow: {
    card: '0 4px 24px 0 rgba(0,0,0,0.4)',
    lg:   '0 8px 40px 0 rgba(0,0,0,0.5)',
  },

  // Border radius
  radius: {
    sm:  '0.5rem',
    md:  '0.75rem',
    lg:  '1rem',
    xl:  '1.5rem',
  },

  // Transitions
  transition: {
    fast:   '150ms ease',
    normal: '250ms ease',
    slow:   '400ms ease',
  },
};

// ─── Framer Motion variants ───────────────────────────────────
export const motionVariants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  },
  slideInRight: {
    hidden:  { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  },
  stagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07 } },
  },
  hoverLift: {
    rest:  { y: 0,  scale: 1 },
    hover: { y: -2, scale: 1.01, transition: { duration: 0.2 } },
  },
  drawerSlide: {
    hidden:  { x: '100%', opacity: 0 },
    visible: { x: 0,      opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit:    { x: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
  },
  modalEntry: {
    hidden:  { opacity: 0, scale: 0.96, y: 8 },
    visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit:    { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.2,  ease: 'easeIn'  } },
  },
};