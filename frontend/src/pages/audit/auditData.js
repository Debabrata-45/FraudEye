/**
 * auditData.js — Mock audit logs for AuditLogs page
 * Used as fallback when real /api/audit-logs returns no data
 * Shape matches useAuditData normalizeLog output exactly
 */
import { subMinutes, subHours, subDays } from "date-fns";

const now = new Date();

const makeLog = (
  id,
  actionType,
  actorEmail,
  actorRole,
  category,
  entityType,
  entityId,
  meta,
  minutesAgo,
  result = "SUCCESS",
) => ({
  id: String(id),
  actionType,
  actorId: id,
  actorEmail,
  actorRole,
  entityType,
  entityId,
  result,
  category,
  meta,
  before: meta.oldRiskScore != null ? { risk_score: meta.oldRiskScore } : null,
  after: meta.newRiskScore != null ? { risk_score: meta.newRiskScore } : null,
  ts: new Date(now.getTime() - minutesAgo * 60000).toISOString(),
  isNew: minutesAgo < 2,
  _raw: {},
});

export const MOCK_LOGS = [
  makeLog(
    1,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000038",
    {
      transactionId: "TXN-000038",
      verdict: "FRAUD",
      notes: "Confirmed fraud pattern",
    },
    5,
  ),
  makeLog(
    2,
    "merchant_risk_updated",
    "analyst@fraudeye.com",
    "analyst",
    "Config",
    "merchant",
    "merch_001",
    { merchantId: "merch_001", newRiskScore: 40, fraudCount: 3 },
    8,
  ),
  makeLog(
    3,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000031",
    {
      transactionId: "TXN-000031",
      verdict: "FRAUD",
      notes: "High amount unusual hour",
    },
    15,
  ),
  makeLog(
    4,
    "user_flagged",
    "admin@fraudeye.com",
    "admin",
    "Alert",
    "user",
    "USR-00002",
    { userId: "USR-00002", reason: "Multiple fraud attempts" },
    22,
  ),
  makeLog(
    5,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000027",
    { transactionId: "TXN-000027", verdict: "FRAUD", notes: null },
    35,
  ),
  makeLog(
    6,
    "merchant_flagged",
    "admin@fraudeye.com",
    "admin",
    "Alert",
    "merchant",
    "merch_001",
    { merchantId: "merch_001", reason: "Repeated fraud association" },
    55,
  ),
  makeLog(
    7,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000026",
    { transactionId: "TXN-000026", verdict: "SAFE", notes: "Known merchant" },
    70,
  ),
  makeLog(
    8,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000030",
    {
      transactionId: "TXN-000030",
      verdict: "FRAUD",
      notes: "Suspicious geo and device",
    },
    90,
  ),
  makeLog(
    9,
    "merchant_risk_updated",
    "analyst@fraudeye.com",
    "analyst",
    "Config",
    "merchant",
    "merch_001",
    {
      merchantId: "merch_001",
      newRiskScore: 30,
      oldRiskScore: 20,
      fraudCount: 2,
    },
    110,
  ),
  makeLog(
    10,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000024",
    {
      transactionId: "TXN-000024",
      verdict: "FRAUD",
      notes: "Suspicious device",
    },
    130,
  ),
  makeLog(
    11,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000023",
    { transactionId: "TXN-000023", verdict: "FRAUD", notes: "High risk geo" },
    150,
  ),
  makeLog(
    12,
    "user_flagged",
    "admin@fraudeye.com",
    "admin",
    "Alert",
    "user",
    "USR-00005",
    { userId: "USR-00005", reason: "Velocity abuse" },
    180,
  ),
  makeLog(
    13,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000022",
    { transactionId: "TXN-000022", verdict: "FRAUD", notes: null },
    240,
  ),
  makeLog(
    14,
    "merchant_risk_updated",
    "admin@fraudeye.com",
    "admin",
    "Config",
    "merchant",
    "merch_002",
    {
      merchantId: "merch_002",
      newRiskScore: 20,
      oldRiskScore: 10,
      fraudCount: 1,
    },
    300,
  ),
  makeLog(
    15,
    "feedback_submitted",
    "analyst@fraudeye.com",
    "analyst",
    "Decision",
    "transaction",
    "TXN-000019",
    { transactionId: "TXN-000019", verdict: "FRAUD", notes: null },
    360,
  ),
];

/* ── Summary helper ──────────────────────────────────────── */
export function getAuditSummary(logs) {
  return {
    total: logs.length,
    decisions: logs.filter((l) => l.category === "Decision").length,
    failures: logs.filter((l) => l.result === "FAILURE").length,
  };
}
/* ── Append these exports to the END of auditData.js ── */

export const EVENT_TYPES = {
  feedback_submitted: {
    label: "Feedback Submitted",
    color: "#22D3EE",
    category: "Decision",
  },
  merchant_flagged: {
    label: "Merchant Flagged",
    color: "#F43F5E",
    category: "Alert",
  },
  user_flagged: { label: "User Flagged", color: "#F43F5E", category: "Alert" },
  merchant_risk_updated: {
    label: "Merchant Risk Updated",
    color: "#F59E0B",
    category: "Config",
  },
  user_login: { label: "User Login", color: "#22C55E", category: "Auth" },
  user_logout: { label: "User Logout", color: "#475569", category: "Auth" },
  case_escalated: {
    label: "Case Escalated",
    color: "#8B5CF6",
    category: "Decision",
  },
  model_scored: { label: "Model Scored", color: "#22D3EE", category: "Model" },
  threshold_changed: {
    label: "Threshold Changed",
    color: "#F59E0B",
    category: "Config",
  },
  export_triggered: {
    label: "Export Triggered",
    color: "#8B5CF6",
    category: "System",
  },
};

export const ACTOR_CONFIG = {
  admin: {
    label: "Admin",
    color: "#F43F5E",
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
  },
  analyst: {
    label: "Analyst",
    color: "#22D3EE",
    bg: "bg-[#22D3EE14]",
    border: "border-[#22D3EE33]",
  },
  system: {
    label: "System",
    color: "#475569",
    bg: "bg-[#47556914]",
    border: "border-[#33415533]",
  },
};

export const RESULT_CONFIG = {
  SUCCESS: {
    label: "Success",
    color: "#22C55E",
    bg: "bg-[#22C55E14]",
    border: "border-[#22C55E33]",
  },
  FAILURE: {
    label: "Failure",
    color: "#F43F5E",
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
  },
  INFO: {
    label: "Info",
    color: "#22D3EE",
    bg: "bg-[#22D3EE14]",
    border: "border-[#22D3EE33]",
  },
};

export function formatExactTime(ts) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(ts));
  } catch {
    return "—";
  }
}

export const ACTOR_FILTER_OPTIONS = [
  { value: "", label: "All Actors" },
  { value: "admin", label: "Admin" },
  { value: "analyst", label: "Analyst" },
  { value: "system", label: "System" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Decision", label: "Decision" },
  { value: "Alert", label: "Alert" },
  { value: "Config", label: "Config" },
  { value: "Auth", label: "Auth" },
  { value: "Model", label: "Model" },
  { value: "System", label: "System" },
];
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];
