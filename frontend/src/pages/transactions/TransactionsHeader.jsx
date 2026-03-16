import { motion } from "framer-motion";
import {
  Database,
  AlertTriangle,
  Clock,
  CheckCircle,
  Wifi,
} from "lucide-react";
import { STAGGER } from "../../motion/motion";

const SummaryPill = ({ icon: _Icon, label, value, color }) => (
  <div
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color} backdrop-blur-sm`}
  >
    <_Icon size={13} />
    <span className="text-xs font-medium tabular-nums">{value}</span>
    <span className="text-xs text-slate-500">{label}</span>
  </div>
);

const TransactionsHeader = ({ summary, isStreaming }) => {
  const pills = [
    {
      icon: Database,
      label: "Total",
      value: summary.total,
      color: "bg-slate-800/60 border-slate-700/50 text-slate-300",
    },
    {
      icon: AlertTriangle,
      label: "Flagged",
      value: summary.flagged,
      color: "bg-rose-500/10 border-rose-500/25 text-rose-400",
    },
    {
      icon: Clock,
      label: "Under Review",
      value: summary.underReview,
      color: "bg-amber-500/10 border-amber-500/25 text-amber-400",
    },
    {
      icon: CheckCircle,
      label: "Critical",
      value: summary.critical,
      color: "bg-rose-900/20 border-rose-700/30 text-rose-300",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {/* Accent bar */}
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              Transaction Intelligence
            </h1>
          </div>
          <p className="text-sm text-slate-400 ml-4 pl-0.5">
            Browse, investigate, and assess risk across all transaction records
          </p>
        </div>

        {/* Stream status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isStreaming ? "bg-cyan-400 shadow-[0_0_6px_#22D3EE] animate-pulse" : "bg-slate-500"}`}
          />
          <Wifi
            size={12}
            className={isStreaming ? "text-cyan-400" : "text-slate-500"}
          />
          <span className="text-xs text-slate-400">
            {isStreaming ? "Live sync active" : "Sync paused"}
          </span>
        </div>
      </div>

      {/* Summary pills */}
      <motion.div
        className="flex flex-wrap gap-2 ml-4"
        variants={{ show: { transition: { staggerChildren: STAGGER.fast } } }}
        initial="hidden"
        animate="show"
      >
        {pills.map((p) => (
          <motion.div
            key={p.label}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: { opacity: 1, x: 0 },
            }}
          >
            <SummaryPill {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TransactionsHeader;
