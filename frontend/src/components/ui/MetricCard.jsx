/**
 * MetricCard.jsx — FraudEye Metric & Insight Components
 *
 * Exports:
 *   MetricCard      — full KPI card with icon, value, delta, sparkline
 *   InsightCard     — AI/XAI insight summary card
 *   MiniMetricTile  — compact inline metric
 *   TrendIndicator  — delta arrow + percentage
 *   CountUp         — animated number reveal shell
 *
 * Accent variants:
 *   fraud   → red glow
 *   safe    → emerald glow
 *   review  → amber glow
 *   ai      → violet glow
 *   default → cyan glow
 */

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { cn } from "../../utils/cn";

/* ── Accent config ───────────────────────────────────────── */
const ACCENT = {
  default: {
    text: "#22D3EE",
    bg: "bg-[#22D3EE0A]",
    border: "border-[#22D3EE22]",
    glow: "shadow-[0_0_20px_#22D3EE0A]",
  },
  fraud: {
    text: "#F43F5E",
    bg: "bg-[#F43F5E0A]",
    border: "border-[#F43F5E22]",
    glow: "shadow-[0_0_20px_#F43F5E0A]",
  },
  safe: {
    text: "#22C55E",
    bg: "bg-[#22C55E0A]",
    border: "border-[#22C55E22]",
    glow: "shadow-[0_0_20px_#22C55E0A]",
  },
  review: {
    text: "#F59E0B",
    bg: "bg-[#F59E0B0A]",
    border: "border-[#F59E0B22]",
    glow: "shadow-[0_0_20px_#F59E0B0A]",
  },
  ai: {
    text: "#8B5CF6",
    bg: "bg-[#8B5CF60A]",
    border: "border-[#8B5CF622]",
    glow: "shadow-[0_0_20px_#8B5CF60A]",
  },
};

/* ── TrendIndicator ──────────────────────────────────────── */
export function TrendIndicator({
  delta,
  type = "neutral",
  size = "sm",
  className = "",
}) {
  const map = {
    up: { color: "text-[#22C55E]", Icon: TrendingUp },
    down: { color: "text-[#F43F5E]", Icon: TrendingDown },
    neutral: { color: "text-[#475569]", Icon: Minus },
  };
  const { color, Icon } = map[type] ?? map.neutral;
  const iconSize = size === "xs" ? 10 : 12;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        color,
        size === "xs" ? "text-[10px]" : "text-xs",
        className,
      )}
    >
      <Icon size={iconSize} strokeWidth={2} />
      {delta}
    </span>
  );
}

/* ── MetricCard ──────────────────────────────────────────── */
export function MetricCard({
  title,
  value,
  delta,
  deltaType = "neutral",
  icon: Icon,
  accent = "default",
  sparkData,
  loading = false,
  stagger = 0,
  className = "",
  onClick,
}) {
  const a = ACCENT[accent] ?? ACCENT.default;

  if (loading) {
    return (
      <div
        className={cn(
          "bg-[#111827]/80 border border-[#1E293B] rounded-xl p-5",
          className,
        )}
      >
        <div className="flex flex-col gap-3">
          <div className="fe-shimmer h-3 w-24 rounded-full" />
          <div className="fe-shimmer h-7 w-20 rounded-full" />
          <div className="fe-shimmer h-2.5 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  const chartData = sparkData?.map((v, i) => ({ i, v })) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: stagger * 0.06, ease: "easeOut" }}
      whileHover={
        onClick ? { y: -2, transition: { duration: 0.15 } } : undefined
      }
      onClick={onClick}
      className={cn(
        "bg-[#111827]/80 border rounded-xl p-5 flex flex-col gap-1 relative overflow-hidden",
        "transition-shadow duration-200",
        a.border,
        a.bg,
        a.glow,
        onClick && "cursor-pointer",
        className,
      )}
    >
      {/* Accent corner glow */}
      <span
        className="absolute -top-8 -left-8 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: a.text }}
      />

      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B] leading-none">
          {title}
        </p>
        {Icon && (
          <span
            className="p-1.5 rounded-lg border flex-shrink-0"
            style={{ background: `${a.text}14`, borderColor: `${a.text}33` }}
          >
            <Icon size={13} strokeWidth={1.5} style={{ color: a.text }} />
          </span>
        )}
      </div>

      {/* Value */}
      <motion.p
        key={String(value)}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold tracking-tight leading-none mt-1"
        style={{ color: a.text }}
      >
        {value ?? "—"}
      </motion.p>

      {/* Delta */}
      {delta != null && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <TrendIndicator delta={delta} type={deltaType} size="xs" />
          <span className="text-[10px] text-[#334155]">vs last period</span>
        </div>
      )}

      {/* Sparkline */}
      {chartData.length > 1 && (
        <div className="mt-3 h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 1, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={`mg-${accent}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={a.text} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={a.text} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={a.text}
                strokeWidth={1.5}
                fill={`url(#mg-${accent})`}
                dot={false}
                activeDot={{ r: 2, fill: a.text, stroke: "none" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

/* ── InsightCard ─────────────────────────────────────────── */
const INSIGHT_ICONS = {
  fraud: ShieldAlert,
  safe: ShieldCheck,
  review: AlertTriangle,
  ai: BrainCircuit,
  default: BrainCircuit,
};

export function InsightCard({
  title,
  body,
  accent = "ai",
  tag,
  confidence,
  className = "",
  stagger = 0,
}) {
  const a = ACCENT[accent] ?? ACCENT.ai;
  const Icon = INSIGHT_ICONS[accent] ?? INSIGHT_ICONS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: stagger * 0.06 }}
      className={cn(
        "bg-[#111827]/80 border rounded-xl p-4 flex gap-3",
        a.border,
        className,
      )}
    >
      {/* Icon column */}
      <div className="flex-shrink-0 pt-0.5">
        <span
          className="flex w-8 h-8 rounded-lg items-center justify-center border"
          style={{ background: `${a.text}12`, borderColor: `${a.text}30` }}
        >
          <Icon size={15} strokeWidth={1.5} style={{ color: a.text }} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-semibold text-[#F8FAFC] truncate">
            {title}
          </p>
          {tag && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border flex-shrink-0"
              style={{
                color: a.text,
                background: `${a.text}14`,
                borderColor: `${a.text}33`,
              }}
            >
              {tag}
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#64748B] leading-relaxed">{body}</p>
        {confidence != null && (
          <p className="text-[10px] font-mono mt-1.5" style={{ color: a.text }}>
            Confidence: {(confidence * 100).toFixed(1)}%
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── MiniMetricTile ──────────────────────────────────────── */
export function MiniMetricTile({
  label,
  value,
  icon: Icon,
  accent = "default",
  className = "",
}) {
  const a = ACCENT[accent] ?? ACCENT.default;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-[#080F1A]",
        "border-[#0F172A] hover:border-[#1E293B] transition-colors",
        className,
      )}
    >
      {Icon && (
        <span
          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center border"
          style={{ background: `${a.text}10`, borderColor: `${a.text}25` }}
        >
          <Icon size={13} strokeWidth={1.5} style={{ color: a.text }} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#475569] font-medium leading-none mb-1">
          {label}
        </p>
        <p
          className="text-sm font-bold tabular-nums leading-none"
          style={{ color: a.text }}
        >
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

/* ── CountUp ─────────────────────────────────────────────── */
export function CountUp({ value, prefix, suffix, color, className = "" }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("tabular-nums font-bold font-mono", className)}
      style={color ? { color } : undefined}
    >
      {prefix}
      {value}
      {suffix}
    </motion.span>
  );
}
