import { formatDistanceToNow, subMinutes, subHours, subDays } from "date-fns";

// ─── Severity config ──────────────────────────────────────────────────────────
export const SEVERITY = {
  CRITICAL: {
    label: "Critical",
    level: 4,
    color: "#F43F5E",
    text: "text-rose-400",
    textStrong: "text-rose-300",
    bg: "bg-rose-500/10",
    bgStrong: "bg-rose-500/15",
    border: "border-rose-500/30",
    borderStrong: "border-rose-500/50",
    edge: "bg-rose-500",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.12)]",
    bar: "bg-rose-500",
    ring: "ring-rose-500/30",
    dot: "bg-rose-400",
  },
  HIGH: {
    label: "High",
    level: 3,
    color: "#F97316",
    text: "text-orange-400",
    textStrong: "text-orange-300",
    bg: "bg-orange-500/10",
    bgStrong: "bg-orange-500/15",
    border: "border-orange-500/30",
    borderStrong: "border-orange-500/50",
    edge: "bg-orange-500",
    glow: "shadow-[0_0_16px_rgba(249,115,22,0.10)]",
    bar: "bg-orange-500",
    ring: "ring-orange-500/30",
    dot: "bg-orange-400",
  },
  MEDIUM: {
    label: "Medium",
    level: 2,
    color: "#F59E0B",
    text: "text-amber-400",
    textStrong: "text-amber-300",
    bg: "bg-amber-500/10",
    bgStrong: "bg-amber-500/15",
    border: "border-amber-500/25",
    borderStrong: "border-amber-500/40",
    edge: "bg-amber-500",
    glow: "",
    bar: "bg-amber-500",
    ring: "ring-amber-500/30",
    dot: "bg-amber-400",
  },
  LOW: {
    label: "Low",
    level: 1,
    color: "#22D3EE",
    text: "text-cyan-400",
    textStrong: "text-cyan-300",
    bg: "bg-cyan-500/10",
    bgStrong: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    borderStrong: "border-cyan-500/35",
    edge: "bg-cyan-500",
    glow: "",
    bar: "bg-cyan-500",
    ring: "ring-cyan-500/30",
    dot: "bg-cyan-400",
  },
  INFO: {
    label: "Info",
    level: 0,
    color: "#94A3B8",
    text: "text-slate-400",
    textStrong: "text-slate-300",
    bg: "bg-slate-700/20",
    bgStrong: "bg-slate-700/30",
    border: "border-slate-700/40",
    borderStrong: "border-slate-600/50",
    edge: "bg-slate-500",
    glow: "",
    bar: "bg-slate-500",
    ring: "ring-slate-500/20",
    dot: "bg-slate-400",
  },
};

// ─── Status config ────────────────────────────────────────────────────────────
export const ALERT_STATUS = {
  ACTIVE: {
    label: "Active",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
  },
  REVIEWING: {
    label: "Reviewing",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
  },
  RESOLVED: {
    label: "Resolved",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
  },
  DISMISSED: {
    label: "Dismissed",
    text: "text-slate-400",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
  },
  ESCALATED: {
    label: "Escalated",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
  },
};

// ─── Alert type titles ────────────────────────────────────────────────────────
const ALERT_TYPES = [
  {
    title: "Rapid Transaction Velocity",
    summary:
      "Abnormal frequency of transactions detected within a short window.",
  },
  {
    title: "Card-Not-Present Fraud Pattern",
    summary:
      "High-risk CNP transaction flagged by velocity and device mismatch.",
  },
  {
    title: "Cross-Border Transfer Anomaly",
    summary:
      "Unusual international transfer pattern detected outside user history.",
  },
  {
    title: "Account Takeover Indicator",
    summary:
      "Device fingerprint and login pattern suggest credential compromise.",
  },
  {
    title: "High-Value Single Transaction",
    summary: "Transaction amount significantly deviates from account baseline.",
  },
  {
    title: "Multiple Failed Auth Attempts",
    summary:
      "Repeated authentication failures detected before successful login.",
  },
  {
    title: "Merchant Risk Cluster",
    summary:
      "Multiple transactions to high-risk merchant category in 24 hours.",
  },
  {
    title: "Geo-Location Impossible Travel",
    summary: "Transactions from two geographically incompatible locations.",
  },
  {
    title: "New Device First Transaction",
    summary:
      "First transaction from unrecognized device on high-value merchant.",
  },
  {
    title: "Chargebacks Risk Threshold",
    summary: "Chargeback rate for merchant exceeded acceptable risk threshold.",
  },
  {
    title: "Synthetic Identity Signal",
    summary: "Account profile matches synthetic identity fraud pattern.",
  },
  {
    title: "Dormant Account Reactivation",
    summary: "Inactive account suddenly initiated high-value activity.",
  },
];

const REASON_POOL = [
  "Velocity spike",
  "Geo mismatch",
  "Device anomaly",
  "Amount deviation",
  "New device",
  "High-risk merchant",
  "Late night",
  "Cross-border",
  "Failed auths",
  "Card-not-present",
  "Chargeback risk",
  "Account age",
];

const ENTITIES = [
  { type: "Merchant", value: "Coinbase Exchange" },
  { type: "Merchant", value: "Binance Global" },
  { type: "Merchant", value: "FTX Trading" },
  { type: "User", value: "USR-00423" },
  { type: "User", value: "USR-09812" },
  { type: "Account", value: "ACC-55671" },
  { type: "Device", value: "Unknown Device" },
  { type: "IP", value: "185.220.xxx.xxx" },
];

const GEOS = [
  "Lagos, NG",
  "Unknown",
  "Moscow, RU",
  "Kyiv, UA",
  "São Paulo, BR",
  "New York, US",
  "London, UK",
];

// ─── Mock alert factory ───────────────────────────────────────────────────────
const SEVERITY_KEYS = [
  "CRITICAL",
  "CRITICAL",
  "HIGH",
  "HIGH",
  "MEDIUM",
  "MEDIUM",
  "LOW",
  "INFO",
];
const STATUS_KEYS = [
  "ACTIVE",
  "ACTIVE",
  "REVIEWING",
  "ESCALATED",
  "RESOLVED",
  "DISMISSED",
];

const makeAlert = (i, timestamp) => {
  const severityKey = SEVERITY_KEYS[i % SEVERITY_KEYS.length];
  const statusKey = STATUS_KEYS[i % STATUS_KEYS.length];
  const type = ALERT_TYPES[i % ALERT_TYPES.length];
  const entity = ENTITIES[i % ENTITIES.length];
  const numReasons =
    severityKey === "CRITICAL" ? 4 : severityKey === "HIGH" ? 3 : 2;
  const reasons = [...REASON_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, numReasons);
  const riskScore =
    severityKey === "CRITICAL"
      ? 88 + (i % 10)
      : severityKey === "HIGH"
        ? 68 + (i % 15)
        : severityKey === "MEDIUM"
          ? 42 + (i % 20)
          : severityKey === "LOW"
            ? 22 + (i % 15)
            : 8 + (i % 12);

  return {
    id: `ALT-${String(200000 + i).padStart(6, "0")}`,
    timestamp,
    severity: severityKey,
    status: statusKey,
    title: type.title,
    summary: type.summary,
    riskScore: Math.min(riskScore, 99),
    reasons,
    entity,
    geo: GEOS[i % GEOS.length],
    txnId: `TXN-${String(100000 + i * 3).padStart(6, "0")}`,
    assignedTo: statusKey === "REVIEWING" ? "analyst@fraudeye.com" : null,
    resolvedAt:
      statusKey === "RESOLVED"
        ? new Date(timestamp.getTime() + 1000 * 60 * 30)
        : null,
    isNew: false,
  };
};

// ─── Build dataset ────────────────────────────────────────────────────────────
const now = new Date();
export const MOCK_ALERTS = Array.from({ length: 48 }, (_, i) => {
  const ts =
    i < 3
      ? subMinutes(now, i * 4)
      : i < 12
        ? subHours(now, i * 0.7)
        : subDays(now, Math.floor(i / 10));
  return makeAlert(i, ts);
});

// ─── Summary helpers ──────────────────────────────────────────────────────────
export const getAlertSummary = (alerts) => ({
  total: alerts.length,
  critical: alerts.filter((a) => a.severity === "CRITICAL").length,
  active: alerts.filter(
    (a) => a.status === "ACTIVE" || a.status === "ESCALATED",
  ).length,
  reviewing: alerts.filter((a) => a.status === "REVIEWING").length,
  resolved: alerts.filter((a) => a.status === "RESOLVED").length,
});

export const formatAlertTime = (date) =>
  formatDistanceToNow(date, { addSuffix: true });

// ─── Filter options ───────────────────────────────────────────────────────────
export const SEVERITY_FILTER_OPTIONS = [
  { value: "ALL", label: "All Severities" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
  { value: "INFO", label: "Info" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "ESCALATED", label: "Escalated" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "DISMISSED", label: "Dismissed" },
];

export const SORT_OPTIONS = [
  { value: "time_desc", label: "Newest First" },
  { value: "time_asc", label: "Oldest First" },
  { value: "severity_desc", label: "Highest Severity" },
  { value: "severity_asc", label: "Lowest Severity" },
  { value: "risk_desc", label: "Highest Risk" },
  { value: "risk_asc", label: "Lowest Risk" },
];

// ─── Filter + sort logic ──────────────────────────────────────────────────────
export const applyAlertFilters = (alerts, filters) => {
  let result = [...alerts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.entity.value.toLowerCase().includes(q) ||
        a.txnId.toLowerCase().includes(q),
    );
  }

  if (filters.severity && filters.severity !== "ALL") {
    result = result.filter((a) => a.severity === filters.severity);
  }

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((a) => a.status === filters.status);
  }

  const [sortField, sortDir] = (filters.sort || "time_desc").split("_");
  result.sort((a, b) => {
    let aVal, bVal;
    if (sortField === "time") {
      aVal = a.timestamp;
      bVal = b.timestamp;
    } else if (sortField === "severity") {
      aVal = SEVERITY[a.severity]?.level ?? 0;
      bVal = SEVERITY[b.severity]?.level ?? 0;
    } else if (sortField === "risk") {
      aVal = a.riskScore;
      bVal = b.riskScore;
    } else return 0;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  return result;
};
