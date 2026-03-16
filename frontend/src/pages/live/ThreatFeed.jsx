/**
 * ThreatFeed.jsx — Primary live threat feed
 * Severity-coded rows, SSE flash on arrival, reason tags, selection highlight
 */

import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";
import { LiveDot } from "../../motion";
import { cn } from "../../utils/cn";
import { REASON_META } from "./liveData";

/* ── Severity config ─────────────────────────────────────── */
const SEV = {
  critical: {
    border: "border-l-[#F43F5E]",
    bg: "bg-[#F43F5E0A]",
    bgHover: "hover:bg-[#F43F5E0E]",
    text: "#F43F5E",
    badge: "bg-[#F43F5E1A] text-[#F43F5E] border-[#F43F5E44]",
    Icon: ShieldAlert,
    label: "CRITICAL",
    glow: "shadow-[inset_3px_0_0_#F43F5E]",
  },
  high: {
    border: "border-l-[#F43F5E]",
    bg: "bg-transparent",
    bgHover: "hover:bg-[#F43F5E06]",
    text: "#F43F5E",
    badge: "bg-[#F43F5E14] text-[#F43F5E] border-[#F43F5E33]",
    Icon: AlertTriangle,
    label: "HIGH",
    glow: "",
  },
  medium: {
    border: "border-l-[#F59E0B]",
    bg: "bg-transparent",
    bgHover: "hover:bg-[#F59E0B05]",
    text: "#F59E0B",
    badge: "bg-[#F59E0B14] text-[#F59E0B] border-[#F59E0B33]",
    Icon: AlertTriangle,
    label: "MED",
    glow: "",
  },
  low: {
    border: "border-l-[#334155]",
    bg: "bg-transparent",
    bgHover: "hover:bg-[#FFFFFF04]",
    text: "#475569",
    badge: "bg-[#33415514] text-[#64748B] border-[#33415533]",
    Icon: Info,
    label: "LOW",
    glow: "",
  },
};

/* ── Reason chip ─────────────────────────────────────────── */
function ReasonChip({ reason }) {
  const meta = REASON_META[reason] ?? { label: reason, color: "#475569" };
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold
                  uppercase tracking-wide border"
      style={{
        color: meta.color,
        backgroundColor: `${meta.color}10`,
        borderColor: `${meta.color}28`,
      }}
    >
      {meta.label}
    </span>
  );
}

/* ── Risk score bar ──────────────────────────────────────── */
function MiniRiskBar({ score, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  );
}

/* ── Single feed row ─────────────────────────────────────── */
function FeedRow({ event, isNew, isSelected, onSelect }) {
  const s = SEV[event.severity] ?? SEV.low;
  const Icon = s.Icon;
  const isCritical = event.severity === "critical";

  let timeAgo = "—";
  try {
    timeAgo = formatDistanceToNow(new Date(event.ts), { addSuffix: true });
  } catch {
    /* noop */
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10, backgroundColor: `${s.text}12` }}
      animate={{
        opacity: 1,
        x: 0,
        backgroundColor: isSelected
          ? `${s.text}08`
          : isNew
            ? `${s.text}06`
            : "rgba(0,0,0,0)",
      }}
      exit={{ opacity: 0, x: 8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => onSelect(event)}
      className={cn(
        "flex gap-3 px-4 py-3.5 border-l-2 border-b border-b-[#090F1C] cursor-pointer",
        "transition-colors duration-150",
        s.border,
        s.bg,
        s.bgHover,
        s.glow,
        isSelected && "ring-inset ring-1 ring-[#22D3EE22]",
      )}
    >
      {/* Severity icon */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
        <Icon size={14} strokeWidth={1.5} style={{ color: s.text }} />
        {isCritical && <LiveDot urgency="urgent" size={6} />}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: title + badge */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p
            className={cn(
              "text-xs font-semibold leading-snug",
              isCritical ? "text-[#F8FAFC]" : "text-[#CBD5E1]",
            )}
          >
            {event.title}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isNew && (
              <span
                className="text-[8px] font-bold px-1.5 py-0.5 rounded
                                bg-[#22D3EE18] text-[#22D3EE] border border-[#22D3EE33] uppercase tracking-widest"
              >
                NEW
              </span>
            )}
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                s.badge,
              )}
            >
              {s.label}
            </span>
          </div>
        </div>

        {/* Row 2: merchant + amount */}
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-[10px] text-[#475569] truncate max-w-[140px]">
            {event.merchant}
          </span>
          <span className="text-[10px] font-semibold font-mono text-[#94A3B8]">
            ${event.amount.toLocaleString()}
          </span>
          <span className="text-[9px] font-mono text-[#334155]">
            ···· {event.card}
          </span>
        </div>

        {/* Row 3: reason chips + risk bar + time */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.reasons.map((r) => (
            <ReasonChip key={r} reason={r} />
          ))}
          <div className="ml-auto flex items-center gap-3">
            <MiniRiskBar score={event.risk} color={s.text} />
            <span className="text-[9px] text-[#334155]">{timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Filter tabs ─────────────────────────────────────────── */
const FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

/* ── Threat Feed panel ───────────────────────────────────── */
export default function ThreatFeed({ events, newIds, selectedId, onSelect }) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? events : events.filter((e) => e.severity === filter);

  const counts = {
    all: events.length,
    critical: events.filter((e) => e.severity === "critical").length,
    high: events.filter((e) => e.severity === "high").length,
    medium: events.filter((e) => e.severity === "medium").length,
    low: events.filter((e) => e.severity === "low").length,
  };

  return (
    <div className="flex flex-col h-full bg-[#080F1A] border border-[#1E293B] rounded-xl overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0F172A] bg-[#0A1220] flex-shrink-0">
        <div className="flex items-center gap-2">
          <LiveDot urgency="urgent" size={8} />
          <span className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
            Threat Feed
          </span>
          <span
            className="text-[10px] font-mono text-[#22D3EE] bg-[#22D3EE14]
                            border border-[#22D3EE28] rounded px-1.5 py-0.5"
          >
            {events.length}
          </span>
        </div>
        <span className="text-[10px] text-[#334155]">
          Click row to investigate
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-0 border-b border-[#0A1220] overflow-x-auto flex-shrink-0 bg-[#080F1A]">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const cnt = counts[f.key];
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2.5 flex-shrink-0",
                "text-[10px] font-semibold uppercase tracking-wide transition-colors",
                isActive
                  ? "text-[#22D3EE]"
                  : "text-[#334155] hover:text-[#64748B]",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "text-[9px] px-1 rounded font-bold",
                  isActive
                    ? "bg-[#22D3EE18] text-[#22D3EE]"
                    : "bg-[#1E293B] text-[#475569]",
                )}
              >
                {cnt}
              </span>
              {isActive && (
                <motion.span
                  layoutId="feed-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22D3EE] rounded-t-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Feed rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-[#22C55E0A] border border-[#22C55E20]
                            flex items-center justify-center"
            >
              <Info size={18} strokeWidth={1} className="text-[#22C55E]" />
            </div>
            <p className="text-xs text-[#334155]">No {filter} events</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((ev, _i) => (
              <FeedRow
                key={ev.id}
                event={ev}
                isNew={newIds.has(ev.id)}
                isSelected={selectedId === ev.id}
                onSelect={onSelect}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
