import { subMinutes, subHours, subDays } from 'date-fns';

// ─── Contribution config ──────────────────────────────────────────────────────
export const CONTRIBUTION = {
  FRAUD:  { color: '#F43F5E', bg: 'bg-rose-500', text: 'text-rose-400', label: 'Increases fraud risk' },
  SAFE:   { color: '#22C55E', bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Reduces fraud risk' },
};

// ─── Recommendation config ────────────────────────────────────────────────────
export const RECOMMENDATIONS = {
  BLOCK:   { label: 'Block Transaction',        detail: 'Confidence is high enough to warrant immediate block.', color: 'text-rose-300',    bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    icon: '🚫' },
  ESCALATE:{ label: 'Escalate for Review',      detail: 'Risk is elevated — route to senior analyst for manual review.', color: 'text-orange-300', bg: 'bg-orange-500/10',  border: 'border-orange-500/25',  icon: '⚠️' },
  MONITOR: { label: 'Monitor Closely',          detail: 'Borderline case — flag account and watch next 24h activity.', color: 'text-amber-300',  bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   icon: '👁️' },
  APPROVE: { label: 'Approve with Logging',     detail: 'Low risk — approve but record for pattern analysis.', color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', icon: '✅' },
};

// ─── SHAP feature pool ────────────────────────────────────────────────────────
const ALL_FEATURES = [
  { feature: 'Transaction Velocity (24h)',  category: 'Behavioral',  description: 'Number of transactions in last 24 hours versus historical average.' },
  { feature: 'Amount Deviation Score',      category: 'Financial',   description: 'How far the transaction amount deviates from the account baseline.' },
  { feature: 'Geo-Location Anomaly',        category: 'Contextual',  description: 'Distance and travel impossibility between recent transaction locations.' },
  { feature: 'Device Fingerprint Trust',    category: 'Technical',   description: 'Trustworthiness score of the device used for the transaction.' },
  { feature: 'Merchant Risk Score',         category: 'Merchant',    description: 'Historical fraud rate associated with this merchant category.' },
  { feature: 'Time-of-Day Pattern',         category: 'Behavioral',  description: "How unusual the transaction time is relative to user's history." },
  { feature: 'Account Age (days)',          category: 'Account',     description: 'Age of the account — newer accounts carry higher baseline risk.' },
  { feature: 'Historical Avg Amount',       category: 'Financial',   description: "Comparison against the user's rolling average transaction amount." },
  { feature: 'Failed Auth Count (7d)',      category: 'Security',    description: 'Number of failed authentication attempts in the last 7 days.' },
  { feature: 'Card-Not-Present Flag',       category: 'Technical',   description: 'Whether the physical card was absent during this transaction.' },
  { feature: 'Cross-Border Indicator',      category: 'Contextual',  description: 'Whether the transaction crossed international jurisdiction lines.' },
  { feature: 'Chargeback History Rate',     category: 'Financial',   description: 'Rate of past chargebacks on this account or merchant.' },
];

// ─── Fraud driver chips ───────────────────────────────────────────────────────
const DRIVER_POOL = [
  { label: 'Velocity Spike',        icon: '⚡', severity: 'critical' },
  { label: 'Unusual Amount',        icon: '💰', severity: 'high'     },
  { label: 'Geo Mismatch',          icon: '📍', severity: 'high'     },
  { label: 'New Device',            icon: '📱', severity: 'medium'   },
  { label: 'High-Risk Merchant',    icon: '🏴', severity: 'high'     },
  { label: 'Late Night Activity',   icon: '🌙', severity: 'medium'   },
  { label: 'Cross-Border Transfer', icon: '🌍', severity: 'high'     },
  { label: 'Failed Auth History',   icon: '🔐', severity: 'critical' },
  { label: 'Card Not Present',      icon: '💳', severity: 'medium'   },
  { label: 'Account Age Risk',      icon: '🕐', severity: 'low'      },
  { label: 'Chargeback Pattern',    icon: '↩️', severity: 'high'     },
  { label: 'Device Anomaly',        icon: '🖥️', severity: 'medium'   },
];

export const DRIVER_SEVERITY = {
  critical: { bg: 'bg-rose-500/15',   border: 'border-rose-500/35',   text: 'text-rose-300'   },
  high:     { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-300' },
  medium:   { bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  text: 'text-amber-300'  },
  low:      { bg: 'bg-slate-700/30',  border: 'border-slate-600/30',  text: 'text-slate-400'  },
};

// ─── Case factory ─────────────────────────────────────────────────────────────
const MERCHANTS = [
  { name: 'Coinbase Exchange', category: 'Crypto',       icon: '₿' },
  { name: 'Binance Global',    category: 'Crypto',       icon: '🔶' },
  { name: 'Wise Transfers',    category: 'Remittance',   icon: '🌍' },
  { name: 'Shopify Merchants', category: 'E-Commerce',   icon: '🛒' },
  { name: 'Revolut Ltd',       category: 'Neobank',      icon: '🔷' },
  { name: 'FTX Trading',       category: 'Crypto Exch.', icon: '📈' },
];

const GEOS    = ['Lagos, NG', 'Unknown', 'São Paulo, BR', 'Moscow, RU', 'New York, US', 'London, UK'];
const DEVICES = ['Unknown Device', 'iOS 17.4', 'Android 14', 'Chrome/Win', 'API Client'];

const makeShapFeatures = (fraudScore) => {
  const isFraud = fraudScore >= 0.65;
  return ALL_FEATURES.map((f, i) => {
    const raw = isFraud
      ? [0.31, 0.27, 0.22, -0.18, 0.19, 0.14, -0.11, -0.09, 0.17, 0.13, 0.10, 0.08][i]
      : [0.08, -0.12, 0.05, -0.21, 0.04, -0.09, -0.15, -0.18, 0.03, -0.07, 0.02, -0.11][i];
    return {
      ...f,
      shapValue:    raw,
      contribution: raw > 0 ? 'FRAUD' : 'SAFE',
      absValue:     Math.abs(raw),
      rawValue:     raw > 0
        ? `+${raw.toFixed(3)}`
        : raw.toFixed(3),
    };
  }).sort((a, b) => b.absValue - a.absValue);
};

const makeLimeFeatures = (fraudScore) => {
  const isFraud = fraudScore >= 0.65;
  return ALL_FEATURES.slice(0, 8).map((f, i) => {
    const raw = isFraud
      ? [0.28, 0.24, 0.19, -0.15, 0.16, 0.12, -0.09, -0.07][i]
      : [0.06, -0.10, 0.04, -0.18, 0.03, -0.08, -0.13, -0.16][i];
    return {
      ...f,
      limeWeight:   raw,
      contribution: raw > 0 ? 'FRAUD' : 'SAFE',
      absValue:     Math.abs(raw),
    };
  }).sort((a, b) => b.absValue - a.absValue);
};

const makeNarrative = (fraudScore) => {
  if (fraudScore >= 0.85) return `This transaction was flagged with critical confidence. The model detected a sharp velocity spike combined with a geo-location impossibility and an unrecognized device on a high-risk merchant — a pattern strongly associated with account takeover fraud.`;
  if (fraudScore >= 0.65) return `This transaction raised significant fraud signals. Elevated transaction velocity, an unusual amount deviation, and a cross-border indicator collectively pushed the risk score above the fraud threshold.`;
  if (fraudScore >= 0.40) return `This transaction shows borderline risk indicators. While no single feature is definitive, the combination of a new device fingerprint and slightly unusual timing warrants review before approval.`;
  return `This transaction appears consistent with normal behavior. Historical amount patterns, trusted device, and regular merchant category all contribute to a low fraud probability score.`;
};

const makeCase = (i, timestamp) => {
  const fraudScores  = [0.92, 0.87, 0.74, 0.68, 0.51, 0.44, 0.23, 0.18, 0.09, 0.61, 0.83, 0.38];
  const fraudScore   = fraudScores[i % fraudScores.length];
  const merchant     = MERCHANTS[i % MERCHANTS.length];
  const isFraud      = fraudScore >= 0.65;
  const isSuspicious = fraudScore >= 0.40 && fraudScore < 0.65;

  const recommendation =
    fraudScore >= 0.85 ? 'BLOCK' :
    fraudScore >= 0.65 ? 'ESCALATE' :
    fraudScore >= 0.40 ? 'MONITOR' : 'APPROVE';

  const numDrivers = isFraud ? 5 : isSuspicious ? 3 : 2;
  const drivers    = DRIVER_POOL.slice(i % 4, (i % 4) + numDrivers);

  return {
    id:               `EXP-${String(300000 + i).padStart(6, '0')}`,
    txnId:            `TXN-${String(100000 + i * 7).padStart(6, '0')}`,
    timestamp,
    fraudScore,
    fraudLabel:       isFraud ? 'FRAUD' : isSuspicious ? 'SUSPICIOUS' : 'LEGITIMATE',
    modelConfidence:  Math.round((0.72 + (i % 3) * 0.08) * 100),
    explainConfidence:Math.round((0.78 + (i % 4) * 0.05) * 100),
    recommendation,
    narrative:        makeNarrative(fraudScore),
    shapFeatures:     makeShapFeatures(fraudScore),
    limeFeatures:     makeLimeFeatures(fraudScore),
    drivers,
    merchant,
    amount:           parseFloat((50 + (i * 317.5) % 9800).toFixed(2)),
    currency:         'USD',
    geo:              GEOS[i % GEOS.length],
    device:           DEVICES[i % DEVICES.length],
    accountId:        `ACC-${String(10000 + i * 13)}`,
    status:           isFraud ? 'FLAGGED' : isSuspicious ? 'UNDER_REVIEW' : 'APPROVED',
    modelVersion:     'xgb_v2.1.0',
    explainMethod:    i % 3 === 0 ? 'LIME' : 'SHAP',
  };
};

// ─── Build dataset ────────────────────────────────────────────────────────────
const now = new Date();
export const MOCK_CASES = Array.from({ length: 12 }, (_, i) => {
  const ts = i < 3  ? subMinutes(now, i * 8)
    : i < 7  ? subHours(now, i * 1.5)
    : subDays(now, Math.floor(i / 4));
  return makeCase(i, ts);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const FRAUD_LABEL_CONFIG = {
  FRAUD:      { text: 'text-rose-300',    bg: 'bg-rose-500/15',    border: 'border-rose-500/35'    },
  SUSPICIOUS: { text: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30'   },
  LEGITIMATE: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
};

export const formatAmount = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const formatTime = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date);