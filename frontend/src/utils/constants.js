// ─── API ──────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export const SSE_URL = `${API_BASE_URL}/api/stream/transactions`;

// ─── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  LOGIN:        '/login',
  TRANSACTIONS: '/transactions',
  ANALYTICS:    '/analytics',
  QUEUE:        '/queue',
  ADMIN:        '/admin',
};

// ─── Risk levels ──────────────────────────────────────────────
export const RISK_LEVELS = {
  LOW:      'low',
  MEDIUM:   'medium',
  HIGH:     'high',
  CRITICAL: 'critical',
};

export const RISK_CONFIG = {
  low: {
    label:      'Low Risk',
    color:      'text-emerald-400',
    bg:         'bg-emerald-500/10',
    border:     'border-emerald-500/30',
    dot:        'bg-emerald-400',
    glow:       'fe-glow-success',
    bar:        'bg-emerald-500',
    rowEdge:    'fe-row-low',
    threshold:  [0, 30],
  },
  medium: {
    label:      'Moderate Risk',
    color:      'text-amber-400',
    bg:         'bg-amber-500/10',
    border:     'border-amber-500/30',
    dot:        'bg-amber-400',
    glow:       'fe-glow-warning',
    bar:        'bg-amber-500',
    rowEdge:    'fe-row-medium',
    threshold:  [31, 70],
  },
  high: {
    label:      'High Risk',
    color:      'text-rose-400',
    bg:         'bg-rose-500/10',
    border:     'border-rose-500/30',
    dot:        'bg-rose-400',
    glow:       'fe-glow-danger',
    bar:        'bg-rose-500',
    rowEdge:    'fe-row-high',
    threshold:  [71, 89],
  },
  critical: {
    label:      'Critical Fraud',
    color:      'text-red-400',
    bg:         'bg-red-500/10',
    border:     'border-red-500/30',
    dot:        'bg-red-500',
    glow:       'fe-glow-danger',
    bar:        'bg-red-600',
    rowEdge:    'fe-row-high',
    threshold:  [90, 100],
  },
};

// ─── Get risk config from score ───────────────────────────────
export function getRiskConfig(scoreOrLabel) {
  if (typeof scoreOrLabel === 'number') {
    if (scoreOrLabel >= 90) return RISK_CONFIG.critical;
    if (scoreOrLabel >= 71) return RISK_CONFIG.high;
    if (scoreOrLabel >= 31) return RISK_CONFIG.medium;
    return RISK_CONFIG.low;
  }
  const key = String(scoreOrLabel).toLowerCase();
  return RISK_CONFIG[key] || RISK_CONFIG.low;
}

// ─── Colors ───────────────────────────────────────────────────
export const COLORS = {
  bg:         '#020617',
  surface:    '#0F172A',
  card:       '#111827',
  card2:      '#1E293B',
  border:     '#334155',
  cyan:       '#22D3EE',
  violet:     '#8B5CF6',
  success:    '#22C55E',
  warning:    '#F59E0B',
  danger:     '#F43F5E',
  text:       '#F8FAFC',
  textMuted:  '#94A3B8',
};

// ─── Chart colors ─────────────────────────────────────────────
export const CHART_COLORS = {
  fraud:   '#F43F5E',
  safe:    '#22C55E',
  medium:  '#F59E0B',
  cyan:    '#22D3EE',
  violet:  '#8B5CF6',
  grid:    '#1E293B',
  tooltip: '#0F172A',
};

// ─── Nav items ────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Live Feed',   path: ROUTES.TRANSACTIONS, icon: 'Activity'  },
  { label: 'Analytics',  path: ROUTES.ANALYTICS,    icon: 'BarChart3'  },
  { label: 'Queue',      path: ROUTES.QUEUE,         icon: 'Layers'    },
  { label: 'Admin',      path: ROUTES.ADMIN,         icon: 'Settings', adminOnly: true },
];

// ─── Status labels ────────────────────────────────────────────
export const STATUS = {
  LIVE:        'LIVE',
  DISCONNECTED:'DISCONNECTED',
  CONNECTING:  'CONNECTING',
};