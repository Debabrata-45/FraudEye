import { motion } from "framer-motion";
import {
  ClipboardList,
  Flame,
  Eye,
  GitBranch,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";

const QueuePill = ({ icon: _Icon, label, value, colorClass, pulse }) => (
  <div
    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-sm ${colorClass}`}
  >
    <div className="relative">
      <_Icon size={13} />
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
      )}
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm font-bold tabular-nums leading-none">
        {value}
      </span>
      <span className="text-[11px] text-slate-500 leading-none">{label}</span>
    </div>
  </div>
);

const AnalystHeader = ({ summary }) => {
  const pills = [
    {
      icon: ClipboardList,
      label: "Total",
      value: summary.total,
      colorClass: "bg-slate-800/60 border-slate-700/50 text-slate-300",
      pulse: false,
    },
    {
      icon: Flame,
      label: "Critical",
      value: summary.critical,
      colorClass: "bg-rose-500/10  border-rose-500/30   text-rose-400",
      pulse: summary.critical > 0,
    },
    {
      icon: AlertOctagon,
      label: "Pending",
      value: summary.pending,
      colorClass: "bg-amber-500/10 border-amber-500/25  text-amber-400",
      pulse: summary.pending > 0,
    },
    {
      icon: Eye,
      label: "In Review",
      value: summary.inReview,
      colorClass: "bg-cyan-500/10  border-cyan-500/20   text-cyan-400",
      pulse: false,
    },
    {
      icon: GitBranch,
      label: "Escalated",
      value: summary.escalated,
      colorClass: "bg-violet-500/10 border-violet-500/25 text-violet-400",
      pulse: false,
    },
    {
      icon: CheckCircle2,
      label: "Resolved",
      value: summary.resolved,
      colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      pulse: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      {/* Title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-rose-500 flex-shrink-0 mt-0.5" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">
            Analyst Review
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Human-in-the-loop fraud case management — triage, decide, and
            document
          </p>
        </div>
      </div>

      {/* Queue pills */}
      <motion.div
        className="flex flex-wrap gap-2 ml-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        {pills.map((p) => (
          <motion.div
            key={p.label}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: { opacity: 1, x: 0 },
            }}
          >
            <QueuePill {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AnalystHeader;
