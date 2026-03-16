/**
 * ActivityTimeline.jsx — Chronological activity stream
 * System heartbeat: fraud blocks, model runs, analyst actions, queue updates
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  Cpu,
  UserCheck,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { TIMELINE_ENTRIES } from "./liveData";

/* ── Entry type config ───────────────────────────────────── */
const TYPE_CONFIG = {
  fraud: {
    Icon: ShieldAlert,
    bg: "bg-[#F43F5E14]",
    border: "border-[#F43F5E33]",
  },
  alert: {
    Icon: AlertTriangle,
    bg: "bg-[#F59E0B14]",
    border: "border-[#F59E0B33]",
  },
  review: {
    Icon: UserCheck,
    bg: "bg-[#F59E0B14]",
    border: "border-[#F59E0B33]",
  },
  model: { Icon: Cpu, bg: "bg-[#22D3EE14]", border: "border-[#22D3EE33]" },
  system: {
    Icon: CheckCircle2,
    bg: "bg-[#22C55E14]",
    border: "border-[#22C55E33]",
  },
  analyst: {
    Icon: UserCheck,
    bg: "bg-[#8B5CF614]",
    border: "border-[#8B5CF633]",
  },
};

/* ── Single timeline entry ───────────────────────────────── */
function TimelineEntry({ entry, index, isLast }) {
  const cfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.system;
  const Icon = cfg.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.22 }}
      className="flex gap-3 group"
    >
      {/* Spine */}
      <div
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: 24 }}
      >
        <span
          className={cn(
            "flex w-6 h-6 rounded-lg items-center justify-center border flex-shrink-0",
            cfg.bg,
            cfg.border,
          )}
        >
          <Icon size={11} strokeWidth={1.5} style={{ color: entry.color }} />
        </span>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 bg-[#0F172A]"
            style={{ minHeight: 16 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-3">
        <p className="text-[11px] text-[#64748B] leading-snug group-hover:text-[#94A3B8] transition-colors">
          {entry.msg}
        </p>
        <span className="text-[9px] text-[#1E293B] font-mono mt-0.5 block">
          {entry.ts}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Activity Timeline panel ─────────────────────────────── */
export default function ActivityTimeline() {
  return (
    <div className="bg-[#080F1A] border border-[#1E293B] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#0F172A] bg-[#0A1220] flex-shrink-0">
        <Settings size={12} strokeWidth={1.5} className="text-[#334155]" />
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
          Activity Stream
        </span>
        <span className="ml-auto text-[9px] text-[#1E293B] font-mono">
          last 60 min
        </span>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {TIMELINE_ENTRIES.map((entry, i) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              index={i}
              isLast={i === TIMELINE_ENTRIES.length - 1}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
