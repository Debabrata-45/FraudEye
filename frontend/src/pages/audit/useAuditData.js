/**
 * useAuditData.js — Real API hook for Audit Logs page
 * Place at: frontend/src/pages/audit/useAuditData.js
 */

import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";
import { MOCK_LOGS } from "./auditData";

const DEFAULT_FILTERS = {
  search: "",
  actor: "",
  category: "",
  sort: "newest",
};

function getCategory(eventType) {
  if (!eventType) return "System";
  if (eventType.includes("feedback")) return "Decision";
  if (
    eventType.includes("merchant_flagged") ||
    eventType.includes("user_flagged")
  )
    return "Alert";
  if (eventType.includes("merchant_risk")) return "Config";
  if (eventType.includes("login") || eventType.includes("logout"))
    return "Auth";
  if (eventType.includes("model")) return "Model";
  return "System";
}

function normalizeLog(raw) {
  const createdAt = new Date(raw.created_at ?? 0);
  const isNew = Date.now() - createdAt.getTime() < 2 * 60 * 1000;

  const meta = (() => {
    try {
      if (typeof raw.meta === "object") return raw.meta ?? {};
      if (typeof raw.meta === "string") return JSON.parse(raw.meta);
    } catch {
      /* noop */
    }
    return {};
  })();

  const category = getCategory(raw.event_type);
  const eventType = raw.event_type ?? "unknown";
  const result = meta.error ? "FAILURE" : "SUCCESS";

  const before =
    meta.oldRiskScore != null
      ? { risk_score: meta.oldRiskScore }
      : meta.prevVerdict != null
        ? { verdict: meta.prevVerdict }
        : null;

  const after =
    meta.newRiskScore != null
      ? { risk_score: meta.newRiskScore }
      : meta.verdict != null
        ? { verdict: meta.verdict }
        : null;

  return {
    id: String(raw.id),
    eventType, // ← used by AuditTable EventBadge
    actionType: eventType, // ← alias
    actorId: raw.actor_user_id,
    actorEmail: raw.actor_email ?? "system",
    actorRole: raw.actor_role ?? "system",
    // actor object shape AuditTable expects
    actor: {
      role: raw.actor_role ?? "system",
      name: raw.actor_email ?? "system",
    },
    entityType: meta.transactionId
      ? "transaction"
      : meta.merchantId
        ? "merchant"
        : meta.userId
          ? "user"
          : "",
    entityId: meta.transactionId ?? meta.merchantId ?? meta.userId ?? null,
    caseId: meta.transactionId ? `TXN-${meta.transactionId}` : null,
    result,
    category,
    meta,
    before,
    after,
    // timestamp field AuditTable uses
    timestamp: raw.created_at ?? new Date().toISOString(),
    ts: raw.created_at ?? new Date().toISOString(),
    isNew,
    _raw: raw,
  };
}

function applyFilters(logs, filters) {
  let out = [...logs];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    out = out.filter(
      (l) =>
        l.actionType.toLowerCase().includes(q) ||
        l.actorEmail.toLowerCase().includes(q) ||
        String(l.entityId ?? "")
          .toLowerCase()
          .includes(q) ||
        JSON.stringify(l.meta).toLowerCase().includes(q),
    );
  }

  if (filters.actor) out = out.filter((l) => l.actorRole === filters.actor);
  if (filters.category)
    out = out.filter((l) => l.category === filters.category);

  return out;
}

export function useAuditData() {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [mode, setMode] = useState("live");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const toggleMode = useCallback(
    () => setMode((m) => (m === "live" ? "demo" : "live")),
    [],
  );
  const handleFilters = useCallback(
    (updates) => setFilters((prev) => ({ ...prev, ...updates })),
    [],
  );
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (mode === "demo") {
          await new Promise((r) => setTimeout(r, 400));
          if (!cancelled) {
            setAllLogs(MOCK_LOGS);
            setLoading(false);
          }
          return;
        }

        const res = await apiClient.get("/api/audit-logs", {
          params: { limit: 200, sort: filters.sort },
        });
        const data = res.data?.data ?? {};
        const raw = data.logs ?? [];
        const live = raw.map(normalizeLog);

        if (!cancelled) {
          setAllLogs(live.length === 0 ? MOCK_LOGS : live);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useAuditData] fallback to mock:", err.message);
          setAllLogs(MOCK_LOGS);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mode, filters.sort, refreshKey]);

  const logs = applyFilters(allLogs, filters);
  const total = allLogs.length;

  const summary = {
    total,
    decisions: allLogs.filter((l) => l.category === "Decision").length,
    failures: allLogs.filter((l) => l.result === "FAILURE").length,
  };

  return {
    logs,
    loading,
    error,
    filters,
    total,
    summary,
    mode,
    handleFilters,
    handleReset,
    toggleMode,
    refresh,
  };
}
