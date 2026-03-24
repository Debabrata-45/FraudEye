/**
 * useAnalystData.js — Real API hooks for Analyst Review page
 * Place at: frontend/src/pages/analyst/useAnalystData.js
 *
 * Real transactions schema (data.items[]):
 *   id, user_id, merchant_id, amount, currency,
 *   occurred_at, created_at, risk_score, risk_label
 */

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";
import { MOCK_CASES, ACTIONS } from "./analystData";

const RISK_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
const STATUS_ORDER = { pending: 0, reviewing: 1, escalated: 2 };

/* ── Normalize a transaction into a review case ──────────── */
function normalizeCase(raw) {
  const score =
    raw.risk_score != null
      ? parseFloat(raw.risk_score) / 100 // API returns 0-100
      : null;

  // Skip unscored transactions
  if (score === null) return null;

  const severity =
    score >= 0.85
      ? "critical"
      : score >= 0.65
        ? "high"
        : score >= 0.4
          ? "medium"
          : "low";

  const reviewStatus = raw.feedback_verdict
    ? raw.feedback_verdict === "fraud"
      ? "confirmed"
      : raw.feedback_verdict === "not_fraud"
        ? "cleared"
        : "reviewing"
    : "pending";

  return {
    id: String(raw.id),
    transactionId: String(raw.id),
    title: `Transaction #${String(raw.id).toUpperCase()}`,
    severity,
    score,
    status: reviewStatus,
    merchant: raw.merchant_id ?? "Unknown",
    amount: parseFloat(raw.amount ?? 0),
    currency: raw.currency ?? "INR",
    occurredAt: raw.occurred_at ?? raw.created_at,
    userId: raw.user_id,
    deviceId: raw.device_id ?? null,
    ipAddress: raw.ip_address ?? null,
    shapFeatures: [], // not in list response — loaded on detail view
    feedbackNote: raw.feedback_note ?? "",
    feedbackVerdict: raw.feedback_verdict ?? null,
    _raw: raw,
  };
}

/* ══════════════════════════════════════════════════════════
   useReviewQueue
   ══════════════════════════════════════════════════════════ */
export function useReviewQueue() {
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

        // Fetch all scored transactions, filter to medium+ risk
        const res = await apiClient.get("/api/transactions", {
          params: { limit: 200 },
        });
        const raw = res.data?.data?.items ?? [];

        let live = raw
          .map(normalizeCase)
          .filter(Boolean) // remove unscored (null)
          .filter((c) => ["critical", "high", "medium"].includes(c.severity));

        // Sort: pending+critical first, then by score desc
        live.sort((a, b) => {
          const statusDiff =
            (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3);
          if (statusDiff !== 0) return statusDiff;
          const riskDiff =
            (RISK_ORDER[a.severity] ?? 4) - (RISK_ORDER[b.severity] ?? 4);
          if (riskDiff !== 0) return riskDiff;
          return b.score - a.score;
        });

        if (!cancelled) {
          if (live.length < 3) {
            setCases([
              ...live,
              ...MOCK_CASES.slice(0, Math.max(0, 5 - live.length)),
            ]);
          } else {
            setCases(live);
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useReviewQueue] fallback to mock:", err.message);
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

  const summary = {
    total: cases.length,
    critical: cases.filter((c) => c.severity === "critical").length,
    pending: cases.filter((c) => c.status === "pending").length,
    reviewing: cases.filter((c) => c.status === "reviewing").length,
  };

  return { cases, loading, error, summary, mode, toggleMode, refresh };
}

/* ══════════════════════════════════════════════════════════
   useAnalystActions — submits to POST /api/feedback
   ══════════════════════════════════════════════════════════ */
export function useAnalystActions({ onSuccess, onError, onRefresh }) {
  const [actionStatus, setActionStatus] = useState("idle");
  const [actionMessage, setActionMessage] = useState("");

  const submitAction = useCallback(
    async ({ actionKey, caseData, note = "" }) => {
      setActionStatus("loading");
      setActionMessage("");

      const minDelay = new Promise((r) => setTimeout(r, 900));

      try {
        const action = ACTIONS[actionKey];
        if (!action) throw new Error(`Unknown action: ${actionKey}`);

        const verdictMap = {
          CONFIRM_FRAUD: "FRAUD",
          CLEAR_LEGITIMATE: "SAFE",
          ESCALATE: null,
          REQUEST_INFO: null,
        };

        const verdict = verdictMap[actionKey];
        const apiCalls = [];

        if (verdict !== null) {
          apiCalls.push(
            apiClient.post("/api/feedback", {
              transactionId: caseData.transactionId ?? caseData.id,
              verdict,
              notes: note || action.label,
            }),
          );
        }

        if (actionKey === "CONFIRM_FRAUD" && caseData.userId) {
          apiCalls.push(
            apiClient
              .post("/api/actions/flag-user", {
                userId: caseData.userId,
                reason: `Confirmed fraud on transaction ${caseData.transactionId}`,
              })
              .catch(() => {
                /* non-fatal */
              }),
          );
        }

        if (
          actionKey === "CONFIRM_FRAUD" &&
          caseData.merchant &&
          caseData.merchant !== "Unknown"
        ) {
          apiCalls.push(
            apiClient
              .post("/api/actions/flag-merchant", {
                merchantId: caseData.merchant,
                reason: "Confirmed fraud — merchant flagged by analyst",
              })
              .catch(() => {
                /* non-fatal */
              }),
          );
        }

        await Promise.all([...apiCalls, minDelay]);

        const labels = {
          CONFIRM_FRAUD: "Fraud confirmed and logged",
          CLEAR_LEGITIMATE: "Transaction cleared as legitimate",
          ESCALATE: "Case escalated to senior analyst",
          REQUEST_INFO: "Information request sent",
        };

        setActionStatus("success");
        setActionMessage(labels[actionKey] ?? "Decision submitted");
        onSuccess?.({ actionKey, caseData, verdict });

        setTimeout(() => {
          setActionStatus("idle");
          setActionMessage("");
          onRefresh?.();
        }, 2500);
      } catch (err) {
        await minDelay;
        setActionStatus("error");
        setActionMessage("Action could not be completed — please try again");
        onError?.({ message: err.message });
        setTimeout(() => {
          setActionStatus("idle");
          setActionMessage("");
        }, 3000);
      }
    },
    [onSuccess, onError, onRefresh],
  );

  const resetAction = useCallback(() => {
    setActionStatus("idle");
    setActionMessage("");
  }, []);

  return { actionStatus, actionMessage, submitAction, resetAction };
}
