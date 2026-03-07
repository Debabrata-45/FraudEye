export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const SSE_URL = `${API_BASE_URL}/api/stream/transactions`;

export const RISK_LABELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const RISK_COLORS = {
  LOW: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  MEDIUM: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  HIGH: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
};

export const ROUTES = {
  LOGIN: '/login',
  TRANSACTIONS: '/transactions',
  ANALYTICS: '/analytics',
  QUEUE: '/queue',
  ADMIN: '/admin',
};