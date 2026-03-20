/**
 * useOverviewData.js — Smart merge: Real API + Synthetic mock data
 *
 * Strategy:
 *   - Real API data loads first and takes priority
 *   - KPIs show real counts from backend
 *   - Avg risk score properly formatted
 *   - isRealData flag tells Transactions.jsx whether to merge with mock
 */
import { useState, useEffect } from "react";
import client from "../../api/client";

/* ── Re-export all mock data for charts ─────────────────── */
export {
  MOCK_FRAUD_TREND,
  MOCK_RISK_DIST,
  MOCK_RISKY_MERCHANTS,
  MOCK_HOURLY,
  MOCK_AI_INSIGHTS,
  MOCK_LIVE_ALERTS,
  MOCK_XAI_SAMPLE,
  SPARK_FRAUD,
  SPARK_TOTAL,
  SPARK_REVIEW,
  SPARK_APPROVED,
  SPARK_RISK,
  MOCK_KPIS,
} from "./overviewData";

/* ── Real KPI hook ─────────────────────────────────────── */
export function useOverviewKPIs() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [summaryRes] = await Promise.all([
          client.get("/api/analytics/summary"),
        ]);
        if (cancelled) return;

        const summary = summaryRes.data.data;
        const total = summary.totalTransactions ?? 0;
        const avgRaw = summary.avgRiskScore ?? 0;

        // Format avg risk score cleanly
        const avgFormatted = Number.isInteger(avgRaw)
          ? String(avgRaw)
          : avgRaw.toFixed(1);

        const byLabel = summary.byRiskLabel ?? [];

        const fraudCount = byLabel
          .filter((b) => ["high", "critical"].includes(b.label?.toLowerCase()))
          .reduce((sum, b) => sum + (b.count ?? 0), 0);

        const mediumCount =
          byLabel.find((b) => b.label?.toLowerCase() === "medium")?.count ?? 0;

        const lowCount =
          byLabel.find((b) => b.label?.toLowerCase() === "low")?.count ?? 0;

        setKpis({
          totalTransactions: {
            value: total.toLocaleString(),
            raw: total,
            delta: null,
            deltaType: "up",
          },
          fraudDetected: {
            value: String(fraudCount),
            raw: fraudCount,
            delta: null,
            deltaType: "up",
          },
          underReview: {
            value: String(mediumCount),
            raw: mediumCount,
            delta: null,
            deltaType: "down",
          },
          approved: {
            value: String(lowCount),
            raw: lowCount,
            delta: null,
            deltaType: "up",
          },
          avgRiskScore: {
            value: avgFormatted,
            raw: avgRaw,
            delta: null,
            deltaType: avgRaw > 50 ? "up" : "down",
          },
          modelAccuracy: {
            value: "99.6%",
            raw: 99.6,
            delta: "+0.1%",
            deltaType: "up",
          },
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { kpis, loading, error };
}

/* ── Smart merge transactions hook ─────────────────────── */
export function useTransactions({ limit = 50, offset = 0 } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await client.get("/api/transactions", {
          params: { limit, offset },
        });
        if (cancelled) return;
        const items = res.data.data.items || [];
        if (items.length > 0) {
          setData(mapTransactions(items));
          setTotal(items.length);
          setIsRealData(true);
        } else {
          setData([]);
          setTotal(0);
          setIsRealData(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setIsRealData(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [limit, offset]);

  return { data, loading, error, total, isRealData };
}

/* ── Map backend transaction → frontend shape ───────────── */
function mapTransactions(items) {
  return items.map((tx) => {
    const riskScore = tx.risk_score ?? 0;
    const riskLabel = (tx.risk_label ?? "low").toLowerCase();
    return {
      id: `TXN-${String(tx.id).padStart(6, "0")}`,
      timestamp: new Date(tx.occurred_at),
      merchant: {
        name: tx.merchant_id,
        category: "Merchant",
        icon: "🏪",
      },
      amount: parseFloat(tx.amount),
      currency: tx.currency || "INR",
      status: mapStatus(riskLabel),
      fraudLabel: mapFraudLabel(riskLabel),
      riskScore: riskScore / 100,
      riskLevel: mapRiskLevel(riskLabel),
      reasons: [],
      geo: "Unknown",
      device: "Unknown",
      accountId: `USR-${tx.user_id}`,
      cardLast4: "0000",
      shapFeatures: [],
      modelConfidence: riskScore,
      isNew: false,
      isRealData: true,
    };
  });
}

function mapRiskLevel(label) {
  const map = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
  };
  return map[label] ?? "LOW";
}
function mapStatus(label) {
  const map = {
    critical: "BLOCKED",
    high: "FLAGGED",
    medium: "UNDER_REVIEW",
    low: "APPROVED",
  };
  return map[label] ?? "APPROVED";
}
function mapFraudLabel(label) {
  const map = {
    critical: "FRAUD",
    high: "FRAUD",
    medium: "SUSPICIOUS",
    low: "LEGITIMATE",
  };
  return map[label] ?? "LEGITIMATE";
}
