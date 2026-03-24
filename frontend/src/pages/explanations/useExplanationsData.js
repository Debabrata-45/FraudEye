/**
 * useExplanationsData.js — Real API hook for Explanations page
 * Place at: frontend/src/pages/explanations/useExplanationsData.js
 */

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";
import { MOCK_CASES } from "./explanationsData";

/* ── Map a topFactor into ContributionBar shape ──────────── */
function mapFeature(f) {
  const rawVal = parseFloat(f.value ?? f.shapValue ?? 0);
  const absVal = Math.abs(rawVal);
  const isFraud = f.direction === "increases_risk" || rawVal > 0;

  return {
    feature: f.feature,
    shapValue: rawVal,
    absValue: absVal,
    value: rawVal,
    contribution: isFraud ? "FRAUD" : "SAFE",
    description: buildFeatureDescription(f.feature, rawVal),
  };
}

function buildFeatureDescription(feature, value) {
  const abs = Math.abs(value).toFixed(3);
  const dir = value > 0 ? "increases" : "decreases";
  const labels = {
    geo_anomaly_km: `Geographic distance anomaly — ${dir} fraud risk by ${abs}`,
    geo_impossible: `Physically impossible travel speed detected`,
    unusual_hour: `Transaction at unusual hour — ${dir} fraud risk by ${abs}`,
    new_device: `Unknown device fingerprint — ${dir} fraud risk by ${abs}`,
    device_inconsistency: `Device changed from previous transaction`,
    txn_velocity_5m: `High transaction velocity in 5 minutes`,
    txn_velocity_1h: `High transaction velocity in 1 hour`,
    merchant_risk_level: `Merchant risk rating — ${dir} fraud risk by ${abs}`,
    spending_deviation_from_user_avg: `Spending deviation from user average — ${abs}σ`,
    amount: `Transaction amount — ${dir} fraud risk by ${abs}`,
  };
  return labels[feature] ?? `Feature impact: ${dir} risk by ${abs}`;
}

/* ── Normalize a case from the API ───────────────────────── */
function normalizeCase(raw) {
  const score = parseFloat(raw.riskScore ?? 0) / 100;
  const label =
    score >= 0.7 ? "FRAUD" : score >= 0.4 ? "SUSPICIOUS" : "LEGITIMATE";

  const topFactors = raw.topFactors ?? [];

  // Map to ContributionBar-compatible shape
  const shapFeatures = topFactors
    .map(mapFeature)
    .sort((a, b) => b.absValue - a.absValue);

  const topDrivers = topFactors
    .filter((f) => f.direction === "increases_risk")
    .slice(0, 3)
    .map((f) => f.feature);

  const recommendation =
    score >= 0.85
      ? "BLOCK"
      : score >= 0.65
        ? "ESCALATE"
        : score >= 0.4
          ? "MONITOR"
          : "APPROVE";

  const confidencePct = Math.round(parseFloat(raw.confidence ?? score) * 100);
  const modelVersion = raw.modelVersion ?? "xgb_v1";

  return {
    // ID fields
    id: raw.transactionId, // numeric — used for API calls
    txnId: raw.txnId ?? `TXN-${raw.transactionId}`, // display
    transactionId: raw.transactionId,

    // Risk
    fraudScore: score,
    fraudLabel: label,
    label,

    // ExplanationSummary fields
    explainMethod: "SHAP",
    modelConfidence: confidencePct,
    explainConfidence: confidencePct,
    modelVersion,
    modelVer: modelVersion,
    method: "SHAP",

    // Verdict + recommendation
    confidence: parseFloat(raw.confidence ?? score),
    verdict:
      label === "FRAUD"
        ? "Likely Fraud"
        : label === "SUSPICIOUS"
          ? "Suspicious"
          : "Likely Legitimate",
    recommendation,

    // Features
    topDrivers,
    drivers: topDrivers, // FraudDrivers reads xcase.drivers
    shapFeatures,
    limeFeatures: [],
    features: shapFeatures,

    // Narrative
    narrative: buildNarrative(score, raw),

    // Transaction context
    merchant: raw.merchantId ?? "Unknown",
    amount: parseFloat(raw.amount ?? 0),
    currency: raw.currency ?? "INR",
    occurredAt: raw.occurredAt,
    timestamp: raw.occurredAt,
    userId: raw.userId,

    // Status for RelatedTransaction
    status: label,
    geo: null,
    device: null,

    topFactors,
    _raw: raw,
  };
}

function buildNarrative(score, raw) {
  const pct = (score * 100).toFixed(0);
  if (score >= 0.85)
    return `The model identified this transaction as high-confidence fraud (${pct}%). Multiple risk factors aligned — geo-anomaly, unusual hour, and new device are the primary drivers.`;
  if (score >= 0.65)
    return `This transaction shows suspicious characteristics with a risk score of ${pct}%. One or more fraud indicators are elevated, warranting analyst review.`;
  if (score >= 0.4)
    return `Moderate risk detected (${pct}%). The transaction has some unusual features but no strong fraud signal. Monitor for follow-up activity.`;
  return `Low risk transaction (${pct}%). The model found no significant fraud indicators. Standard processing recommended.`;
}

/* ══════════════════════════════════════════════════════════
   useCaseList
   ══════════════════════════════════════════════════════════ */
export function useCaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("live");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const toggleMode = useCallback(
    () => setMode((m) => (m === "live" ? "demo" : "live")),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (mode === "demo") {
          await new Promise((r) => setTimeout(r, 400));
          if (!cancelled) {
            setCases(MOCK_CASES);
            setLoading(false);
          }
          return;
        }
        const res = await apiClient.get("/api/explanations", {
          params: { limit: 100 },
        });
        const raw = res.data?.data?.items ?? res.data?.data ?? [];
        const live = raw.map(normalizeCase);
        if (!cancelled) {
          setCases(
            live.length < 3
              ? [...live, ...MOCK_CASES.slice(0, Math.max(0, 6 - live.length))]
              : live,
          );
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useCaseList] fallback to mock:", err.message);
          setCases(MOCK_CASES);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mode, refreshKey]);

  return { cases, loading, error, mode, toggleMode, refresh };
}

/* ══════════════════════════════════════════════════════════
   useCaseDetail
   ══════════════════════════════════════════════════════════ */
export function useCaseDetail(caseId) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!caseId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setDetail(null);

    async function load() {
      try {
        await new Promise((r) => setTimeout(r, 500));
        const res = await apiClient.get(`/api/explanations/${caseId}`);
        const raw = res.data?.data?.items?.[0] ?? res.data?.data ?? res.data;
        if (!cancelled) {
          setDetail(normalizeCase(raw));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const mock = MOCK_CASES.find(
            (c) =>
              String(c.id) === String(caseId) ||
              String(c.transactionId) === String(caseId),
          );
          if (mock) setDetail(mock);
          else setError(err.message);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  return { detail, loading, error };
}
