import { motion } from "framer-motion";
import { ChevronRight, Zap, Target, Lightbulb } from "lucide-react";
import { DRIVER_SEVERITY, RECOMMENDATIONS } from "./explanationsData";

// ─── Driver chip ──────────────────────────────────────────────────────────────
const DriverChip = ({ label, icon, severity, index }) => {
  const cfg = DRIVER_SEVERITY[severity] || DRIVER_SEVERITY.low;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold
        cursor-default select-none transition-all hover:brightness-110 ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span className="text-sm leading-none">{icon}</span>
      {label}
    </motion.span>
  );
};

// ─── Confidence gauge ─────────────────────────────────────────────────────────
const ConfidenceGauge = ({ label, value, color, description }) => (
  <div className="flex-1 min-w-[120px]">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] text-slate-500 font-medium">{label}</span>
      <span className={`text-sm font-black tabular-nums ${color}`}>
        {value}%
      </span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={`h-full rounded-full ${
          color.includes("cyan")
            ? "bg-cyan-500"
            : color.includes("violet")
              ? "bg-violet-500"
              : color.includes("emerald")
                ? "bg-emerald-500"
                : "bg-slate-500"
        }`}
      />
    </div>
    <p className="text-[10px] text-slate-600 leading-snug">{description}</p>
  </div>
);

// ─── Recommendation card ──────────────────────────────────────────────────────
const RecommendationCard = ({ type }) => {
  const cfg = RECOMMENDATIONS[type] || RECOMMENDATIONS.MONITOR;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold mb-1 ${cfg.color}`}>{cfg.label}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{cfg.detail}</p>
        </div>
        <ChevronRight
          size={14}
          className="text-slate-600 flex-shrink-0 mt-0.5"
        />
      </div>
    </motion.div>
  );
};

// ─── Main panel ───────────────────────────────────────────────────────────────
const FraudDrivers = ({ xcase }) => (
  <div className="space-y-4 mb-5">
    {/* Fraud driver chips */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-amber-400" />
        <h3 className="text-sm font-bold text-slate-100">Key Fraud Drivers</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium ml-auto">
          {(xcase.drivers ?? xcase.topDrivers ?? []).length} signals
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Highest-impact behavioral and contextual signals detected in this
        transaction.
      </p>
      <div className="flex flex-wrap gap-2">
        {(xcase.drivers ?? xcase.topDrivers ?? []).map((d, i) => (
          <DriverChip
            key={i}
            {...(typeof d === "string" ? { label: d, feature: d } : d)}
            index={i}
          />
        ))}
      </div>
    </motion.div>

    {/* Confidence block */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target size={14} className="text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Confidence Analysis
        </h3>
      </div>
      <div className="flex flex-wrap gap-5">
        <ConfidenceGauge
          label="Model Confidence"
          value={xcase.modelConfidence}
          color="text-cyan-300"
          description="Certainty of the XGBoost prediction"
        />
        <ConfidenceGauge
          label="Explanation Fidelity"
          value={xcase.explainConfidence}
          color="text-violet-300"
          description={`How faithfully ${xcase.explainMethod} explains the model`}
        />
      </div>
      <p className="text-[11px] text-slate-600 mt-3 pt-3 border-t border-slate-800/60 leading-relaxed">
        Explanation fidelity measures how accurately {xcase.explainMethod}{" "}
        approximates the model behavior locally. Values above 80% indicate
        highly reliable explanations.
      </p>
    </motion.div>

    {/* Recommendation */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.14 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={14} className="text-violet-400" />
        <h3 className="text-sm font-bold text-slate-100">Recommended Action</h3>
      </div>
      <RecommendationCard type={xcase.recommendation} />
    </motion.div>
  </div>
);

export default FraudDrivers;
