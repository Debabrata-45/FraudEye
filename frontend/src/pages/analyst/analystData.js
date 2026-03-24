/**
 * analystData.js — Mock cases + actions for Analyst Review page
 * Exports: MOCK_CASES, ACTIONS
 * Shape matches useAnalystData.js normalizeCase output exactly
 */

/* ── Action definitions ──────────────────────────────────── */
export const ACTIONS = {
  CONFIRM_FRAUD: {
    key: "CONFIRM_FRAUD",
    label: "Confirm Fraud",
    variant: "danger",
    verb: "Block",
  },
  CLEAR_LEGITIMATE: {
    key: "CLEAR_LEGITIMATE",
    label: "Clear as Legitimate",
    variant: "success",
    verb: "Approve",
  },
  ESCALATE: {
    key: "ESCALATE",
    label: "Escalate to Senior",
    variant: "warning",
    verb: "Escalate",
  },
  REQUEST_INFO: {
    key: "REQUEST_INFO",
    label: "Request More Info",
    variant: "ghost",
    verb: "Request",
  },
};

/* ── Mock case factory ───────────────────────────────────── */
const now = new Date();

const makeCase = (
  id,
  severity,
  status,
  score,
  merchant,
  amount,
  userId,
  hoursAgo,
) => ({
  id: String(id),
  transactionId: String(id),
  title: `Transaction #TXN-${String(id).padStart(6, "0")}`,
  severity,
  score,
  status,
  merchant,
  amount,
  currency: "USD",
  occurredAt: new Date(now.getTime() - hoursAgo * 3600000).toISOString(),
  userId,
  deviceId: null,
  ipAddress: null,
  shapFeatures: [],
  feedbackNote: "",
  feedbackVerdict: null,
  _raw: {},
});

export const MOCK_CASES = [
  makeCase(
    1,
    "critical",
    "pending",
    0.97,
    "CryptoFast Exchange",
    9840.0,
    1,
    0.5,
  ),
  makeCase(
    2,
    "critical",
    "reviewing",
    0.91,
    "QuickCash ATM Co.",
    4200.0,
    2,
    1.2,
  ),
  makeCase(3, "high", "pending", 0.84, "GlobalBet Gaming", 1580.5, 3, 2.8),
  makeCase(4, "high", "escalated", 0.78, "NightShift Retail", 890.0, 4, 4.0),
  makeCase(5, "high", "pending", 0.73, "VeloTransfer LLC", 3120.75, 5, 5.5),
  makeCase(6, "medium", "reviewing", 0.58, "Stripe Payments", 450.0, 6, 7.0),
  makeCase(7, "medium", "pending", 0.52, "Revolut Ltd", 2200.0, 7, 9.0),
  makeCase(8, "medium", "reviewing", 0.44, "Binance Global", 999.0, 8, 12.0),
];
/* ── Append these exports to the END of analystData.js ── */

export const PRIORITY = {
  CRITICAL: { label: "Critical", color: "#F43F5E", order: 0 },
  HIGH: { label: "High", color: "#F43F5E", order: 1 },
  MEDIUM: { label: "Medium", color: "#F59E0B", order: 2 },
  LOW: { label: "Low", color: "#22D3EE", order: 3 },
};

export const REVIEW_STATUS = {
  pending: {
    label: "Pending",
    color: "#F59E0B",
    bg: "bg-[#F59E0B14]",
    border: "border-[#F59E0B33]",
  },
  reviewing: {
    label: "Reviewing",
    color: "#22D3EE",
    bg: "bg-[#22D3EE14]",
    border: "border-[#22D3EE33]",
  },
  confirmed: {
    label: "Confirmed",
    color: "#F43F5E",
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
  },
  cleared: {
    label: "Cleared",
    color: "#22C55E",
    bg: "bg-[#22C55E14]",
    border: "border-[#22C55E33]",
  },
  escalated: {
    label: "Escalated",
    color: "#8B5CF6",
    bg: "bg-[#8B5CF614]",
    border: "border-[#8B5CF633]",
  },
};

export const DRIVER_COLOR = {
  geo_anomaly_km: "#F43F5E",
  geo_impossible: "#F43F5E",
  unusual_hour: "#F59E0B",
  new_device: "#8B5CF6",
  device_inconsistency: "#8B5CF6",
  txn_velocity_5m: "#F43F5E",
  txn_velocity_1h: "#F59E0B",
  merchant_risk_level: "#F59E0B",
  spending_deviation_from_user_avg: "#22D3EE",
  amount: "#22D3EE",
};

export function formatAmount(amount, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}

export function formatTime(ts) {
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch {
    return "—";
  }
}
