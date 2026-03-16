/**
 * States.jsx — FraudEye Feedback & Fallback Components
 *
 * Exports:
 *   EmptyState       — no data in a section (contextual variants)
 *   ErrorState       — fetch/API failure with retry
 *   LoadingSkeleton  — generic skeleton (configurable rows/shape)
 *   CardSkeleton     — skeleton shaped like a GlassCard
 *   PageLoader       — full-page loading state
 *   InlineSpinner    — tiny inline loading indicator
 *
 * Variants for EmptyState:
 *   alerts        — no active alerts
 *   transactions  — no transactions found
 *   explanation   — no transaction selected
 *   chart         — no chart data
 *   search        — no search results
 *   generic       — fallback
 */

import { motion } from "framer-motion";
import {
  Bell,
  ArrowLeftRight,
  BrainCircuit,
  BarChart2,
  Search,
  Inbox,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

/* ── EmptyState config ───────────────────────────────────── */
const EMPTY_CONFIG = {
  alerts: {
    icon: Bell,
    title: "No active alerts",
    body: "All clear — no fraud signals detected in the current window.",
    color: "#22C55E",
  },
  transactions: {
    icon: ArrowLeftRight,
    title: "No transactions found",
    body: "Try adjusting your filters or search query.",
    color: "#22D3EE",
  },
  explanation: {
    icon: BrainCircuit,
    title: "No transaction selected",
    body: "Select a transaction from the feed to view its SHAP explanation.",
    color: "#8B5CF6",
  },
  chart: {
    icon: BarChart2,
    title: "No chart data available",
    body: "Data will appear here once transactions are processed.",
    color: "#22D3EE",
  },
  search: {
    icon: Search,
    title: "No results",
    body: "No matches found. Try a different search term.",
    color: "#475569",
  },
  generic: {
    icon: Inbox,
    title: "Nothing here yet",
    body: "This section will populate as data arrives.",
    color: "#334155",
  },
};

/* ── EmptyState ──────────────────────────────────────────── */
export function EmptyState({
  variant = "generic",
  title,
  body,
  action,
  compact = false,
  className = "",
}) {
  const cfg = EMPTY_CONFIG[variant] ?? EMPTY_CONFIG.generic;
  const Icon = cfg.icon;
  const displayTitle = title ?? cfg.title;
  const displayBody = body ?? cfg.body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3",
        compact ? "py-8 px-4" : "py-16 px-6",
        className,
      )}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center border"
        style={{ background: `${cfg.color}10`, borderColor: `${cfg.color}20` }}
      >
        <Icon size={22} strokeWidth={1} style={{ color: cfg.color }} />
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-[#475569]">{displayTitle}</p>
        {displayBody && (
          <p className="text-xs text-[#334155] mt-1 max-w-xs mx-auto leading-relaxed">
            {displayBody}
          </p>
        )}
      </div>

      {/* Action */}
      {action && <div className="mt-1">{action}</div>}
    </motion.div>
  );
}

/* ── ErrorState ──────────────────────────────────────────── */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  compact = false,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3",
        compact ? "py-8 px-4" : "py-16 px-6",
        className,
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F43F5E0A] border border-[#F43F5E20] flex items-center justify-center">
        <AlertCircle size={22} strokeWidth={1} className="text-[#F43F5E]" />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#F43F5E]">{title}</p>
        {message && (
          <p className="text-xs text-[#475569] mt-1 max-w-xs mx-auto leading-relaxed font-mono">
            {message}
          </p>
        )}
      </div>

      {onRetry && (
        <Button variant="ghost" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  );
}

/* ── LoadingSkeleton ─────────────────────────────────────── */
export function LoadingSkeleton({ rows = 5, className = "" }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="fe-shimmer h-4 w-4 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div
              className="fe-shimmer h-3 rounded-full"
              style={{ width: `${55 + (i % 3) * 15}%` }}
            />
            <div className="fe-shimmer h-2.5 rounded-full w-2/5" />
          </div>
          <div className="fe-shimmer h-5 w-14 rounded-md flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

/* ── CardSkeleton ────────────────────────────────────────── */
export function CardSkeleton({ className = "" }) {
  return (
    <div
      className={cn(
        "bg-[#111827]/80 border border-[#1E293B] rounded-xl p-5 space-y-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="fe-shimmer h-3 w-28 rounded-full" />
        <div className="fe-shimmer h-7 w-7 rounded-lg" />
      </div>
      <div className="fe-shimmer h-7 w-20 rounded-full" />
      <div className="fe-shimmer h-2.5 w-16 rounded-full" />
      <div className="fe-shimmer h-10 w-full rounded-lg mt-2" />
    </div>
  );
}

/* ── PageLoader ──────────────────────────────────────────── */
export function PageLoader({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="relative w-10 h-10">
        <motion.div className="absolute inset-0 rounded-full border-2 border-[#22D3EE33]" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#22D3EE]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="text-xs text-[#334155] font-medium">{message}</p>
    </div>
  );
}

/* ── InlineSpinner ───────────────────────────────────────── */
export function InlineSpinner({
  size = 14,
  color = "#22D3EE",
  className = "",
}) {
  return (
    <Loader2
      size={size}
      strokeWidth={2}
      className={cn("animate-spin flex-shrink-0", className)}
      style={{ color }}
    />
  );
}
