/**
 * useSSE.js — Real SSE connection to /api/stream/transactions
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../utils/constants";

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
  const connectRef = useRef(null); // holds latest connect fn to avoid stale closure

  useEffect(() => {
    maxEventsRef.current = maxEvents;
  }, [maxEvents]);

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
      // Use ref to call reconnect — avoids self-reference in useCallback
      reconnectRef.current = setTimeout(() => {
        reconnectRef.current = null;
        if (connectRef.current) connectRef.current();
      }, 3000);
    };
  }, []);

  // Keep connectRef pointing to latest connectSSE
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

function mapSSEEvent(data) {
  return {
    id: `TXN-${data.transactionId}`,
    ts: data.timestamp ?? new Date().toISOString(),
    title: buildTitle(data),
    severity: mapSeverity(data.riskLabel),
    risk: (data.riskScore ?? 0) / 100,
    merchant: String(data.merchantId ?? "Unknown"),
    amount: parseFloat(data.amount ?? 0),
    card: "0000",
    device: "Unknown",
    userId: String(data.userId ?? ""),
    reasons: (data.topFactors ?? []).map((f) => f.feature ?? f).slice(0, 3),
    riskScore: data.riskScore ?? 0,
    riskLabel: data.riskLabel ?? "low",
    topFactors: data.topFactors ?? [],
    shap: data.shap ?? null,
    lime: data.lime ?? null,
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
