/**
 * Alert.jsx — FraudEye Alert & Live Feed Components
 *
 * Exports:
 *   AlertItem       — single alert row with severity, title, time, action
 *   AlertFeed       — scrollable list wrapper for alerts
 *   ReasonTag       — compact fraud reason/driver chip
 *   TimelineMarker  — vertical timeline dot + connector
 *   LivePulse       — animated breathing pulse indicator
 *   AlertSkeleton   — loading skeleton for alert items
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { formatDistanceToNow } from "date-fns";

/* ── Severity config ─────────────────────────────────────── */
const SEVERITY = {
  critical: {
    icon: ShieldAlert,
    color: "#F43F5E",
    bg: "bg-[#F43F5E0C]",
    border: "border-l-[#F43F5E]",
    badge: "bg-[#F43F5E18] text-[#F43F5E] border-[#F43F5E33]",
    label: "CRITICAL",
  },
  high: {
    icon: AlertTriangle,
    color: "#F43F5E",
    bg: "bg-[#F43F5E08]",
    border: "border-l-[#F43F5E]",
    badge: "bg-[#F43F5E18] text-[#F43F5E] border-[#F43F5E33]",
    label: "HIGH",
  },
  medium: {
    icon: AlertTriangle,
    color: "#F59E0B",
    bg: "bg-[#F59E0B08]",
    border: "border-l-[#F59E0B]",
    badge: "bg-[#F59E0B18] text-[#F59E0B] border-[#F59E0B33]",
    label: "MEDIUM",
  },
  low: {
    icon: Info,
    color: "#22D3EE",
    bg: "bg-transparent",
    border: "border-l-[#22D3EE]",
    badge: "bg-[#22D3EE18] text-[#22D3EE] border-[#22D3EE33]",
    label: "LOW",
  },
  resolved: {
    icon: CheckCircle2,
    color: "#22C55E",
    bg: "bg-transparent",
    border: "border-l-[#22C55E]",
    badge: "bg-[#22C55E18] text-[#22C55E] border-[#22C55E33]",
    label: "RESOLVED",
  },
};

function getSeverity(level) {
  return SEVERITY[level?.toLowerCase()] ?? SEVERITY.medium;
}

/* ── AlertItem ───────────────────────────────────────────── */
export function AlertItem({
  title,
  description,
  severity = "medium",
  timestamp,
  txnId,
  action,
  isNew = false,
  onClick,
  className = "",
}) {
  const sev = getSeverity(severity);
  const Icon = sev.icon;

  let timeAgo = "";
  try {
    timeAgo = timestamp
      ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
      : "";
  } catch {
    timeAgo = "";
  }

  return (
    <motion.div
      layout
      initial={
        isNew
          ? { opacity: 0, x: -8, backgroundColor: `${sev.color}10` }
          : { opacity: 0 }
      }
      animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: isNew ? 0.8 : 0.25 }}
      onClick={onClick}
      className={cn(
        "flex gap-3 px-4 py-3 border-l-2 border-b border-b-[#0A1628]",
        "transition-colors duration-100",
        sev.border,
        sev.bg,
        onClick && "cursor-pointer hover:bg-[#FFFFFF04]",
        className,
      )}
    >
      {/* Icon */}
      <span className="flex-shrink-0 mt-0.5" style={{ color: sev.color }}>
        <Icon size={15} strokeWidth={1.5} />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-[#F8FAFC] leading-snug truncate">
            {title}
          </p>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide flex-shrink-0 ${sev.badge}`}
            style={{ color: sev.color }}
          >
            {sev.label}
          </span>
        </div>

        {description && (
          <p className="text-[11px] text-[#475569] mt-0.5 leading-snug line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1.5">
          {txnId && (
            <span className="text-[10px] font-mono text-[#334155]">
              #{String(txnId).slice(0, 8).toUpperCase()}
            </span>
          )}
          {timeAgo && (
            <span className="flex items-center gap-1 text-[10px] text-[#334155]">
              <Clock size={9} />
              {timeAgo}
            </span>
          )}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      </div>
    </motion.div>
  );
}

/* ── AlertFeed ───────────────────────────────────────────── */
export function AlertFeed({
  children,
  className = "",
  maxHeight = "max-h-[420px]",
}) {
  return (
    <div
      className={cn(
        "overflow-y-auto rounded-xl border border-[#1E293B] bg-[#080F1A]",
        maxHeight,
        className,
      )}
    >
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
}

/* ── ReasonTag ───────────────────────────────────────────── */
const REASON_COLORS = {
  velocity: "bg-[#F43F5E14] text-[#F43F5E] border-[#F43F5E33]",
  geo: "bg-[#F59E0B14] text-[#F59E0B] border-[#F59E0B33]",
  device: "bg-[#8B5CF614] text-[#8B5CF6] border-[#8B5CF633]",
  amount: "bg-[#F43F5E14] text-[#F43F5E] border-[#F43F5E33]",
  merchant: "bg-[#F59E0B14] text-[#F59E0B] border-[#F59E0B33]",
  behavioral: "bg-[#22D3EE14] text-[#22D3EE] border-[#22D3EE33]",
  time: "bg-[#8B5CF614] text-[#8B5CF6] border-[#8B5CF633]",
  default: "bg-[#33415514] text-[#94A3B8] border-[#33415533]",
};

export function ReasonTag({ label, type = "default", className = "" }) {
  const style = REASON_COLORS[type] ?? REASON_COLORS.default;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md",
        "text-[10px] font-semibold uppercase tracking-wide border",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}

/* ── TimelineMarker ──────────────────────────────────────── */
export function TimelineMarker({
  children,
  color = "#334155",
  isLast = false,
  isFirst = false,
  size = 8,
}) {
  return (
    <div className="flex gap-3">
      {/* Spine */}
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: size }}
      >
        <div
          className="rounded-full flex-shrink-0 border-2"
          style={{
            width: size,
            height: size,
            borderColor: color,
            backgroundColor: isFirst ? color : "transparent",
          }}
        />
        {!isLast && (
          <div
            className="flex-1 w-px mt-1"
            style={{ backgroundColor: "#0F172A", minHeight: 24 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">{children}</div>
    </div>
  );
}

/* ── LivePulse ───────────────────────────────────────────── */
export function LivePulse({ color = "#22C55E", size = 8, className = "" }) {
  return (
    <span
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 rounded-full opacity-75"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative rounded-full inline-flex"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

/* ── AlertSkeleton ───────────────────────────────────────── */
export function AlertSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 px-4 py-3 border-l-2 border-l-[#1E293B] border-b border-b-[#0A1628]"
        >
          <div className="fe-shimmer w-4 h-4 rounded-full flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="fe-shimmer h-3 rounded-full w-3/4" />
            <div className="fe-shimmer h-2.5 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
