/**
 * XAI.jsx — FraudEye Explainable AI Components
 *
 * Exports:
 *   ExplanationSummary   — top-level SHAP/LIME summary block
 *   ContributionBar      — horizontal feature contribution bar (pos/neg)
 *   FraudDriverChip      — top contributing feature pill
 *   ConfidenceBox        — model confidence display
 *   RecommendationBox    — analyst action recommendation
 *   ExplanationMetaRow   — key/value metadata row for explanation context
 *   FeatureTable         — ranked feature importance table
 *
 * Design intent:
 *   - Readable for both technical analysts and business reviewers
 *   - Positive contributions → red (push toward fraud)
 *   - Negative contributions → emerald (push toward safe)
 *   - Neutral → muted gray
 */

import { motion } from "framer-motion";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { cn } from "../../utils/cn";

/* ── ContributionBar ─────────────────────────────────────── */
export function ContributionBar({
  feature,
  value,
  maxAbs = 1,
  rank,
  className = "",
  animate = true,
  stagger = 0,
}) {
  const isPositive = value >= 0; // pushes toward fraud
  const pct = (Math.abs(value) / Math.max(maxAbs, 0.001)) * 100;
  const barColor = isPositive ? "#F43F5E" : "#22C55E";
  const valDisplay = (value >= 0 ? "+" : "") + value.toFixed(4);

  return (
    <motion.div
      initial={animate ? { opacity: 0, x: -6 } : undefined}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: stagger * 0.04 }}
      className={cn("flex items-center gap-3 group", className)}
    >
      {/* Rank */}
      {rank != null && (
        <span className="text-[10px] font-mono text-[#334155] w-4 flex-shrink-0 text-right">
          {rank}
        </span>
      )}

      {/* Feature name */}
      <span
        className="text-[11px] text-[#94A3B8] w-36 flex-shrink-0 truncate font-medium"
        title={feature}
      >
        {feature}
      </span>

      {/* Bar track */}
      <div className="flex-1 relative h-5 flex items-center">
        <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 0.5,
              delay: stagger * 0.04 + 0.1,
              ease: "easeOut",
            }}
          />
        </div>
      </div>

      {/* Value */}
      <span
        className="text-[11px] font-mono font-semibold w-16 text-right flex-shrink-0"
        style={{ color: barColor }}
      >
        {valDisplay}
      </span>

      {/* Direction icon */}
      <span style={{ color: barColor }} className="flex-shrink-0">
        {isPositive ? (
          <TrendingUp size={11} strokeWidth={2} />
        ) : (
          <TrendingDown size={11} strokeWidth={2} />
        )}
      </span>
    </motion.div>
  );
}

/* ── ExplanationSummary ──────────────────────────────────── */
export function ExplanationSummary({
  label, // 'HIGH' | 'MEDIUM' | 'LOW'
  score, // 0–1
  topFeatures, // string[]
  method = "SHAP",
  className = "",
}) {
  const isHigh = label === "HIGH" || score >= 0.7;
  const isMed = label === "MEDIUM" || (score >= 0.4 && score < 0.7);
  const color = isHigh ? "#F43F5E" : isMed ? "#F59E0B" : "#22C55E";
  const Icon = isHigh ? ShieldAlert : isMed ? AlertTriangle : ShieldCheck;
  const verdict = isHigh
    ? "Likely Fraud"
    : isMed
      ? "Review Required"
      : "Likely Legitimate";

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex gap-4",
        isHigh
          ? "bg-[#F43F5E08] border-[#F43F5E22]"
          : isMed
            ? "bg-[#F59E0B08] border-[#F59E0B22]"
            : "bg-[#22C55E08] border-[#22C55E22]",
        className,
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <span
          className="flex w-10 h-10 rounded-xl items-center justify-center border"
          style={{ background: `${color}14`, borderColor: `${color}30` }}
        >
          <Icon size={18} strokeWidth={1.5} style={{ color }} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold" style={{ color }}>
            {verdict}
          </span>
          <span
            className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border"
            style={{
              color,
              background: `${color}10`,
              borderColor: `${color}25`,
            }}
          >
            {(score * 100).toFixed(1)}%
          </span>
          <span className="text-[9px] text-[#334155] font-semibold uppercase tracking-wider">
            via {method}
          </span>
        </div>

        {topFeatures?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] text-[#334155] mr-1">
              Top drivers:
            </span>
            {topFeatures.slice(0, 4).map((f) => (
              <FraudDriverChip key={f} label={f} color={color} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── FraudDriverChip ─────────────────────────────────────── */
export function FraudDriverChip({ label, color = "#F43F5E", className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold",
        className,
      )}
      style={{ color, background: `${color}10`, borderColor: `${color}25` }}
    >
      <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
      {label}
    </span>
  );
}

/* ── ConfidenceBox ───────────────────────────────────────── */
export function ConfidenceBox({ confidence, modelVersion, className = "" }) {
  const pct = Math.round((confidence ?? 0) * 100);
  const color = pct >= 80 ? "#F43F5E" : pct >= 50 ? "#F59E0B" : "#22C55E";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-[#080F1A] border-[#0F172A]",
        className,
      )}
    >
      <BrainCircuit
        size={16}
        strokeWidth={1.5}
        className="text-[#8B5CF6] flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#475569] font-medium mb-0.5">
          Model Confidence
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold font-mono" style={{ color }}>
            {pct}%
          </span>
          {modelVersion && (
            <span className="text-[10px] font-mono text-[#334155]">
              {modelVersion}
            </span>
          )}
        </div>
      </div>
      {/* Confidence ring mini */}
      <div className="relative flex-shrink-0" style={{ width: 32, height: 32 }}>
        <svg width={32} height={32} className="-rotate-90">
          <circle
            cx={16}
            cy={16}
            r={12}
            fill="none"
            stroke="#0F172A"
            strokeWidth={3}
          />
          <motion.circle
            cx={16}
            cy={16}
            r={12}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={75.4}
            initial={{ strokeDashoffset: 75.4 }}
            animate={{ strokeDashoffset: 75.4 * (1 - (confidence ?? 0)) }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}

/* ── RecommendationBox ───────────────────────────────────── */
const REC_STYLES = {
  block: {
    color: "#F43F5E",
    bg: "bg-[#F43F5E08]",
    border: "border-[#F43F5E22]",
    icon: ShieldAlert,
    label: "Block Transaction",
  },
  review: {
    color: "#F59E0B",
    bg: "bg-[#F59E0B08]",
    border: "border-[#F59E0B22]",
    icon: AlertTriangle,
    label: "Manual Review",
  },
  approve: {
    color: "#22C55E",
    bg: "bg-[#22C55E08]",
    border: "border-[#22C55E22]",
    icon: ShieldCheck,
    label: "Approve Transaction",
  },
  monitor: {
    color: "#22D3EE",
    bg: "bg-[#22D3EE08]",
    border: "border-[#22D3EE22]",
    icon: BrainCircuit,
    label: "Monitor Pattern",
  },
};

export function RecommendationBox({ type = "review", reason, className = "" }) {
  const s = REC_STYLES[type] ?? REC_STYLES.review;
  const Icon = s.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 flex gap-3",
        s.bg,
        s.border,
        className,
      )}
    >
      <Icon
        size={15}
        strokeWidth={1.5}
        style={{ color: s.color }}
        className="flex-shrink-0 mt-0.5"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold" style={{ color: s.color }}>
          {s.label}
        </p>
        {reason && (
          <p className="text-[11px] text-[#475569] mt-0.5 leading-snug">
            {reason}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── ExplanationMetaRow ──────────────────────────────────── */
export function ExplanationMetaRow({ label, value, mono, className = "" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2 border-b border-[#0A1628] last:border-0",
        className,
      )}
    >
      <span className="text-[11px] text-[#475569] flex-shrink-0">{label}</span>
      <span
        className={cn(
          "text-[11px] text-[#94A3B8] text-right truncate",
          mono && "font-mono",
        )}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

/* ── FeatureTable ────────────────────────────────────────── */
export function FeatureTable({ features = [], maxAbs, className = "" }) {
  const max =
    maxAbs ?? Math.max(...features.map((f) => Math.abs(f.value)), 0.001);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-1 border-b border-[#0A1628]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#334155] w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#334155] w-36">
          Feature
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#334155] flex-1">
          Contribution
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#334155] w-16 text-right">
          SHAP
        </span>
        <span className="w-4" />
      </div>

      {features.map((f, i) => (
        <ContributionBar
          key={f.feature}
          feature={f.feature}
          value={f.value}
          maxAbs={max}
          rank={i + 1}
          stagger={i}
          animate
        />
      ))}
    </div>
  );
}

/* ── ExplanationSkeleton ─────────────────────────────────── */
export function ExplanationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="fe-shimmer h-20 rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="fe-shimmer h-2.5 w-4 rounded-full" />
            <div className="fe-shimmer h-2.5 w-32 rounded-full" />
            <div className="fe-shimmer h-2 flex-1 rounded-full" />
            <div className="fe-shimmer h-2.5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
