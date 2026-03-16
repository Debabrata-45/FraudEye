import { subMinutes, subHours, subDays } from "date-fns";

// ─── Review status config ─────────────────────────────────────────────────────
export const REVIEW_STATUS = {
  PENDING: {
    label: "Pending",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    dot: "bg-amber-400",
  },
  IN_REVIEW: {
    label: "In Review",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    dot: "bg-cyan-400",
  },
  ESCALATED: {
    label: "Escalated",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    dot: "bg-violet-400",
  },
  RESOLVED: {
    label: "Resolved",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  CONFIRMED: {
    label: "Fraud Conf.",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    dot: "bg-rose-400",
  },
  CLEARED: {
    label: "Cleared",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-300",
  },
};

// ─── Priority config ──────────────────────────────────────────────────────────
export const PRIORITY = {
  CRITICAL: {
    label: "Critical",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    edge: "bg-rose-500",
    color: "#F43F5E",
  },
  HIGH: {
    label: "High",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    edge: "bg-orange-500",
    color: "#F97316",
  },
  MEDIUM: {
    label: "Medium",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    edge: "bg-amber-500",
    color: "#F59E0B",
  },
  LOW: {
    label: "Low",
    text: "text-slate-400",
    bg: "bg-slate-700/20",
    border: "border-slate-700/40",
    edge: "bg-slate-600",
    color: "#94A3B8",
  },
};

// ─── Action definitions ───────────────────────────────────────────────────────
export const ACTIONS = {
  CONFIRM_FRAUD: {
    label: "Confirm Fraud",
    desc: "Mark this transaction as confirmed fraud and flag the account.",
    style:
      "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50",
    confirmStyle: "bg-rose-500 hover:bg-rose-600 text-white",
    icon: "🚫",
    destructive: true,
  },
  CLEAR_LEGITIMATE: {
    label: "Clear as Legitimate",
    desc: "Mark this transaction as legitimate and remove any active flags.",
    style:
      "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/40",
    confirmStyle: "bg-emerald-500 hover:bg-emerald-600 text-white",
    icon: "✅",
    destructive: false,
  },
  ESCALATE: {
    label: "Escalate Case",
    desc: "Route to senior analyst or fraud team for further investigation.",
    style:
      "bg-violet-500/10 border-violet-500/25 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/40",
    confirmStyle: "bg-violet-500 hover:bg-violet-600 text-white",
    icon: "⚠️",
    destructive: false,
  },
  REQUEST_INFO: {
    label: "Request More Info",
    desc: "Place case on hold and request additional data from operations.",
    style:
      "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/35",
    confirmStyle: "bg-cyan-500 hover:bg-cyan-600 text-white",
    icon: "🔍",
    destructive: false,
  },
};

// ─── Mock driver chips ────────────────────────────────────────────────────────
const DRIVER_SETS = [
  ["Velocity Spike", "Geo Mismatch", "New Device"],
  ["Unusual Amount", "High-Risk Merchant", "Card Not Present"],
  ["Failed Auth History", "Cross-Border", "Device Anomaly"],
  ["Late Night Activity", "Account Age Risk", "Chargeback Pattern"],
];

const DRIVER_SEVERITY = {
  "Velocity Spike": "critical",
  "Geo Mismatch": "high",
  "New Device": "medium",
  "Unusual Amount": "high",
  "High-Risk Merchant": "high",
  "Card Not Present": "medium",
  "Failed Auth History": "critical",
  "Cross-Border": "high",
  "Device Anomaly": "medium",
  "Late Night Activity": "medium",
  "Account Age Risk": "low",
  "Chargeback Pattern": "high",
};

export const DRIVER_COLOR = {
  critical: {
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    text: "text-rose-300",
  },
  high: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    text: "text-orange-300",
  },
  medium: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-300",
  },
  low: {
    bg: "bg-slate-700/30",
    border: "border-slate-600/30",
    text: "text-slate-400",
  },
};

// ─── SHAP preview ─────────────────────────────────────────────────────────────
const SHAP_PREVIEW = [
  { feature: "Transaction Velocity", value: 0.31, fraud: true },
  { feature: "Amount Deviation", value: 0.27, fraud: true },
  { feature: "Geo-Location Anomaly", value: 0.22, fraud: true },
  { feature: "Device Fingerprint", value: 0.18, fraud: false },
  { feature: "Merchant Risk", value: 0.14, fraud: true },
];

// ─── Merchants ────────────────────────────────────────────────────────────────
const MERCHANTS = [
  { name: "Coinbase Exchange", category: "Crypto", icon: "₿" },
  { name: "Binance Global", category: "Crypto", icon: "🔶" },
  { name: "Wise Transfers", category: "Remittance", icon: "🌍" },
  { name: "FTX Trading", category: "Crypto", icon: "📈" },
  { name: "Shopify Merchants", category: "E-Commerce", icon: "🛒" },
  { name: "Revolut Ltd", category: "Neobank", icon: "🔷" },
];

const ANALYSTS = [
  "analyst@fraudeye.com",
  "senior.analyst@fraudeye.com",
  "admin@fraudeye.com",
];
const GEOS = [
  "Lagos, NG",
  "Unknown",
  "São Paulo, BR",
  "Moscow, RU",
  "Singapore, SG",
];
const DEVICES = [
  "Unknown Device",
  "iOS 17.4",
  "Android 14",
  "Chrome/Win",
  "API Client",
];

const PRIORITY_KEYS = ["CRITICAL", "CRITICAL", "HIGH", "HIGH", "MEDIUM", "LOW"];
const REVIEW_STATUS_KEYS = [
  "PENDING",
  "PENDING",
  "IN_REVIEW",
  "ESCALATED",
  "RESOLVED",
  "CONFIRMED",
];

const NARRATIVES = [
  "Critical confidence fraud pattern detected. Velocity spike combined with impossible geo-travel and unrecognized device strongly indicates account takeover.",
  "High-risk signals flagged. Elevated transaction velocity and unusual amount deviation pushed this case above the fraud threshold.",
  "Borderline case. New device fingerprint and slightly abnormal timing warrant analyst review before final decision.",
  "Suspicious cross-border transfer to a high-risk crypto exchange outside account history. Requires manual verification.",
];

const makeCase = (i, timestamp) => {
  const priorityKey = PRIORITY_KEYS[i % PRIORITY_KEYS.length];
  const statusKey = REVIEW_STATUS_KEYS[i % REVIEW_STATUS_KEYS.length];
  const merchant = MERCHANTS[i % MERCHANTS.length];
  const riskScore =
    priorityKey === "CRITICAL"
      ? 88 + (i % 10)
      : priorityKey === "HIGH"
        ? 68 + (i % 15)
        : priorityKey === "MEDIUM"
          ? 44 + (i % 18)
          : 22 + (i % 15);

  const isFraud = riskScore >= 65;
  const isSuspicious = riskScore >= 40 && riskScore < 65;
  const fraudLabel = isFraud
    ? "FRAUD"
    : isSuspicious
      ? "SUSPICIOUS"
      : "LEGITIMATE";

  const drivers = DRIVER_SETS[i % DRIVER_SETS.length].map((d) => ({
    label: d,
    severity: DRIVER_SEVERITY[d] || "medium",
  }));

  const notes =
    statusKey === "IN_REVIEW" || statusKey === "RESOLVED"
      ? [
          {
            author: ANALYSTS[i % ANALYSTS.length],
            text: "Initial triage complete. Flagged for secondary review due to geo anomaly.",
            timestamp: new Date(timestamp.getTime() + 1000 * 60 * 5),
          },
        ]
      : [];

  return {
    id: `CAS-${String(400000 + i).padStart(6, "0")}`,
    txnId: `TXN-${String(100000 + i * 11).padStart(6, "0")}`,
    alertId: `ALT-${String(200000 + i * 3).padStart(6, "0")}`,
    timestamp,
    priority: priorityKey,
    reviewStatus: statusKey,
    fraudLabel,
    riskScore: Math.min(riskScore, 99),
    merchant,
    amount: parseFloat((80 + ((i * 423.7) % 9500)).toFixed(2)),
    currency: "USD",
    geo: GEOS[i % GEOS.length],
    device: DEVICES[i % DEVICES.length],
    accountId: `ACC-${String(10000 + i * 17)}`,
    assignedTo:
      statusKey === "IN_REVIEW" ? ANALYSTS[i % ANALYSTS.length] : null,
    narrative: NARRATIVES[i % NARRATIVES.length],
    drivers,
    shapPreview: SHAP_PREVIEW,
    modelConf: Math.round((0.74 + (i % 4) * 0.06) * 100),
    notes,
  };
};

// ─── Build dataset ────────────────────────────────────────────────────────────
const now = new Date();
export const MOCK_CASES = Array.from({ length: 20 }, (_, i) => {
  const ts =
    i < 4
      ? subMinutes(now, i * 6)
      : i < 10
        ? subHours(now, i * 0.8)
        : subDays(now, Math.floor(i / 5));
  return makeCase(i, ts);
});

// ─── Summary ──────────────────────────────────────────────────────────────────
export const getQueueSummary = (cases) => ({
  total: cases.length,
  pending: cases.filter((c) => c.reviewStatus === "PENDING").length,
  inReview: cases.filter((c) => c.reviewStatus === "IN_REVIEW").length,
  escalated: cases.filter((c) => c.reviewStatus === "ESCALATED").length,
  resolved: cases.filter(
    (c) =>
      c.reviewStatus === "RESOLVED" ||
      c.reviewStatus === "CONFIRMED" ||
      c.reviewStatus === "CLEARED",
  ).length,
  critical: cases.filter((c) => c.priority === "CRITICAL").length,
});

// ─── Formatters ───────────────────────────────────────────────────────────────
export const formatAmount = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );

export const formatTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
