/**
 * emptyStates.jsx — FraudEye Contextual Empty & No-Result States
 *
 * Every state is page-specific — never generic.
 * Imports: import { NoThreats, NoTransactions, ... } from '../components/feedback'
 */

import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeftRight,
  Bell,
  BrainCircuit,
  ScrollText,
  Lightbulb,
  Search,
  Filter,
  SlidersHorizontal,
  ClipboardCheck,
  BarChart2,
  Settings2,
  Radio,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../utils/cn";

/* ════════════════════════════════════════════════════════════
   BASE EMPTY STATE
   ════════════════════════════════════════════════════════════ */
export function EmptyState({
  icon: _Icon = Inbox,
  iconColor = "#334155",
  title = "Nothing here yet",
  message,
  action,
  compact = false,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-10 px-4" : "py-16 px-6",
        className,
      )}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center border mb-4"
        style={{
          background: `${iconColor}0A`,
          borderColor: `${iconColor}20`,
        }}
      >
        <_Icon size={22} strokeWidth={1} style={{ color: iconColor }} />
      </div>

      {/* Text */}
      <p className="text-sm font-semibold text-[#475569] mb-1">{title}</p>
      {message && (
        <p className="text-xs text-[#334155] max-w-xs leading-relaxed">
          {message}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE-SPECIFIC EMPTY STATES
   ════════════════════════════════════════════════════════════ */

/* ── No active threats (Live Monitoring / Alerts) ── */
export function NoThreats({ compact = false }) {
  return (
    <EmptyState
      icon={ShieldCheck}
      iconColor="#22C55E"
      title="All clear — no active threats"
      message="No suspicious activity has been detected in the current monitoring window. The system is watching."
      compact={compact}
    />
  );
}

/* ── No transactions ── */
export function NoTransactions({ compact = false, onReset }) {
  return (
    <EmptyState
      icon={ArrowLeftRight}
      iconColor="#22D3EE"
      title="No transactions yet"
      message="Transactions will appear here as they are processed through the detection pipeline."
      compact={compact}
      action={
        onReset && <ResetButton onClick={onReset} label="Clear filters" />
      }
    />
  );
}

/* ── No alerts ── */
export function NoAlerts({ compact = false }) {
  return (
    <EmptyState
      icon={Bell}
      iconColor="#22C55E"
      title="No alerts in this view"
      message="No alerts match the current severity or status filters. Try adjusting your filters or check back later."
      compact={compact}
    />
  );
}

/* ── No explanation selected ── */
export function NoExplanationSelected() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center"
    >
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-14 h-14 rounded-2xl bg-[#8B5CF60A] border border-[#8B5CF620] flex items-center justify-center"
      >
        <BrainCircuit size={24} strokeWidth={1} className="text-[#8B5CF644]" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-[#334155]">
          Select a case to investigate
        </p>
        <p className="text-xs text-[#1E293B] mt-1 max-w-xs leading-relaxed">
          Choose a transaction from the case list to view its full SHAP
          explanation and fraud drivers.
        </p>
      </div>
    </motion.div>
  );
}

/* ── No audit logs ── */
export function NoAuditLogs({ compact = false, onReset }) {
  return (
    <EmptyState
      icon={ScrollText}
      iconColor="#22D3EE"
      title="No audit entries found"
      message="No log entries match the current filters. Try broadening your search or adjusting the date range."
      compact={compact}
      action={
        onReset && <ResetButton onClick={onReset} label="Clear filters" />
      }
    />
  );
}

/* ── No AI insights ── */
export function NoInsights({ compact = false }) {
  return (
    <EmptyState
      icon={Lightbulb}
      iconColor="#8B5CF6"
      title="No insights available"
      message="The AI model has not generated any pattern-level insights yet. Insights appear after sufficient transaction volume."
      compact={compact}
    />
  );
}

/* ── No items in analyst review queue ── */
export function NoQueueItems({ compact = false }) {
  return (
    <EmptyState
      icon={ClipboardCheck}
      iconColor="#22C55E"
      title="Review queue is empty"
      message="All cases have been resolved. No transactions are currently awaiting analyst review."
      compact={compact}
    />
  );
}

/* ── No chart data ── */
export function NoChartData({ title = "No chart data", compact = false }) {
  return (
    <EmptyState
      icon={BarChart2}
      iconColor="#22D3EE"
      title={title}
      message="Data will appear here once the system has processed enough transactions."
      compact={compact}
    />
  );
}

/* ── Stream idle (Live Monitoring paused / no activity) ── */
export function StreamIdle({ paused = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <motion.div
        animate={paused ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="w-12 h-12 rounded-2xl bg-[#33415514] border border-[#33415533] flex items-center justify-center"
      >
        <Radio size={20} strokeWidth={1} className="text-[#475569]" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-[#475569]">
          {paused ? "Stream paused" : "Waiting for events"}
        </p>
        <p className="text-xs text-[#334155] mt-1">
          {paused
            ? "Resume the stream to see incoming fraud events in real time."
            : "No new events have arrived. The system is actively monitoring."}
        </p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   NO-RESULT / FILTERED-EMPTY STATES
   ════════════════════════════════════════════════════════════ */

/* ── NoSearchResults ── */
export function NoSearchResults({ query, onReset, compact = false }) {
  return (
    <EmptyState
      icon={Search}
      iconColor="#475569"
      title="No results found"
      message={
        query
          ? `No records match "${query}". Try a different search term or clear your search.`
          : "No records match your current search. Try a different term."
      }
      compact={compact}
      action={onReset && <ResetButton onClick={onReset} label="Clear search" />}
    />
  );
}

/* ── NoFilterResults ── */
export function NoFilterResults({ filterLabel, onReset, compact = false }) {
  return (
    <EmptyState
      icon={SlidersHorizontal}
      iconColor="#475569"
      title="No results for this filter"
      message={
        filterLabel
          ? `No records match the "${filterLabel}" filter. Try a different filter combination.`
          : "No records match the current filters. Try adjusting or resetting your filters."
      }
      compact={compact}
      action={
        onReset && <ResetButton onClick={onReset} label="Reset filters" />
      }
    />
  );
}

/* ── Inline filter empty (compact, for table body) ── */
export function InlineFilterEmpty({ colSpan = 7, onReset }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-14 text-center">
        <div className="flex flex-col items-center gap-3">
          <Filter size={18} strokeWidth={1} className="text-[#334155]" />
          <p className="text-xs font-medium text-[#475569]">
            No results for current filters
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="text-[11px] text-[#22D3EE] hover:text-[#22D3EEcc] transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ════════════════════════════════════════════════════════════
   SHARED HELPERS
   ════════════════════════════════════════════════════════════ */

function ResetButton({ onClick, label = "Reset" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                  text-xs font-medium transition-colors duration-150
                  text-[#22D3EE] border-[#22D3EE33] bg-[#22D3EE0A]
                  hover:bg-[#22D3EE14] hover:border-[#22D3EE55]"
    >
      <RefreshCw size={11} strokeWidth={1.5} />
      {label}
    </motion.button>
  );
}
