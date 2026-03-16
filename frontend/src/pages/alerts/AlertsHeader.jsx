import { motion } from "framer-motion";
import { ShieldAlert, Flame, Clock4, CheckCircle2, Radio } from "lucide-react";

const KPIPill = ({ icon: _Icon, label, value, colorClass, pulse }) => (
  <div
    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-sm ${colorClass}`}
  >
    <div className="relative flex items-center justify-center">
      <_Icon size={13} />
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
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

const AlertsHeader = ({ summary, isLive }) => {
  const pills = [
    {
      icon: ShieldAlert,
      label: "Total",
      value: summary.total,
      colorClass: "bg-slate-800/60 border-slate-700/50 text-slate-300",
      pulse: false,
    },
    {
      icon: Flame,
      label: "Critical",
      value: summary.critical,
      colorClass: "bg-rose-500/10 border-rose-500/30 text-rose-400",
      pulse: summary.critical > 0,
    },
    {
      icon: Radio,
      label: "Active",
      value: summary.active,
      colorClass: "bg-orange-500/10 border-orange-500/25 text-orange-400",
      pulse: false,
    },
    {
      icon: Clock4,
      label: "Reviewing",
      value: summary.reviewing,
      colorClass: "bg-amber-500/10 border-amber-500/25 text-amber-400",
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
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-rose-500 to-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              Threat Alerts
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Active fraud signals, severity triage, and alert management
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-rose-400 animate-pulse shadow-[0_0_6px_#F43F5E]" : "bg-slate-500"}`}
          />
          <span className="text-xs text-slate-400">
            {isLive ? "Monitoring active" : "Stream paused"}
          </span>
        </div>
      </div>

      {/* KPI strip */}
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
            <KPIPill {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AlertsHeader;
