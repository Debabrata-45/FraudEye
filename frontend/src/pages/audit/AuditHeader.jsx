import { motion } from "framer-motion";
import { ScrollText, User, Cpu, GitCommit, AlertTriangle } from "lucide-react";

const SummaryPill = ({ icon: _Icon, label, value, colorClass }) => (
  <div
    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-sm ${colorClass}`}
  >
    <_Icon size={13} />
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm font-bold tabular-nums leading-none">
        {value}
      </span>
      <span className="text-[11px] text-slate-500 leading-none">{label}</span>
    </div>
  </div>
);

const AuditHeader = ({ summary }) => {
  const pills = [
    {
      icon: ScrollText,
      label: "Total Events",
      value: summary.total,
      colorClass: "bg-slate-800/60   border-slate-700/50   text-slate-300",
    },
    {
      icon: User,
      label: "Analyst",
      value: summary.analyst,
      colorClass: "bg-cyan-500/10    border-cyan-500/20    text-cyan-300",
    },
    {
      icon: Cpu,
      label: "System",
      value: summary.system,
      colorClass: "bg-violet-500/10  border-violet-500/20  text-violet-300",
    },
    {
      icon: GitCommit,
      label: "Decisions",
      value: summary.decisions,
      colorClass: "bg-amber-500/10   border-amber-500/20   text-amber-300",
    },
    {
      icon: AlertTriangle,
      label: "Failures",
      value: summary.failures,
      colorClass: "bg-rose-500/10    border-rose-500/25    text-rose-400",
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
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-slate-400 to-cyan-500 flex-shrink-0 mt-0.5" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">
            Audit Logs
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Complete system and analyst action history — full traceability and
            accountability
          </p>
        </div>
      </div>

      {/* Summary pills */}
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
            <SummaryPill {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AuditHeader;
