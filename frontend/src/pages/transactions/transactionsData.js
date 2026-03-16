import { formatDistanceToNow, subMinutes, subHours, subDays } from "date-fns";

// ─── Risk config ──────────────────────────────────────────────────────────────
export const RISK_LEVELS = {
  CRITICAL: {
    label: "Critical",
    color: "#F43F5E",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    bar: "bg-rose-500",
    edge: "border-l-rose-500",
  },
  HIGH: {
    label: "High",
    color: "#F97316",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    bar: "bg-orange-500",
    edge: "border-l-orange-500",
  },
  MEDIUM: {
    label: "Medium",
    color: "#F59E0B",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    bar: "bg-amber-500",
    edge: "border-l-amber-500",
  },
  LOW: {
    label: "Low",
    color: "#22C55E",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    bar: "bg-emerald-500",
    edge: "border-l-emerald-500",
  },
  SAFE: {
    label: "Safe",
    color: "#22C55E",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    bar: "bg-emerald-500",
    edge: "border-l-emerald-500",
  },
};

export const STATUS_CONFIG = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  FLAGGED: {
    label: "Flagged",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  BLOCKED: {
    label: "Blocked",
    bg: "bg-rose-900/20",
    text: "text-rose-300",
    border: "border-rose-700/30",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
  },
};

export const FRAUD_LABEL_CONFIG = {
  FRAUD: {
    label: "Fraud",
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
  LEGITIMATE: {
    label: "Legitimate",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  SUSPICIOUS: {
    label: "Suspicious",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  UNKNOWN: {
    label: "Unknown",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getRiskLevel = (score) => {
  if (score >= 0.85) return "CRITICAL";
  if (score >= 0.65) return "HIGH";
  if (score >= 0.4) return "MEDIUM";
  if (score >= 0.2) return "LOW";
  return "SAFE";
};

export const formatAmount = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );

export const formatTimestamp = (date) =>
  formatDistanceToNow(date, { addSuffix: true });

export const formatExactTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

// ─── SHAP explanation mock ────────────────────────────────────────────────────
const makeShapFeatures = (riskScore) => {
  const high = riskScore > 0.65;
  return [
    {
      feature: "Transaction Velocity",
      value: high ? 0.31 : 0.08,
      positive: high,
    },
    { feature: "Amount Deviation", value: high ? 0.27 : 0.05, positive: high },
    {
      feature: "Geo-location Anomaly",
      value: high ? 0.22 : 0.03,
      positive: high,
    },
    {
      feature: "Device Fingerprint",
      value: high ? 0.18 : 0.04,
      positive: !high,
    },
    {
      feature: "Merchant Risk Score",
      value: high ? 0.14 : 0.02,
      positive: high,
    },
    {
      feature: "Time-of-Day Pattern",
      value: high ? 0.11 : 0.06,
      positive: !high,
    },
    { feature: "Account Age", value: 0.09, positive: false },
    { feature: "Historical Avg Amount", value: 0.07, positive: false },
  ];
};

// ─── Mock transactions ────────────────────────────────────────────────────────
const MERCHANTS = [
  { name: "Amazon Web Services", category: "Cloud Services", icon: "☁️" },
  { name: "Coinbase Exchange", category: "Crypto", icon: "₿" },
  { name: "Binance Global", category: "Crypto", icon: "🔶" },
  { name: "Stripe Payments", category: "Fintech", icon: "💳" },
  { name: "Revolut Ltd", category: "Neobank", icon: "🔷" },
  { name: "FTX Trading", category: "Crypto Exchange", icon: "📈" },
  { name: "Netflix Inc", category: "Streaming", icon: "🎬" },
  { name: "Shopify Merchants", category: "E-Commerce", icon: "🛒" },
  { name: "Wise Transfers", category: "Remittance", icon: "🌍" },
  { name: "PayPal Holdings", category: "Payments", icon: "🅿" },
  { name: "Square Financial", category: "POS Payments", icon: "⬛" },
  { name: "Robinhood Markets", category: "Brokerage", icon: "🐦" },
];

const GEOS = [
  "New York, US",
  "London, UK",
  "Lagos, NG",
  "Singapore, SG",
  "Dubai, AE",
  "Mumbai, IN",
  "São Paulo, BR",
  "Unknown",
];
const DEVICES = [
  "iOS 17.4",
  "Android 14",
  "Chrome/Win",
  "Firefox/Mac",
  "Unknown Device",
  "API Client",
];
const REASONS = [
  "Velocity spike detected",
  "Unusual amount",
  "New device fingerprint",
  "High-risk merchant",
  "Geo-location mismatch",
  "Late-night transaction",
  "Multiple failed attempts",
  "Card-not-present",
  "Cross-border transfer",
  "Account age < 30 days",
];

const makeId = (i) => `TXN-${String(100000 + i).padStart(6, "0")}`;

const makeTx = (i, timestamp) => {
  const riskScore = Math.round((0.05 + Math.random() * 0.92) * 100) / 100;
  const riskLevel = getRiskLevel(riskScore);
  const merchant = MERCHANTS[i % MERCHANTS.length];
  const isFraud = riskScore >= 0.65;
  const isSuspicious = riskScore >= 0.4 && riskScore < 0.65;
  const fraudLabel = isFraud
    ? "FRAUD"
    : isSuspicious
      ? "SUSPICIOUS"
      : "LEGITIMATE";
  const status = isFraud
    ? Math.random() > 0.5
      ? "FLAGGED"
      : "BLOCKED"
    : isSuspicious
      ? "UNDER_REVIEW"
      : "APPROVED";

  const numReasons = isFraud ? 3 : isSuspicious ? 2 : 1;
  const pickedReasons = [...REASONS]
    .sort(() => 0.5 - Math.random())
    .slice(0, numReasons);

  return {
    id: makeId(i),
    timestamp,
    merchant,
    amount: parseFloat((20 + Math.random() * 9980).toFixed(2)),
    currency: "USD",
    status,
    fraudLabel,
    riskScore,
    riskLevel,
    reasons: pickedReasons,
    geo: GEOS[Math.floor(Math.random() * GEOS.length)],
    device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    accountId: `ACC-${String(Math.floor(10000 + Math.random() * 90000))}`,
    cardLast4: String(Math.floor(1000 + Math.random() * 9000)),
    shapFeatures: makeShapFeatures(riskScore),
    modelConfidence: Math.round((0.7 + Math.random() * 0.28) * 100),
    isNew: false,
  };
};

// Deterministic seeded-ish set so filters are stable during demo
const now = new Date();
export const MOCK_TRANSACTIONS = Array.from({ length: 60 }, (_, i) => {
  const offset =
    i < 5
      ? subMinutes(now, i * 3)
      : i < 20
        ? subHours(now, i * 0.5)
        : subDays(now, Math.floor(i / 8));
  return makeTx(i, offset);
});

// ─── Filter options ───────────────────────────────────────────────────────────
export const RISK_FILTER_OPTIONS = [
  { value: "ALL", label: "All Risk Levels" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
  { value: "SAFE", label: "Safe" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "FLAGGED", label: "Flagged" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending" },
];

export const FRAUD_FILTER_OPTIONS = [
  { value: "ALL", label: "All Labels" },
  { value: "FRAUD", label: "Fraud" },
  { value: "SUSPICIOUS", label: "Suspicious" },
  { value: "LEGITIMATE", label: "Legitimate" },
];

export const SORT_OPTIONS = [
  { value: "timestamp_desc", label: "Newest First" },
  { value: "timestamp_asc", label: "Oldest First" },
  { value: "risk_desc", label: "Highest Risk" },
  { value: "risk_asc", label: "Lowest Risk" },
  { value: "amount_desc", label: "Largest Amount" },
  { value: "amount_asc", label: "Smallest Amount" },
];

// ─── Summary counts ───────────────────────────────────────────────────────────
export const getSummary = (transactions) => ({
  total: transactions.length,
  flagged: transactions.filter(
    (t) => t.status === "FLAGGED" || t.status === "BLOCKED",
  ).length,
  underReview: transactions.filter((t) => t.status === "UNDER_REVIEW").length,
  critical: transactions.filter((t) => t.riskLevel === "CRITICAL").length,
});

// ─── Filter + sort logic ──────────────────────────────────────────────────────
export const applyFilters = (transactions, filters) => {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.merchant.name.toLowerCase().includes(q) ||
        t.accountId.toLowerCase().includes(q) ||
        t.geo.toLowerCase().includes(q),
    );
  }

  if (filters.risk && filters.risk !== "ALL") {
    result = result.filter((t) => t.riskLevel === filters.risk);
  }

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.fraudLabel && filters.fraudLabel !== "ALL") {
    result = result.filter((t) => t.fraudLabel === filters.fraudLabel);
  }

  const [sortField, sortDir] = (filters.sort || "timestamp_desc").split("_");
  result.sort((a, b) => {
    let aVal, bVal;
    if (sortField === "timestamp") {
      aVal = a.timestamp;
      bVal = b.timestamp;
    } else if (sortField === "risk") {
      aVal = a.riskScore;
      bVal = b.riskScore;
    } else if (sortField === "amount") {
      aVal = a.amount;
      bVal = b.amount;
    } else return 0;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  return result;
};
