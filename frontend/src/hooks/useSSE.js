import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../utils/constants";
import apiClient from "../api/client";

export function useSSE(maxEvents = 100) {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    total: 0,
  });
  const [newIds, setNewIds] = useState(new Set());

  const esRef = useRef(null);
  const pauseRef = useRef(false);
  const bufferRef = useRef([]);
  const maxEventsRef = useRef(maxEvents);
  const reconnectRef = useRef(null);
  const connectRef = useRef(null);
  const initialLoaded = useRef(false);

  useEffect(() => {
    maxEventsRef.current = maxEvents;
  }, [maxEvents]);

  /* ── Load recent transactions on mount ──────────────────── */
  useEffect(() => {
    if (initialLoaded.current) return;
    initialLoaded.current = true;

    async function loadRecent() {
      try {
        const res = await apiClient.get("/api/transactions", {
          params: { limit: 50 },
        });
        const items = res.data?.data?.items ?? [];

        // Only show medium+ risk in the live feed
        const relevant = items
          .filter((t) => t.risk_score != null && t.risk_score > 30)
          .map((t) => mapAPITransaction(t))
          .slice(0, 40);

        if (relevant.length > 0) {
          setEvents(relevant);
          // Compute initial stats
          setStats({
            critical: relevant.filter((e) => e.severity === "critical").length,
            high: relevant.filter((e) => e.severity === "high").length,
            medium: relevant.filter((e) => e.severity === "medium").length,
            total: relevant.length,
          });
        }
      } catch (err) {
        console.warn("[useSSE] Failed to load initial events:", err.message);
      }
    }

    loadRecent();
  }, []);

  /* ── SSE connection ──────────────────────────────────────── */
  const connectSSE = useCallback(() => {
    const token = localStorage.getItem("fraudeye_token");
    if (!token) return;

    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const url = `${API_BASE_URL}/api/stream/transactions?token=${token}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    es.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "ping" || data.type === "hello") return;
        if (data.type !== "tx_scored") return;

        if (pauseRef.current) {
          bufferRef.current.push(data);
          return;
        }

        const event = mapSSEEvent(data);
        setEvents((prev) => [event, ...prev].slice(0, maxEventsRef.current));
        setNewIds((prev) => {
          const next = new Set(prev);
          next.add(event.id);
          setTimeout(
            () =>
              setNewIds((s) => {
                const n = new Set(s);
                n.delete(event.id);
                return n;
              }),
            3000,
          );
          return next;
        });
        setStats((prev) => ({
          critical: prev.critical + (event.severity === "critical" ? 1 : 0),
          high: prev.high + (event.severity === "high" ? 1 : 0),
          medium: prev.medium + (event.severity === "medium" ? 1 : 0),
          total: prev.total + 1,
        }));
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    });

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      reconnectRef.current = setTimeout(() => {
        reconnectRef.current = null;
        if (connectRef.current) connectRef.current();
      }, 3000);
    };
  }, []);

  useEffect(() => {
    connectRef.current = connectSSE;
  }, [connectSSE]);

  useEffect(() => {
    connectSSE();
    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connectSSE]);

  const togglePause = useCallback(() => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
    if (!pauseRef.current && bufferRef.current.length > 0) {
      const buffered = bufferRef.current.map(mapSSEEvent);
      bufferRef.current = [];
      setEvents((prev) =>
        [...buffered, ...prev].slice(0, maxEventsRef.current),
      );
    }
  }, []);

  return { events, connected, paused, togglePause, stats, newIds };
}

/* ── Map API transaction → feed event shape ─────────────── */
function mapAPITransaction(t) {
  const score = parseInt(t.risk_score ?? 0);
  const label = (t.risk_label ?? "low").toLowerCase();
  const severity = mapSeverity(label);

  return {
    id: `TXN-${String(t.id).padStart(6, "0")}`,
    ts: t.occurred_at ?? t.created_at ?? new Date().toISOString(),
    title: buildTitleFromLabel(label, score),
    severity,
    risk: score / 100,
    merchant: String(t.merchant_id ?? "Unknown"),
    amount: parseFloat(t.amount ?? 0),
    currency: t.currency ?? "INR",
    card: "0000",
    device: "Unknown",
    userId: String(t.user_id ?? ""),
    reasons: [],
    riskScore: score,
    riskLabel: label,
    topFactors: [],
    shap: null,
    lime: null,
    isHistorical: true,
  };
}

/* ── Map SSE event → feed event shape ───────────────────── */
function mapSSEEvent(data) {
  return {
    id: `TXN-${data.transactionId}`,
    ts: data.timestamp ?? new Date().toISOString(),
    title: buildTitle(data),
    severity: mapSeverity(data.riskLabel),
    risk: (data.riskScore ?? 0) / 100,
    merchant: String(data.merchantId ?? "Unknown"),
    amount: parseFloat(data.amount ?? 0),
    currency: data.currency ?? "INR",
    card: "0000",
    device: "Unknown",
    userId: String(data.userId ?? ""),
    reasons: (data.topFactors ?? []).map((f) => f.feature ?? f).slice(0, 3),
    riskScore: data.riskScore ?? 0,
    riskLabel: data.riskLabel ?? "low",
    topFactors: data.topFactors ?? [],
    shap: data.shap ?? null,
    lime: data.lime ?? null,
    isHistorical: false,
  };
}

function mapSeverity(label) {
  const map = {
    critical: "critical",
    high: "high",
    medium: "medium",
    low: "low",
  };
  return map[label?.toLowerCase()] ?? "low";
}

function buildTitle(data) {
  const label = data.riskLabel?.toUpperCase() ?? "LOW";
  const score = data.riskScore ?? 0;
  if (label === "CRITICAL") return `Critical fraud detected — score ${score}`;
  if (label === "HIGH") return `High risk transaction — score ${score}`;
  if (label === "MEDIUM") return `Suspicious activity — score ${score}`;
  return `Transaction scored — score ${score}`;
}

function buildTitleFromLabel(label, score) {
  if (label === "critical") return `Critical fraud detected — score ${score}`;
  if (label === "high") return `High risk transaction — score ${score}`;
  if (label === "medium") return `Suspicious activity — score ${score}`;
  return `Transaction scored — score ${score}`;
}
