/**
 * overviewData.js — Overview page mock data + API hooks
 *
 * In production these would call real API endpoints.
 * Structure is intentionally identical to what the real API returns
 * so swapping mock → real is a one-line change per hook.
 */

/* ── Mock KPI data ───────────────────────────────────────── */
export const MOCK_KPIS = {
  totalTransactions: {
    value: "24,847",
    raw: 24847,
    delta: "+12.4%",
    deltaType: "up",
  },
  fraudDetected: { value: "142", raw: 142, delta: "+3.2%", deltaType: "up" },
  underReview: { value: "38", raw: 38, delta: "-8.1%", deltaType: "down" },
  approved: { value: "24,667", raw: 24667, delta: "+12.6%", deltaType: "up" },
  avgRiskScore: { value: "0.31", raw: 0.31, delta: "-2.4%", deltaType: "down" },
  modelAccuracy: { value: "99.6%", raw: 99.6, delta: "+0.1%", deltaType: "up" },
};

/* ── Fraud trend (last 14 days) ──────────────────────────── */
export const MOCK_FRAUD_TREND = [
  { date: "Dec 02", total: 1820, fraud: 9, legitimate: 1811 },
  { date: "Dec 03", total: 1950, fraud: 11, legitimate: 1939 },
  { date: "Dec 04", total: 1740, fraud: 8, legitimate: 1732 },
  { date: "Dec 05", total: 2100, fraud: 14, legitimate: 2086 },
  { date: "Dec 06", total: 2340, fraud: 18, legitimate: 2322 },
  { date: "Dec 07", total: 1980, fraud: 12, legitimate: 1968 },
  { date: "Dec 08", total: 1650, fraud: 7, legitimate: 1643 },
  { date: "Dec 09", total: 1920, fraud: 10, legitimate: 1910 },
  { date: "Dec 10", total: 2210, fraud: 16, legitimate: 2194 },
  { date: "Dec 11", total: 2450, fraud: 22, legitimate: 2428 },
  { date: "Dec 12", total: 2380, fraud: 19, legitimate: 2361 },
  { date: "Dec 13", total: 2560, fraud: 24, legitimate: 2536 },
  { date: "Dec 14", total: 2780, fraud: 21, legitimate: 2759 },
  { date: "Dec 15", total: 1847, fraud: 15, legitimate: 1832 },
];

/* ── Risk distribution ───────────────────────────────────── */
export const MOCK_RISK_DIST = [
  { name: "Low Risk", value: 68, color: "#22C55E" },
  { name: "Medium Risk", value: 24, color: "#F59E0B" },
  { name: "High Risk", value: 8, color: "#F43F5E" },
];

/* ── Top risky merchants ─────────────────────────────────── */
export const MOCK_RISKY_MERCHANTS = [
  {
    name: "CryptoFast Exchange",
    score: 0.91,
    txns: 34,
    flagged: 18,
    category: "Crypto",
  },
  {
    name: "QuickCash ATM Co.",
    score: 0.87,
    txns: 22,
    flagged: 14,
    category: "ATM",
  },
  {
    name: "GlobalBet Gaming",
    score: 0.82,
    txns: 67,
    flagged: 19,
    category: "Gambling",
  },
  {
    name: "NightShift Retail",
    score: 0.76,
    txns: 19,
    flagged: 9,
    category: "Retail",
  },
  {
    name: "VeloTransfer LLC",
    score: 0.71,
    txns: 45,
    flagged: 11,
    category: "Transfer",
  },
];

/* ── Hourly velocity (last 12h) ──────────────────────────── */
export const MOCK_HOURLY = [
  { hour: "04:00", txns: 42, fraud: 1 },
  { hour: "05:00", txns: 58, fraud: 2 },
  { hour: "06:00", txns: 89, fraud: 1 },
  { hour: "07:00", txns: 143, fraud: 4 },
  { hour: "08:00", txns: 198, fraud: 6 },
  { hour: "09:00", txns: 234, fraud: 8 },
  { hour: "10:00", txns: 267, fraud: 7 },
  { hour: "11:00", txns: 289, fraud: 9 },
  { hour: "12:00", txns: 312, fraud: 11 },
  { hour: "13:00", txns: 298, fraud: 8 },
  { hour: "14:00", txns: 276, fraud: 7 },
  { hour: "15:00", txns: 187, fraud: 5 },
];

/* ── AI Insights ─────────────────────────────────────────── */
export const MOCK_AI_INSIGHTS = [
  {
    id: 1,
    type: "spike",
    accent: "danger",
    tag: "SPIKE",
    title: "Fraud spike detected — last 3 hours",
    body: "Transaction fraud rate has risen to 1.8% — 2.4× above the 7-day baseline of 0.74%. Concentrated in crypto and ATM categories.",
    confidence: 0.94,
    ts: "2 min ago",
  },
  {
    id: 2,
    type: "pattern",
    accent: "warning",
    tag: "PATTERN",
    title: "Geo-anomaly cluster: Eastern Europe",
    body: "Unusual transaction origin clustering from 3 new device fingerprints across 2 flagged merchants. Behavioral deviation score: 0.88.",
    confidence: 0.87,
    ts: "14 min ago",
  },
  {
    id: 3,
    type: "queue",
    accent: "ai",
    tag: "QUEUE",
    title: "Review queue above normal threshold",
    body: "Current queue depth is 38 — 58% above the daily average of 24. Analyst throughput may need scaling.",
    confidence: 0.79,
    ts: "31 min ago",
  },
  {
    id: 4,
    type: "merchant",
    accent: "warning",
    tag: "MERCHANT",
    title: "CryptoFast risk score elevated",
    body: "Merchant risk level upgraded to CRITICAL after 18 fraud confirmations in 24h. Model flag rate: 52.9%.",
    confidence: 0.92,
    ts: "1 hr ago",
  },
];

/* ── Live alerts ─────────────────────────────────────────── */
export const MOCK_LIVE_ALERTS = [
  {
    id: "txn-a1",
    severity: "critical",
    title: "Transaction blocked — velocity fraud",
    description: "9 transactions in 5 min from same device. Risk score 0.97.",
    txnId: "TXN-8F3C",
    timestamp: new Date(Date.now() - 1.2 * 60000).toISOString(),
    reasons: ["velocity", "device"],
  },
  {
    id: "txn-a2",
    severity: "high",
    title: "Geo-impossible flag — distance anomaly",
    description: "2 transactions 4,200 km apart within 8 minutes.",
    txnId: "TXN-2D9A",
    timestamp: new Date(Date.now() - 4.5 * 60000).toISOString(),
    reasons: ["geo"],
  },
  {
    id: "txn-a3",
    severity: "medium",
    title: "New device — spending deviation",
    description: "First-seen device with 4.2× above user average spend.",
    txnId: "TXN-6E1B",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    reasons: ["device", "amount"],
  },
  {
    id: "txn-a4",
    severity: "high",
    title: "Flagged merchant — high risk category",
    description: "Transaction at CryptoFast Exchange. Merchant risk: CRITICAL.",
    txnId: "TXN-0C7F",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    reasons: ["merchant"],
  },
];

/* ── XAI sample explanation ──────────────────────────────── */
export const MOCK_XAI_SAMPLE = {
  txnId: "TXN-8F3C",
  label: "HIGH",
  score: 0.97,
  method: "SHAP",
  modelVer: "xgb_v1",
  confidence: 0.97,
  verdict: "Likely Fraud",
  topDrivers: ["txn_velocity_5m", "new_device", "geo_anomaly_km"],
  features: [
    { feature: "txn_velocity_5m", value: 0.4821 },
    { feature: "new_device", value: 0.2934 },
    { feature: "geo_anomaly_km", value: 0.1876 },
    { feature: "unusual_hour", value: 0.0923 },
    { feature: "merchant_risk_level", value: 0.0712 },
    { feature: "spending_deviation_from_avg", value: -0.0341 },
    { feature: "amount", value: -0.0198 },
  ],
};

/* ── Spark data helpers ──────────────────────────────────── */
export const SPARK_FRAUD = [
  9, 11, 8, 14, 18, 12, 7, 10, 16, 22, 19, 24, 21, 15,
];
export const SPARK_TOTAL = [
  1820, 1950, 1740, 2100, 2340, 1980, 1650, 1920, 2210, 2450, 2380, 2560, 2780,
  1847,
];
export const SPARK_REVIEW = [
  44, 38, 42, 51, 48, 35, 39, 44, 52, 49, 41, 47, 53, 38,
];
export const SPARK_APPROVED = SPARK_TOTAL.map((t, i) => t - SPARK_FRAUD[i]);
export const SPARK_RISK = [
  0.34, 0.36, 0.31, 0.38, 0.41, 0.35, 0.29, 0.33, 0.37, 0.42, 0.39, 0.4, 0.38,
  0.31,
];
