import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CONTRIBUTION } from "./explanationsData";

// ─── Single bar row ───────────────────────────────────────────────────────────
const ContributionBar = ({
  feature,
  shapValue,
  absValue,
  contribution,
  description,
  index,
  maxVal,
}) => {
  const [hovered, setHovered] = useState(false);
  const cfg = CONTRIBUTION[contribution] || CONTRIBUTION.SAFE;
  const pct = Math.round((absValue / maxVal) * 100);
  const isFraud = contribution === "FRAUD";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-default
        ${
          hovered
            ? isFraud
              ? "bg-rose-500/8 border-rose-500/20"
              : "bg-emerald-500/8 border-emerald-500/15"
            : "bg-slate-900/40 border-slate-800/50"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Direction icon */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
          ${isFraud ? "bg-rose-500/15" : "bg-emerald-500/10"}`}
        >
          {isFraud ? (
            <TrendingUp size={12} className="text-rose-400" />
          ) : (
            <TrendingDown size={12} className="text-emerald-400" />
          )}
        </div>

        {/* Feature name + bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-medium text-slate-200 truncate">
              {feature}
            </span>
            <span
              className={`text-xs font-bold tabular-nums font-mono flex-shrink-0 ${cfg.text}`}
            >
              {shapValue > 0
                ? `+${shapValue.toFixed(3)}`
                : shapValue.toFixed(3)}
            </span>
          </div>

          {/* Bar track */}
          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${cfg.bg}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.04,
                ease: "easeOut",
              }}
              style={
                isFraud
                  ? { boxShadow: `0 0 8px ${CONTRIBUTION.FRAUD.color}50` }
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Tooltip description on hover */}
      <motion.div
        initial={false}
        animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="overflow-hidden"
      >
        <p className="text-[11px] text-slate-500 mt-1.5 ml-9 leading-relaxed">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

// ─── Tab switcher ─────────────────────────────────────────────────────────────
const MethodTab = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
      ${
        active
          ? "bg-violet-500/15 border border-violet-500/30 text-violet-300"
          : "text-slate-500 hover:text-slate-300 border border-transparent"
      }`}
  >
    {label}
  </button>
);

// ─── Legend ───────────────────────────────────────────────────────────────────
const Legend = () => (
  <div className="flex items-center gap-4 text-[11px] text-slate-500">
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-1.5 rounded-full bg-rose-500 inline-block" />
      Increases fraud risk
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Reduces fraud risk
    </span>
  </div>
);

// ─── Main chart ───────────────────────────────────────────────────────────────
const ContributionChart = ({ xcase }) => {
  const [method, setMethod] = useState("SHAP");

  const features = method === "SHAP" ? xcase.shapFeatures : xcase.limeFeatures;
  const topFeatures = features.slice(0, 8);
  const maxVal = Math.max(...topFeatures.map((f) => f.absValue));

  const fraudDrivers = topFeatures.filter((f) => f.contribution === "FRAUD");
  const safeDrivers = topFeatures.filter((f) => f.contribution === "SAFE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 mb-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            Feature Contributions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Top {topFeatures.length} features ranked by impact magnitude
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
          <MethodTab
            active={method === "SHAP"}
            label="SHAP"
            onClick={() => setMethod("SHAP")}
          />
          <MethodTab
            active={method === "LIME"}
            label="LIME"
            onClick={() => setMethod("LIME")}
          />
        </div>
      </div>

      <Legend />

      {/* Split sections */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Fraud-driving features */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp size={12} className="text-rose-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Fraud Drivers ({fraudDrivers.length})
            </span>
          </div>
          <div className="space-y-1.5">
            {fraudDrivers.map((f, i) => (
              <ContributionBar
                key={f.feature}
                {...f}
                index={i}
                maxVal={maxVal}
              />
            ))}
            {fraudDrivers.length === 0 && (
              <p className="text-xs text-slate-600 py-3 text-center">
                No fraud-driving features
              </p>
            )}
          </div>
        </div>

        {/* Safe-driving features */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingDown size={12} className="text-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Safe Indicators ({safeDrivers.length})
            </span>
          </div>
          <div className="space-y-1.5">
            {safeDrivers.map((f, i) => (
              <ContributionBar
                key={f.feature}
                {...f}
                index={i}
                maxVal={maxVal}
              />
            ))}
            {safeDrivers.length === 0 && (
              <p className="text-xs text-slate-600 py-3 text-center">
                No safe indicators
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContributionChart;
