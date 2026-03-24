/**
 * useAlertsData.js — Real API hook for Alerts page
 * Place at: frontend/src/pages/alerts/useAlertsData.js
 */

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";
import { MOCK_ALERTS } from "./alertsData";

/* ── Normalize a real alert ──────────────────────────────── */
function normalizeAlert(raw) {
  const score = parseFloat(raw.riskScore ?? 0) / 100;
  const severity = raw.severity?.toLowerCase() ?? "low";

  const reasons = (raw.topFactors ?? [])
    .filter((f) => f.direction === "increases_risk")
    .map((f) => {
      if (f.feature === "geo_anomaly_km" || f.feature === "geo_impossible")
        return "geo";
      if (f.feature === "new_device" || f.feature === "device_inconsistency")
        return "device";
      if (f.feature === "txn_velocity_5m" || f.feature === "txn_velocity_1h")
        return "velocity";
      if (f.feature === "spending_deviation_from_user_avg") return "amount";
      if (f.feature === "merchant_risk_level") return "merchant";
      if (f.feature === "unusual_hour") return "hour";
      return null;
    })
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);

  const statusMap = {
    ACTIVE: "active",
    RESOLVED: "resolved",
    DISMISSED: "dismissed",
  };

  return {
    id: raw.id,
    txnId: raw.txnId ?? raw.transactionId,
    severity,
    score,
    title: buildTitle(severity),
    description: buildDescription(raw, reasons),
    merchant: raw.merchantId ?? "Unknown Merchant",
    amount: parseFloat(raw.amount ?? 0),
    currency: raw.currency ?? "INR",
    reasons,
    status: statusMap[raw.status] ?? raw.status?.toLowerCase() ?? "active",
    verdict: raw.verdict ?? null,
    notes: raw.notes ?? "",
    ts: raw.occurredAt ?? raw.createdAt ?? new Date().toISOString(),
    topFactors: raw.topFactors ?? [],
    entity: {
      type: raw.merchantId ? "Merchant" : "User",
      value: raw.merchantId ?? String(raw.userId ?? "—"),
    },
    isNew: false,
    _raw: raw,
  };
}

function buildTitle(severity) {
  const titles = {
    critical: "Critical fraud signal detected",
    high: "High-risk transaction flagged",
    medium: "Suspicious transaction under review",
    low: "Low-risk informational flag",
  };
  return titles[severity] ?? "Transaction flagged";
}

function buildDescription(_raw, reasons) {
  const parts = [];
  if (reasons.includes("geo")) parts.push("Geo-location anomaly");
  if (reasons.includes("velocity")) parts.push("Velocity anomaly");
  if (reasons.includes("device")) parts.push("Unknown device");
  if (reasons.includes("amount")) parts.push("Unusual amount");
  if (reasons.includes("merchant")) parts.push("High-risk merchant");
  if (reasons.includes("hour")) parts.push("Unusual hour");
  if (!parts.length) parts.push("Risk threshold exceeded");
  return parts.join(" · ");
}

/* ── Hook ────────────────────────────────────────────────── */
export function useAlertsData() {
  const [alerts, setAlerts] = useState([]);
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
            setAlerts(MOCK_ALERTS);
            setLoading(false);
          }
          return;
        }

        const res = await apiClient.get("/api/alerts", {
          params: { limit: 200 },
        });
        const raw = res.data?.data?.items ?? res.data?.data ?? [];
        const live = raw.map(normalizeAlert);

        if (!cancelled) {
          if (live.length < 3) {
            setAlerts([
              ...live,
              ...MOCK_ALERTS.slice(0, Math.max(0, 6 - live.length)),
            ]);
          } else {
            setAlerts(live);
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useAlertsData] fallback to mock:", err.message);
          setAlerts(MOCK_ALERTS);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mode, refreshKey]);

  const summary = {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    high: alerts.filter((a) => a.severity === "high").length,
    active: alerts.filter((a) => a.status === "active").length,
  };

  return { alerts, loading, error, summary, mode, toggleMode, refresh };
}
