/**
 * liveData.js — Live Monitoring mock data + SSE simulation hook
 *
 * In production: replace useLiveStream() with real SSE from
 * GET /api/stream/transactions?token=JWT
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Reason tag types ────────────────────────────────────── */
export const REASON_META = {
  velocity: { label: "Velocity", color: "#F43F5E" },
  geo: { label: "Geo Anomaly", color: "#F59E0B" },
  device: { label: "New Device", color: "#8B5CF6" },
  amount: { label: "Amt Spike", color: "#22D3EE" },
  merchant: { label: "Risky Merch", color: "#F59E0B" },
  behavioral: { label: "Behavioral", color: "#22D3EE" },
  hour: { label: "Odd Hour", color: "#8B5CF6" },
};

/* ── Initial events pool ─────────────────────────────────── */
const INITIAL_EVENTS = [
  {
    id: "ev-001",
    severity: "critical",
    risk: 0.97,
    label: "HIGH",
    title: "Velocity fraud — 9 txns/5min",
    merchant: "CryptoFast Exchange",
    amount: 4200,
    currency: "USD",
    card: "4532",
    device: "unknown-8f3c",
    userId: "USR-4421",
    reasons: ["velocity", "device"],
    ts: new Date(Date.now() - 1.1 * 60000).toISOString(),
    isNew: true,
  },
  {
    id: "ev-002",
    severity: "high",
    risk: 0.89,
    label: "HIGH",
    title: "Geo-impossible — 4,200km in 8min",
    merchant: "QuickCash ATM Co.",
    amount: 980,
    currency: "USD",
    card: "7891",
    device: "dev-2d9a",
    userId: "USR-8830",
    reasons: ["geo"],
    ts: new Date(Date.now() - 4.4 * 60000).toISOString(),
    isNew: false,
  },
  {
    id: "ev-003",
    severity: "high",
    risk: 0.83,
    label: "HIGH",
    title: "New device + spending deviation ×4.2",
    merchant: "GlobalBet Gaming",
    amount: 2750,
    currency: "USD",
    card: "3344",
    device: "dev-6e1b",
    userId: "USR-1102",
    reasons: ["device", "amount", "merchant"],
    ts: new Date(Date.now() - 11.8 * 60000).toISOString(),
    isNew: false,
  },
  {
    id: "ev-004",
    severity: "medium",
    risk: 0.64,
    label: "MEDIUM",
    title: "Unusual transaction hour — 3:42 AM",
    merchant: "NightShift Retail",
    amount: 340,
    currency: "USD",
    card: "9912",
    device: "dev-0c7f",
    userId: "USR-5509",
    reasons: ["hour", "behavioral"],
    ts: new Date(Date.now() - 18.2 * 60000).toISOString(),
    isNew: false,
  },
  {
    id: "ev-005",
    severity: "medium",
    risk: 0.61,
    label: "MEDIUM",
    title: "Risky merchant — elevated category score",
    merchant: "VeloTransfer LLC",
    amount: 1100,
    currency: "USD",
    card: "5567",
    device: "dev-a4b1",
    userId: "USR-7734",
    reasons: ["merchant", "amount"],
    ts: new Date(Date.now() - 24.5 * 60000).toISOString(),
    isNew: false,
  },
  {
    id: "ev-006",
    severity: "low",
    risk: 0.38,
    label: "LOW",
    title: "Minor behavioral deviation — low confidence",
    merchant: "SafePay Grocery",
    amount: 89,
    currency: "USD",
    card: "2211",
    device: "dev-f3c2",
    userId: "USR-3318",
    reasons: ["behavioral"],
    ts: new Date(Date.now() - 31.0 * 60000).toISOString(),
    isNew: false,
  },
  {
    id: "ev-007",
    severity: "low",
    risk: 0.29,
    label: "LOW",
    title: "Slightly elevated amount — within review range",
    merchant: "Retail Plus Store",
    amount: 210,
    currency: "USD",
    card: "8843",
    device: "dev-c9d5",
    userId: "USR-9921",
    reasons: ["amount"],
    ts: new Date(Date.now() - 38.7 * 60000).toISOString(),
    isNew: false,
  },
];

/* ── New event generator (simulates SSE) ─────────────────── */
const MERCHANTS = [
  "CryptoFast Exchange",
  "QuickCash ATM Co.",
  "GlobalBet Gaming",
  "NightShift Retail",
  "SafePay Grocery",
];
const REASON_KEYS = Object.keys(REASON_META);
const SEVERITIES = ["critical", "high", "high", "medium", "medium", "low"];

let _evCounter = 100;

function generateEvent() {
  const sev = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const risk =
    sev === "critical"
      ? 0.9 + Math.random() * 0.09
      : sev === "high"
        ? 0.7 + Math.random() * 0.19
        : sev === "medium"
          ? 0.4 + Math.random() * 0.29
          : 0.15 + Math.random() * 0.24;

  const reasons = REASON_KEYS.filter(() => Math.random() > 0.65).slice(0, 3);
  if (!reasons.length) reasons.push(REASON_KEYS[0]);

  const titles = {
    critical: [
      "Velocity fraud detected",
      "Multi-card attack pattern",
      "Card-not-present fraud",
    ],
    high: [
      "Geo-anomaly flagged",
      "Suspicious device switch",
      "Spending spike detected",
    ],
    medium: [
      "Behavioral deviation noted",
      "Odd-hour transaction",
      "Risky merchant flagged",
    ],
    low: ["Minor amount variance", "Low-risk flag", "Informational review"],
  };
  const titleArr = titles[sev] ?? titles.low;

  _evCounter++;
  return {
    id: `ev-${_evCounter}`,
    severity: sev,
    risk: +risk.toFixed(3),
    label: sev === "low" ? "LOW" : sev === "medium" ? "MEDIUM" : "HIGH",
    title: titleArr[Math.floor(Math.random() * titleArr.length)],
    merchant: MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)],
    amount: Math.floor(100 + Math.random() * 4900),
    currency: "USD",
    card: String(1000 + Math.floor(Math.random() * 8999)),
    device: `dev-${Math.random().toString(36).slice(2, 6)}`,
    userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    reasons,
    ts: new Date().toISOString(),
    isNew: true,
  };
}

/* ── useLiveStream hook ──────────────────────────────────── */
/**
 * Simulates SSE. In production:
 *   const es = new EventSource(`/api/stream/transactions?token=${jwt}`);
 *   es.onmessage = (e) => { const event = JSON.parse(e.data); ... }
 */
export function useLiveStream() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [connected, _setConnected] = useState(true);
  const [newIds, setNewIds] = useState(new Set(["ev-001"]));
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const intervalRef = useRef(null);

  // Keep ref in sync with paused state — safe pattern to avoid stale closure
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Simulate incoming events every 6–14 seconds
  useEffect(() => {
    intervalRef.current = setInterval(
      () => {
        if (pausedRef.current) return;

        const newEvent = generateEvent();
        setEvents((prev) => [newEvent, ...prev].slice(0, 50));
        setNewIds((prev) => new Set([...prev, newEvent.id]));

        // Clear new highlight after 2.5s
        setTimeout(() => {
          setNewIds((prev) => {
            const n = new Set(prev);
            n.delete(newEvent.id);
            return n;
          });
        }, 2500);
      },
      6000 + Math.random() * 8000,
    );

    return () => clearInterval(intervalRef.current);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  // Stats derived from events
  const stats = {
    critical: events.filter((e) => e.severity === "critical").length,
    high: events.filter((e) => e.severity === "high").length,
    medium: events.filter((e) => e.severity === "medium").length,
    total: events.length,
    lastUpdate: events[0]?.ts ?? new Date().toISOString(),
  };

  return { events, newIds, connected, paused, togglePause, stats };
}

/* ── Activity timeline entries ───────────────────────────── */
export const TIMELINE_ENTRIES = [
  {
    id: "t1",
    type: "fraud",
    msg: "Transaction TXN-8F3C blocked — velocity fraud",
    ts: "2 min ago",
    color: "#F43F5E",
  },
  {
    id: "t2",
    type: "alert",
    msg: "Geo-impossible flag raised for USR-8830",
    ts: "4 min ago",
    color: "#F43F5E",
  },
  {
    id: "t3",
    type: "review",
    msg: "TXN-6E1B added to analyst review queue",
    ts: "12 min ago",
    color: "#F59E0B",
  },
  {
    id: "t4",
    type: "model",
    msg: "XGBoost inference completed — 47 transactions",
    ts: "15 min ago",
    color: "#22D3EE",
  },
  {
    id: "t5",
    type: "review",
    msg: "Analyst marked TXN-3A11 as confirmed fraud",
    ts: "21 min ago",
    color: "#F59E0B",
  },
  {
    id: "t6",
    type: "system",
    msg: "BullMQ queue depth normalised — 12 jobs",
    ts: "28 min ago",
    color: "#22C55E",
  },
  {
    id: "t7",
    type: "model",
    msg: "Merchant risk recalculated — CryptoFast: CRITICAL",
    ts: "35 min ago",
    color: "#8B5CF6",
  },
  {
    id: "t8",
    type: "system",
    msg: "ML service health check passed",
    ts: "42 min ago",
    color: "#22C55E",
  },
];
