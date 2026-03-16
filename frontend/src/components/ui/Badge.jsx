/**
 * Badge.jsx — FraudEye Status & Risk UI
 *
 * Exports:
 *   RiskBadge     — HIGH / MEDIUM / LOW / SAFE / REVIEW labels
 *   StatusBadge   — generic status pill (active, inactive, pending…)
 *   SeverityPill  — compact severity indicator
 *   LiveBadge     — animated "LIVE" indicator
 *   RiskBar       — horizontal mini progress bar (0–1 risk score)
 *   SeverityRing  — circular severity ring with score inside
 *   CountBadge    — numeric count pill (notifications, queue depth)
 *
 * Risk level color mapping (LOCKED):
 *   HIGH / FRAUD    → #F43F5E (danger red)
 *   MEDIUM / REVIEW → #F59E0B (amber)
 *   LOW / SAFE      → #22C55E (emerald)
 *   UNKNOWN         → #475569 (muted)
 */

import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/* ── Risk config ─────────────────────────────────────────── */
// eslint-disable-next-line react-refresh/only-export-components
export const RISK_CONFIG = {
  HIGH: {
    label: "HIGH",
    bg: "bg-[#F43F5E18]",
    text: "text-[#F43F5E]",
    border: "border-[#F43F5E33]",
    bar: "#F43F5E",
    ring: "#F43F5E",
  },
  MEDIUM: {
    label: "MEDIUM",
    bg: "bg-[#F59E0B18]",
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B33]",
    bar: "#F59E0B",
    ring: "#F59E0B",
  },
  LOW: {
    label: "LOW",
    bg: "bg-[#22C55E18]",
    text: "text-[#22C55E]",
    border: "border-[#22C55E33]",
    bar: "#22C55E",
    ring: "#22C55E",
  },
  SAFE: {
    label: "SAFE",
    bg: "bg-[#22C55E18]",
    text: "text-[#22C55E]",
    border: "border-[#22C55E33]",
    bar: "#22C55E",
    ring: "#22C55E",
  },
  REVIEW: {
    label: "REVIEW",
    bg: "bg-[#F59E0B18]",
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B33]",
    bar: "#F59E0B",
    ring: "#F59E0B",
  },
  FRAUD: {
    label: "FRAUD",
    bg: "bg-[#F43F5E18]",
    text: "text-[#F43F5E]",
    border: "border-[#F43F5E33]",
    bar: "#F43F5E",
    ring: "#F43F5E",
  },
  UNKNOWN: {
    label: "—",
    bg: "bg-[#47556918]",
    text: "text-[#475569]",
    border: "border-[#33415533]",
    bar: "#475569",
    ring: "#475569",
  },
};

function getRiskConfig(level) {
  return RISK_CONFIG[level?.toUpperCase()] ?? RISK_CONFIG.UNKNOWN;
}

/* ── RiskBadge ───────────────────────────────────────────── */
export function RiskBadge({ label, size = "sm", className = "" }) {
  const cfg = getRiskConfig(label);

  const sizes = {
    xs: "px-1.5 py-0.5 text-[9px]  rounded",
    sm: "px-2   py-0.5 text-[10px] rounded-md",
    md: "px-2.5 py-1   text-xs     rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-widest border",
        cfg.bg,
        cfg.text,
        cfg.border,
        sizes[size] ?? sizes.sm,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

/* ── StatusBadge ─────────────────────────────────────────── */
const STATUS_STYLES = {
  active: "bg-[#22C55E18] text-[#22C55E] border-[#22C55E33]",
  inactive: "bg-[#47556918] text-[#475569] border-[#33415533]",
  pending: "bg-[#F59E0B18] text-[#F59E0B] border-[#F59E0B33]",
  error: "bg-[#F43F5E18] text-[#F43F5E] border-[#F43F5E33]",
  info: "bg-[#22D3EE18] text-[#22D3EE] border-[#22D3EE33]",
  ai: "bg-[#8B5CF618] text-[#8B5CF6] border-[#8B5CF633]",
};

export function StatusBadge({
  status = "info",
  label,
  dot = true,
  className = "",
}) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.info;
  const display = label ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md",
        "text-[10px] font-semibold uppercase tracking-wide border",
        style,
        className,
      )}
    >
      {dot && (
        <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
      )}
      {display}
    </span>
  );
}

/* ── SeverityPill ────────────────────────────────────────── */
export function SeverityPill({ level, score, className = "" }) {
  const cfg = getRiskConfig(level);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 h-5 rounded-full",
        "text-[10px] font-bold border",
        cfg.bg,
        cfg.text,
        cfg.border,
        className,
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {cfg.label}
      {score != null && (
        <span className="opacity-60 font-mono">
          {(score * 100).toFixed(0)}%
        </span>
      )}
    </span>
  );
}

/* ── LiveBadge ───────────────────────────────────────────── */
export function LiveBadge({ label = "LIVE", className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md",
        "text-[10px] font-bold uppercase tracking-widest",
        "bg-[#F43F5E14] text-[#F43F5E] border border-[#F43F5E33]",
        className,
      )}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </span>
  );
}

/* ── RiskBar ─────────────────────────────────────────────── */
export function RiskBar({
  score = 0,
  label,
  showValue = true,
  height = 4,
  className = "",
  animate = true,
}) {
  const pct = Math.min(Math.max(score, 0), 1) * 100;
  const level = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";
  const color = RISK_CONFIG[level].bar;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-[11px] text-[#475569]">{label}</span>}
          {showValue && (
            <span
              className="text-[11px] font-mono font-semibold"
              style={{ color }}
            >
              {(score * 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full bg-[#0F172A] rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animate ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

/* ── SeverityRing ────────────────────────────────────────── */
export function SeverityRing({
  score = 0,
  size = 48,
  strokeWidth = 3,
  className = "",
}) {
  const level = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";
  const color = RISK_CONFIG[level].ring;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(Math.max(score, 0), 1));
  const cx = size / 2;
  const pct = Math.round(score * 100);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#0F172A"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
      <span
        className="absolute text-[10px] font-bold font-mono"
        style={{ color }}
      >
        {pct}%
      </span>
    </div>
  );
}

/* ── CountBadge ──────────────────────────────────────────── */
export function CountBadge({
  count,
  max = 99,
  color = "danger",
  className = "",
}) {
  const colors = {
    danger: "bg-[#F43F5E] text-white",
    warning: "bg-[#F59E0B] text-[#1a1000]",
    cyan: "bg-[#22D3EE] text-[#020617]",
    muted: "bg-[#334155] text-[#94A3B8]",
  };

  if (!count) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "text-[9px] font-bold leading-none min-w-[16px] h-4 px-1",
        colors[color] ?? colors.danger,
        className,
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
