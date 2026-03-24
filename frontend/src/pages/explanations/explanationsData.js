/**
 * explanationsData.js — Mock cases for Explanations page
 * Used as fallback when real API has insufficient data
 * Shape matches useExplanationsData normalizeCase output exactly
 */

const makeFeatures = (riskScore) => {
  const high = riskScore > 0.65;
  return [
    {
      feature: "txn_velocity_5m",
      value: high ? 0.4821 : -0.0812,
      impact: Math.abs(high ? 0.4821 : 0.0812),
      direction: high ? "increases_risk" : "decreases_risk",
    },
    {
      feature: "new_device",
      value: high ? 0.2934 : -0.0423,
      impact: Math.abs(high ? 0.2934 : 0.0423),
      direction: high ? "increases_risk" : "decreases_risk",
    },
    {
      feature: "geo_anomaly_km",
      value: high ? 0.1876 : 0.0234,
      impact: Math.abs(high ? 0.1876 : 0.0234),
      direction: high ? "increases_risk" : "decreases_risk",
    },
    {
      feature: "unusual_hour",
      value: high ? 0.0923 : -0.0156,
      impact: Math.abs(high ? 0.0923 : 0.0156),
      direction: high ? "increases_risk" : "decreases_risk",
    },
    {
      feature: "merchant_risk_level",
      value: high ? 0.0712 : -0.0341,
      impact: Math.abs(high ? 0.0712 : 0.0341),
      direction: high ? "increases_risk" : "decreases_risk",
    },
    {
      feature: "spending_deviation_from_avg",
      value: high ? -0.0341 : 0.0198,
      impact: Math.abs(high ? 0.0341 : 0.0198),
      direction: high ? "decreases_risk" : "increases_risk",
    },
    {
      feature: "amount",
      value: high ? -0.0198 : 0.0087,
      impact: Math.abs(high ? 0.0198 : 0.0087),
      direction: high ? "decreases_risk" : "increases_risk",
    },
  ];
};

function buildNarrative(score, merchant) {
  const pct = (score * 100).toFixed(0);
  if (score >= 0.85)
    return `The model identified this ${merchant} transaction as high-confidence fraud (${pct}%). Velocity spike, new device, and geo anomaly are the primary drivers.`;
  if (score >= 0.65)
    return `This ${merchant} transaction shows suspicious characteristics with a risk score of ${pct}%. One or more fraud indicators are elevated, warranting analyst review.`;
  if (score >= 0.4)
    return `Moderate risk detected at ${merchant} (${pct}%). The transaction has some unusual features but no strong fraud signal. Monitor for follow-up activity.`;
  return `Low risk transaction at ${merchant} (${pct}%). The model found no significant fraud indicators. Standard processing recommended.`;
}

const makeCase = (id, riskScore, merchant, amount, hoursAgo) => {
  const now = new Date();
  const features = makeFeatures(riskScore);
  const label =
    riskScore >= 0.85
      ? "FRAUD"
      : riskScore >= 0.4
        ? "SUSPICIOUS"
        : "LEGITIMATE";
  const verdict =
    riskScore >= 0.85
      ? "Likely Fraud"
      : riskScore >= 0.4
        ? "Suspicious"
        : "Likely Legitimate";
  const recommendation =
    riskScore >= 0.85
      ? "BLOCK"
      : riskScore >= 0.65
        ? "ESCALATE"
        : riskScore >= 0.4
          ? "MONITOR"
          : "APPROVE";
  const topDrivers = features
    .filter((f) => f.direction === "increases_risk")
    .slice(0, 3)
    .map((f) => f.feature);

  return {
    id: `TXN-${String(id).padStart(6, "0")}`,
    transactionId: id,
    fraudScore: riskScore,
    label,
    method: "SHAP",
    modelVer: "xgb_v1",
    confidence: riskScore,
    verdict,
    recommendation,
    topDrivers,
    features,
    limeFeatures: [],
    narrative: buildNarrative(riskScore, merchant),
    merchant,
    amount,
    currency: "USD",
    occurredAt: new Date(now.getTime() - hoursAgo * 3600000).toISOString(),
    userId: `USR-${String(1000 + id).padStart(5, "0")}`,
    topFactors: features,
    _raw: {},
  };
};

export const MOCK_CASES = [
  makeCase(1, 0.97, "CryptoFast Exchange", 9840.0, 0.5),
  makeCase(2, 0.88, "QuickCash ATM Co.", 4200.0, 1.2),
  makeCase(3, 0.76, "GlobalBet Gaming", 1580.5, 2.8),
  makeCase(4, 0.61, "NightShift Retail", 890.0, 5.0),
  makeCase(5, 0.54, "VeloTransfer LLC", 3120.75, 7.5),
  makeCase(6, 0.42, "Stripe Payments", 450.0, 12.0),
  makeCase(7, 0.18, "Amazon Web Services", 2299.0, 18.0),
  makeCase(8, 0.09, "Netflix Inc", 15.99, 24.0),
];
/* ── Append these exports to the END of explanationsData.js ── */

export const FRAUD_LABEL_CONFIG = {
  FRAUD: {
    label: "Fraud",
    color: "#F43F5E",
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
    text: "text-[#F43F5E]",
  },
  SUSPICIOUS: {
    label: "Suspicious",
    color: "#F59E0B",
    bg: "bg-[#F59E0B14]",
    border: "border-[#F59E0B33]",
    text: "text-[#F59E0B]",
  },
  LEGITIMATE: {
    label: "Legitimate",
    color: "#22C55E",
    bg: "bg-[#22C55E14]",
    border: "border-[#22C55E33]",
    text: "text-[#22C55E]",
  },
};

export const CONTRIBUTION = {
  positive: { color: "#F43F5E", label: "Increases risk" },
  negative: { color: "#22C55E", label: "Decreases risk" },
};

export const DRIVER_SEVERITY = {
  high: {
    color: "#F43F5E",
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
  },
  medium: {
    color: "#F59E0B",
    bg: "bg-[#F59E0B14]",
    border: "border-[#F59E0B33]",
  },
  low: { color: "#22D3EE", bg: "bg-[#22D3EE14]", border: "border-[#22D3EE33]" },
};

export const RECOMMENDATIONS = {
  BLOCK: {
    label: "Block Transaction",
    color: "#F43F5E",
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
    text: "text-[#F43F5E]",
    description:
      "High confidence fraud signal. Immediately block this transaction.",
  },
  ESCALATE: {
    label: "Escalate to Senior Analyst",
    color: "#F59E0B",
    bg: "bg-[#F59E0B14]",
    border: "border-[#F59E0B33]",
    text: "text-[#F59E0B]",
    description:
      "Suspicious indicators present. Requires senior analyst review.",
  },
  MONITOR: {
    label: "Monitor Activity",
    color: "#22D3EE",
    bg: "bg-[#22D3EE14]",
    border: "border-[#22D3EE33]",
    text: "text-[#22D3EE]",
    description:
      "Moderate risk detected. Monitor for further suspicious activity.",
  },
  APPROVE: {
    label: "Approve Transaction",
    color: "#22C55E",
    bg: "bg-[#22C55E14]",
    border: "border-[#22C55E33]",
    text: "text-[#22C55E]",
    description: "Low risk. No significant fraud indicators found.",
  },
};

export function formatAmount(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
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
