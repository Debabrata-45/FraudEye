import { motion } from "framer-motion";
import { Brain, Cpu, FlaskConical } from "lucide-react";

const ModelPill = ({ icon: _Icon, label, value, colorClass }) => (
  <div
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-sm ${colorClass}`}
  >
    <_Icon size={12} />
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="text-xs font-semibold font-mono">{value}</span>
  </div>
);

const ExplanationsHeader = ({ selectedCase }) => {
  const pills = [
    {
      icon: Brain,
      label: "Engine",
      value: "XGBoost v2",
      colorClass: "bg-violet-500/10 border-violet-500/25 text-violet-300",
    },
    {
      icon: FlaskConical,
      label: "XAI",
      value: "SHAP + LIME",
      colorClass: "bg-cyan-500/10   border-cyan-500/20   text-cyan-300",
    },
    {
      icon: Cpu,
      label: "AUC",
      value: "0.9962",
      colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-start gap-3">
          {/* Gradient accent — cyan to violet for XAI identity */}
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              AI Explanations
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              SHAP &amp; LIME-powered fraud reasoning — understand why every
              prediction was made
            </p>
          </div>
        </div>

        {/* Selected case context */}
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22D3EE]" />
            <span className="text-xs text-slate-400">Explaining</span>
            <span className="text-xs font-mono font-semibold text-cyan-300">
              {selectedCase.txnId}
            </span>
          </motion.div>
        )}
      </div>

      {/* Model pills */}
      <motion.div
        className="flex flex-wrap gap-2 ml-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        {pills.map((p) => (
          <motion.div
            key={p.label}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: { opacity: 1, x: 0 },
            }}
          >
            <ModelPill {...p} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ExplanationsHeader;
