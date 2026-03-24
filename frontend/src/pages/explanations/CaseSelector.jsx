import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FRAUD_LABEL_CONFIG, formatAmount } from "./explanationsData";

function safeTimeAgo(ts) {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

const RISK_DOT = {
  FRAUD: "bg-rose-500 shadow-[0_0_6px_#F43F5E]",
  SUSPICIOUS: "bg-amber-400 shadow-[0_0_5px_#F59E0B]",
  LEGITIMATE: "bg-emerald-500",
};

const CaseItem = ({ xcase, isSelected, onClick }) => {
  const labelCfg =
    FRAUD_LABEL_CONFIG[xcase.fraudLabel] || FRAUD_LABEL_CONFIG.LEGITIMATE;
  const pct = Math.round(xcase.fraudScore * 100);

  return (
    <motion.button
      whileHover={{ x: 2 }}
      transition={{ duration: 0.12 }}
      onClick={() => onClick(xcase)}
      className={`w-full text-left px-3 py-3 rounded-xl border transition-all duration-150
        ${
          isSelected
            ? "bg-slate-800/90 border-slate-600/60 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]"
            : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700/60"
        }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${RISK_DOT[xcase.fraudLabel] || "bg-slate-500"}`}
          />
          <span
            className={`text-[11px] font-mono font-semibold ${isSelected ? "text-cyan-300" : "text-slate-300"}`}
          >
            {xcase.txnId}
          </span>
        </div>
        <span className={`text-[11px] font-bold tabular-nums ${labelCfg.text}`}>
          {pct}%
        </span>
      </div>

      {/* Merchant + amount */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] text-slate-500 truncate">
          {xcase.merchant.icon} {xcase.merchant.name}
        </span>
        <span className="text-[11px] font-semibold text-slate-300 tabular-nums flex-shrink-0">
          {formatAmount(xcase.amount)}
        </span>
      </div>

      {/* Risk bar */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full rounded-full transition-all duration-500
            ${xcase.fraudLabel === "FRAUD" ? "bg-rose-500" : xcase.fraudLabel === "SUSPICIOUS" ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Label + time */}
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${labelCfg.bg} ${labelCfg.border} ${labelCfg.text}`}
        >
          {xcase.fraudLabel}
        </span>
        <span className="text-[10px] text-slate-600">
          {safeTimeAgo(xcase.occurredAt ?? xcase.timestamp)}
        </span>
      </div>
    </motion.button>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const CaseSkeleton = () => (
  <div className="px-3 py-3 rounded-xl border border-slate-800/60 space-y-2">
    <div className="flex justify-between">
      <div className="h-3 w-24 rounded bg-slate-800 animate-pulse" />
      <div className="h-3 w-8  rounded bg-slate-800 animate-pulse" />
    </div>
    <div className="h-2.5 w-32 rounded bg-slate-800 animate-pulse" />
    <div className="h-1   w-full rounded bg-slate-800 animate-pulse" />
  </div>
);

// ─── Selector ─────────────────────────────────────────────────────────────────
const CaseSelector = ({ cases, selectedId, onSelect, loading }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35 }}
    className="flex flex-col h-full"
  >
    {/* Panel header */}
    <div className="px-1 pb-3 border-b border-slate-800 mb-3 flex-shrink-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Cases
      </p>
      <p className="text-xs text-slate-600 mt-0.5">
        {cases.length} explanations available
      </p>
    </div>

    {/* List */}
    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
      {loading
        ? Array.from({ length: 6 }, (_, i) => <CaseSkeleton key={i} />)
        : cases.map((c) => (
            <CaseItem
              key={c.id}
              xcase={c}
              isSelected={selectedId === c.id}
              onClick={onSelect}
            />
          ))}
    </div>
  </motion.div>
);

export default CaseSelector;
