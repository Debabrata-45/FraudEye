import { subMinutes, subHours, subDays } from "date-fns";

// ─── Event type config ────────────────────────────────────────────────────────
export const EVENT_TYPES = {
  FRAUD_CONFIRMED: {
    label: "Fraud Confirmed",
    icon: "🚫",
    category: "Decision",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
  },
  CASE_CLEARED: {
    label: "Case Cleared",
    icon: "✅",
    category: "Decision",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  CASE_ESCALATED: {
    label: "Case Escalated",
    icon: "⚠️",
    category: "Decision",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    dot: "bg-violet-500",
  },
  REVIEW_STARTED: {
    label: "Review Started",
    icon: "👁️",
    category: "Review",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    dot: "bg-cyan-500",
  },
  NOTE_ADDED: {
    label: "Note Added",
    icon: "📝",
    category: "Review",
    color: "text-slate-300",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
    dot: "bg-slate-500",
  },
  ALERT_TRIGGERED: {
    label: "Alert Triggered",
    icon: "🔔",
    category: "System",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
  },
  MODEL_SCORED: {
    label: "Model Scored",
    icon: "🤖",
    category: "System",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    dot: "bg-violet-400",
  },
  USER_LOGIN: {
    label: "User Login",
    icon: "🔑",
    category: "Auth",
    color: "text-slate-400",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
    dot: "bg-slate-500",
  },
  USER_LOGOUT: {
    label: "User Logout",
    icon: "🔒",
    category: "Auth",
    color: "text-slate-400",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
    dot: "bg-slate-500",
  },
  THRESHOLD_CHANGED: {
    label: "Threshold Changed",
    icon: "⚙️",
    category: "Config",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
  },
  EXPORT_TRIGGERED: {
    label: "Export Triggered",
    icon: "📤",
    category: "System",
    color: "text-slate-300",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
    dot: "bg-slate-500",
  },
  FLAG_USER: {
    label: "User Flagged",
    icon: "🏴",
    category: "Decision",
    color: "text-rose-300",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
};

export const EVENT_CATEGORIES = [
  "All",
  "Decision",
  "Review",
  "System",
  "Auth",
  "Config",
];

// ─── Actor config ─────────────────────────────────────────────────────────────
export const ACTOR_CONFIG = {
  analyst: {
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  admin: {
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  system: {
    color: "text-slate-400",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
  },
};

// ─── Result config ────────────────────────────────────────────────────────────
export const RESULT_CONFIG = {
  SUCCESS: {
    label: "Success",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  FAILURE: {
    label: "Failure",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
  },
  INFO: {
    label: "Info",
    text: "text-slate-400",
    bg: "bg-slate-700/20",
    border: "border-slate-600/30",
  },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const ACTORS = [
  { name: "analyst@fraudeye.com", role: "analyst" },
  { name: "senior.analyst@fraudeye.com", role: "analyst" },
  { name: "admin@fraudeye.com", role: "admin" },
  { name: "system", role: "system" },
];

const EVENT_KEYS = Object.keys(EVENT_TYPES);

const DETAILS_MAP = {
  FRAUD_CONFIRMED: (id) =>
    `Analyst confirmed transaction ${id} as fraudulent. Account flagged for review.`,
  CASE_CLEARED: (id) =>
    `Case ${id} cleared as legitimate after manual review. Flags removed.`,
  CASE_ESCALATED: (id) =>
    `Case ${id} escalated to senior analyst for secondary review.`,
  REVIEW_STARTED: (id) =>
    `Review initiated for case ${id}. Assigned to current analyst.`,
  NOTE_ADDED: (id) =>
    `Review note appended to case ${id}. Documented reasoning for triage decision.`,
  ALERT_TRIGGERED: (id) =>
    `System triggered alert for transaction ${id} based on XGBoost risk threshold.`,
  MODEL_SCORED: (id) =>
    `XGBoost model scored transaction ${id}. SHAP explanation generated.`,
  USER_LOGIN: () =>
    `Successful authentication. Session initiated with standard analyst permissions.`,
  USER_LOGOUT: () => `Session terminated. All active review locks released.`,
  THRESHOLD_CHANGED: () =>
    `Fraud score threshold updated from 0.72 to 0.68 by admin. Effective immediately.`,
  EXPORT_TRIGGERED: () =>
    `Transaction log export triggered. CSV generated for date range.`,
  FLAG_USER: (id) =>
    `User account ${id} flagged for suspicious activity pattern.`,
};

const BEFORE_AFTER = {
  FRAUD_CONFIRMED: {
    before: "Status: UNDER_REVIEW",
    after: "Status: FRAUD_CONFIRMED",
  },
  CASE_CLEARED: { before: "Status: PENDING", after: "Status: CLEARED" },
  CASE_ESCALATED: {
    before: "Assigned: analyst",
    after: "Assigned: senior.analyst",
  },
  THRESHOLD_CHANGED: { before: "Threshold: 0.72", after: "Threshold: 0.68" },
  REVIEW_STARTED: { before: "Status: PENDING", after: "Status: IN_REVIEW" },
  FLAG_USER: { before: "Account: ACTIVE", after: "Account: FLAGGED" },
};

const makeLog = (i, timestamp) => {
  const eventKey = EVENT_KEYS[i % EVENT_KEYS.length];
  const actor = ACTORS[i % ACTORS.length];
  const entityId = `TXN-${String(100000 + i * 13).padStart(6, "0")}`;
  const caseId = `CAS-${String(400000 + i * 7).padStart(6, "0")}`;
  const eventCfg = EVENT_TYPES[eventKey];

  const isDecision = eventCfg.category === "Decision";
  const isSystem = actor.role === "system";
  const result = isSystem
    ? "INFO"
    : isDecision
      ? i % 7 === 0
        ? "FAILURE"
        : "SUCCESS"
      : "SUCCESS";

  return {
    id: `LOG-${String(500000 + i).padStart(6, "0")}`,
    timestamp,
    eventType: eventKey,
    actor,
    entityId,
    caseId,
    result,
    detail: (DETAILS_MAP[eventKey] || (() => "System event recorded."))(
      entityId,
    ),
    beforeAfter: BEFORE_AFTER[eventKey] || null,
    ipAddress:
      actor.role === "system" ? "internal" : `10.0.${i % 4}.${(i * 7) % 254}`,
    sessionId: `SES-${String(800000 + i * 3).padStart(6, "0")}`,
    isNew: i < 3,
  };
};

const now = new Date();
export const MOCK_LOGS = Array.from({ length: 60 }, (_, i) => {
  const ts =
    i < 5
      ? subMinutes(now, i * 3)
      : i < 20
        ? subHours(now, i * 0.6)
        : subDays(now, Math.floor(i / 10));
  return makeLog(i, ts);
});

// ─── Summary ──────────────────────────────────────────────────────────────────
export const getAuditSummary = (logs) => ({
  total: logs.length,
  analyst: logs.filter((l) => l.actor.role === "analyst").length,
  system: logs.filter((l) => l.actor.role === "system").length,
  decisions: logs.filter(
    (l) => EVENT_TYPES[l.eventType]?.category === "Decision",
  ).length,
  failures: logs.filter((l) => l.result === "FAILURE").length,
});

// ─── Filter options ───────────────────────────────────────────────────────────
export const ACTOR_FILTER_OPTIONS = [
  { value: "ALL", label: "All Actors" },
  { value: "analyst", label: "Analyst" },
  { value: "admin", label: "Admin" },
  { value: "system", label: "System" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { value: "ALL", label: "All Categories" },
  { value: "Decision", label: "Decisions" },
  { value: "Review", label: "Review" },
  { value: "System", label: "System" },
  { value: "Auth", label: "Auth" },
  { value: "Config", label: "Config" },
];

export const SORT_OPTIONS = [
  { value: "time_desc", label: "Newest First" },
  { value: "time_asc", label: "Oldest First" },
];

// ─── Filter + sort ────────────────────────────────────────────────────────────
export const applyAuditFilters = (logs, filters) => {
  let result = [...logs];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.id.toLowerCase().includes(q) ||
        l.actor.name.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q) ||
        l.caseId.toLowerCase().includes(q) ||
        EVENT_TYPES[l.eventType]?.label.toLowerCase().includes(q),
    );
  }

  if (filters.actor && filters.actor !== "ALL") {
    result = result.filter((l) => l.actor.role === filters.actor);
  }

  if (filters.category && filters.category !== "ALL") {
    result = result.filter(
      (l) => EVENT_TYPES[l.eventType]?.category === filters.category,
    );
  }

  const [, dir] = (filters.sort || "time_desc").split("_");
  result.sort((a, b) =>
    dir === "desc" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp,
  );

  return result;
};

// ─── Formatters ───────────────────────────────────────────────────────────────
export const formatExactTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
