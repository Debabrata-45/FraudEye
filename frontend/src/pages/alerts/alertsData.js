/**
 * alertsData.js — Mock alerts + filter helpers for Alerts page
 * Exports: MOCK_ALERTS, getAlertSummary, applyAlertFilters
 * Shape matches useAlertsData.js normalizeAlert output exactly
 */
import { subHours } from "date-fns";

const now = new Date();

const makeAlert = (
  id,
  severity,
  status,
  score,
  merchant,
  amount,
  reasons,
  hoursAgo,
  verdict = null,
) => ({
  id: `ALT-${String(id).padStart(6, "0")}`,
  txnId: `TXN-${String(id).padStart(6, "0")}`,
  severity,
  score,
  title: buildTitle(severity),
  description: reasons.join(" · "),
  merchant,
  amount,
  currency: "USD",
  reasons,
  status,
  verdict,
  notes: "",
  ts: new Date(now.getTime() - hoursAgo * 3600000).toISOString(),
  topFactors: [],
  isNew: hoursAgo < 0.1,
  _raw: {},
});

function buildTitle(severity) {
  const titles = {
    critical: "Critical fraud signal detected",
    high: "High-risk transaction flagged",
    medium: "Suspicious transaction under review",
    low: "Low-risk informational flag",
  };
  return titles[severity] ?? "Transaction flagged";
}

export const MOCK_ALERTS = [
  makeAlert(
    1,
    "critical",
    "active",
    0.97,
    "CryptoFast Exchange",
    9840.0,
    ["velocity", "device", "geo"],
    0.08,
  ),
  makeAlert(
    2,
    "critical",
    "active",
    0.91,
    "QuickCash ATM Co.",
    4200.0,
    ["geo", "device"],
    0.3,
  ),
  makeAlert(
    3,
    "high",
    "active",
    0.84,
    "GlobalBet Gaming",
    1580.5,
    ["velocity", "merchant"],
    0.8,
  ),
  makeAlert(
    4,
    "high",
    "active",
    0.78,
    "NightShift Retail",
    890.0,
    ["hour", "device"],
    1.5,
  ),
  makeAlert(
    5,
    "high",
    "resolved",
    0.73,
    "VeloTransfer LLC",
    3120.75,
    ["velocity", "amount"],
    2.0,
    "FRAUD",
  ),
  makeAlert(
    6,
    "medium",
    "active",
    0.58,
    "Stripe Payments",
    450.0,
    ["amount", "hour"],
    3.0,
  ),
  makeAlert(
    7,
    "medium",
    "active",
    0.52,
    "Revolut Ltd",
    2200.0,
    ["device", "merchant"],
    4.5,
  ),
  makeAlert(
    8,
    "medium",
    "dismissed",
    0.44,
    "Binance Global",
    999.0,
    ["merchant"],
    6.0,
    "SAFE",
  ),
  makeAlert(
    9,
    "medium",
    "active",
    0.41,
    "Coinbase Exchange",
    1750.0,
    ["geo", "amount"],
    8.0,
  ),
  makeAlert(
    10,
    "low",
    "resolved",
    0.22,
    "Amazon Web Services",
    2299.0,
    ["hour"],
    12.0,
    "SAFE",
  ),
  makeAlert(
    11,
    "low",
    "dismissed",
    0.18,
    "Netflix Inc",
    15.99,
    ["amount"],
    18.0,
    "SAFE",
  ),
  makeAlert(
    12,
    "high",
    "active",
    0.76,
    "FTX Trading",
    5792.78,
    ["velocity", "geo", "merchant"],
    24.0,
  ),
];

/* ── Summary helper ──────────────────────────────────────── */
export function getAlertSummary(alerts) {
  return {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    high: alerts.filter((a) => a.severity === "high").length,
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };
}

/* ── Filter + sort logic ─────────────────────────────────── */
export function applyAlertFilters(alerts, filters) {
  let result = [...alerts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.merchant.toLowerCase().includes(q) ||
        a.txnId.toLowerCase().includes(q),
    );
  }

  if (filters.severity && filters.severity !== "ALL") {
    result = result.filter(
      (a) => a.severity === filters.severity.toLowerCase(),
    );
  }

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((a) => a.status === filters.status.toLowerCase());
  }

  const sort = filters.sort ?? "severity_desc";
  result.sort((a, b) => {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (sort === "severity_desc")
      return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4);
    if (sort === "severity_asc")
      return (sevOrder[b.severity] ?? 4) - (sevOrder[a.severity] ?? 4);
    if (sort === "time_desc") return new Date(b.ts) - new Date(a.ts);
    if (sort === "time_asc") return new Date(a.ts) - new Date(b.ts);
    if (sort === "risk_desc") return b.score - a.score;
    if (sort === "risk_asc") return a.score - b.score;
    return 0;
  });

  return result;
}

/* ── Filter option constants (used by AlertsControls) ───── */
export const SEVERITY = {
  critical: { label: "Critical", color: "#F43F5E" },
  high: { label: "High", color: "#F43F5E" },
  medium: { label: "Medium", color: "#F59E0B" },
  low: { label: "Low", color: "#22D3EE" },
};

export const ALERT_STATUS = {
  active: { label: "Active" },
  resolved: { label: "Resolved" },
  dismissed: { label: "Dismissed" },
};

export const SEVERITY_FILTER_OPTIONS = [
  { value: "ALL", label: "All Severities" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "DISMISSED", label: "Dismissed" },
];

export const SORT_OPTIONS = [
  { value: "severity_desc", label: "Severity (High → Low)" },
  { value: "severity_asc", label: "Severity (Low → High)" },
  { value: "time_desc", label: "Newest First" },
  { value: "time_asc", label: "Oldest First" },
  { value: "risk_desc", label: "Risk Score (High → Low)" },
];
export function formatAlertTime(ts) {
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
