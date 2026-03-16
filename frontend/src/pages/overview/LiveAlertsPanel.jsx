/**
 * LiveAlertsPanel.jsx — Live alerts preview
 * Compact threat feed with severity, reason tags, timestamps
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronRight,
  AlertTriangle,
  ShieldAlert,
  Info,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LiveDot } from "../../motion";
import { cn } from "../../utils/cn";
import { MOCK_LIVE_ALERTS } from "./overviewData";

/* ── Severity config ─────────────────────────────────────── */
const SEV = {
  critical: {
    color: "#F43F5E",
    bg: "bg-[#F43F5E0C]",
    border: "border-l-[#F43F5E]",
    Icon: ShieldAlert,
    label: "CRITICAL",
  },
  high: {
    color: "#F43F5E",
    bg: "bg-transparent",
    border: "border-l-[#F43F5E]",
    Icon: AlertTriangle,
    label: "HIGH",
  },
  medium: {
    color: "#F59E0B",
    bg: "bg-transparent",
    border: "border-l-[#F59E0B]",
    Icon: AlertTriangle,
    label: "MEDIUM",
  },
  low: {
    color: "#22D3EE",
    bg: "bg-transparent",
    border: "border-l-[#22D3EE]",
    Icon: Info,
    label: "LOW",
  },
};

/* ── Reason tag ──────────────────────────────────────────── */
const REASON_STYLES = {
  velocity: "text-[#F43F5E] bg-[#F43F5E0E] border-[#F43F5E28]",
  geo: "text-[#F59E0B] bg-[#F59E0B0E] border-[#F59E0B28]",
  device: "text-[#8B5CF6] bg-[#8B5CF60E] border-[#8B5CF628]",
  amount: "text-[#22D3EE] bg-[#22D3EE0E] border-[#22D3EE28]",
  merchant: "text-[#F59E0B] bg-[#F59E0B0E] border-[#F59E0B28]",
};

function ReasonTag({ reason }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border",
        REASON_STYLES[reason] ?? REASON_STYLES.amount,
      )}
    >
      {reason}
    </span>
  );
}

/* ── Single alert row ────────────────────────────────────── */
function AlertRow({ alert, index }) {
  const s = SEV[alert.severity] ?? SEV.medium;
  const Icon = s.Icon;

  let timeAgo = "";
  try {
    timeAgo = formatDistanceToNow(new Date(alert.timestamp), {
      addSuffix: true,
    });
  } catch {
    timeAgo = "—";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 + index * 0.06, duration: 0.25 }}
      className={cn(
        "flex gap-3 px-4 py-3 border-l-2",
        "border-b border-b-[#0A1628]",
        "hover:bg-[#FFFFFF04] transition-colors cursor-default",
        s.border,
        s.bg,
      )}
    >
      {/* Icon */}
      <span className="flex-shrink-0 mt-0.5" style={{ color: s.color }}>
        <Icon size={13} strokeWidth={1.5} />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[11px] font-semibold text-[#F8FAFC] leading-snug truncate">
            {alert.title}
          </p>
          <span
            className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider"
            style={{ color: s.color }}
          >
            {s.label}
          </span>
        </div>

        <p className="text-[10px] text-[#475569] leading-snug mb-1.5 line-clamp-1">
          {alert.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {alert.reasons.map((r) => (
            <ReasonTag key={r} reason={r} />
          ))}
          <span className="text-[9px] font-mono text-[#334155] ml-auto">
            #{alert.txnId} · {timeAgo}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Panel ───────────────────────────────────────────────── */
export default function LiveAlertsPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#F43F5E14] border border-[#F43F5E22]">
            <Bell size={14} strokeWidth={1.5} className="text-[#F43F5E]" />
          </span>
          <h3 className="fe-section-heading">Live Threat Feed</h3>
          <LiveDot urgency="urgent" size={7} />
        </div>
        <button className="flex items-center gap-1 text-[11px] text-[#334155] hover:text-[#22D3EE] transition-colors">
          View all <ChevronRight size={11} />
        </button>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-hidden rounded-xl border border-[#1E293B] bg-[#080F1A]">
        <AnimatePresence initial={false}>
          {MOCK_LIVE_ALERTS.map((alert, i) => (
            <AlertRow key={alert.id} alert={alert} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 flex items-center justify-between"
      >
        <span className="flex items-center gap-1.5 text-[10px] text-[#F43F5E]">
          <LiveDot urgency="urgent" size={6} />2 critical in last 5 min
        </span>
        <span className="text-[10px] text-[#334155]">
          Auto-refreshes every 30s
        </span>
      </motion.div>
    </div>
  );
}
