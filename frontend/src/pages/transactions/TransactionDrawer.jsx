import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  AlertTriangle,
  MapPin,
  Smartphone,
  CreditCard,
  User,
  ChevronRight,
  Brain,
  TrendingUp,
} from "lucide-react";
import {
  RISK_LEVELS,
  STATUS_CONFIG,
  FRAUD_LABEL_CONFIG,
  formatAmount,
  formatExactTime,
} from "./transactionsData";
import { MetaRow } from "../../components/Responsive";

// ─── Section shell ────────────────────────────────────────────────────────────
const DrawerSection = ({ title, icon: _Icon, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-3">
      <_Icon size={13} className="text-slate-500" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </span>
    </div>
    {children}
  </div>
);

// ─── SHAP contribution bar ────────────────────────────────────────────────────
const ShapBar = ({ feature, value, positive, maxVal }) => {
  const pct = Math.round((value / maxVal) * 100);
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
          {feature}
        </span>
        <span
          className={`text-[11px] font-semibold tabular-nums ${positive ? "text-rose-400" : "text-emerald-400"}`}
        >
          {positive ? "+" : "-"}
          {value.toFixed(2)}
        </span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: (0.05 * pct) / 10 }}
          className={`h-full rounded-full ${positive ? "bg-rose-500" : "bg-emerald-500"}`}
        />
      </div>
    </div>
  );
};

// ─── Reason tag ───────────────────────────────────────────────────────────────
const ReasonTag = ({ reason, risk }) => {
  const isCritical = risk === "CRITICAL" || risk === "HIGH";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border mr-1.5 mb-1.5
      ${
        isCritical
          ? "bg-rose-500/10 border-rose-500/25 text-rose-300"
          : "bg-amber-500/10 border-amber-500/25 text-amber-300"
      }`}
    >
      <AlertTriangle size={9} />
      {reason}
    </span>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const DrawerEmpty = () => (
  <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
    <div className="w-14 h-14 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center">
      <Shield size={22} className="text-slate-600" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400">
        No transaction selected
      </p>
      <p className="text-xs text-slate-600 mt-1">
        Click any row to investigate details
      </p>
    </div>
  </div>
);

// ─── Main drawer ──────────────────────────────────────────────────────────────
const TransactionDrawer = ({ transaction: tx, onClose }) => {
  const riskCfg = tx ? RISK_LEVELS[tx.riskLevel] || RISK_LEVELS.SAFE : null;
  const statusCfg = tx
    ? STATUS_CONFIG[tx.status] || STATUS_CONFIG.PENDING
    : null;
  const fraudCfg = tx
    ? FRAUD_LABEL_CONFIG[tx.fraudLabel] || FRAUD_LABEL_CONFIG.UNKNOWN
    : null;
  const maxShap = tx ? Math.max(...tx.shapFeatures.map((f) => f.value)) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col h-full bg-slate-900/95 border-l border-slate-800 backdrop-blur-md overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
          <span className="text-sm font-semibold text-slate-100">
            Transaction Detail
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        <AnimatePresence mode="wait">
          {!tx ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DrawerEmpty />
            </motion.div>
          ) : (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Risk headline */}
              <div
                className={`p-4 rounded-xl border mb-5 ${riskCfg.bg} ${riskCfg.border}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: riskCfg.color,
                          boxShadow: `0 0 8px ${riskCfg.color}`,
                        }}
                      />
                      <span className={`text-sm font-bold ${riskCfg.text}`}>
                        {riskCfg.label} Risk
                      </span>
                    </div>
                    <span className="text-2xl font-black text-slate-50">
                      {formatAmount(tx.amount, tx.currency)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-black tabular-nums ${riskCfg.text}`}
                    >
                      {Math.round(tx.riskScore * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Fraud probability
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(tx.riskScore * 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${riskCfg.bar}`}
                    style={{ boxShadow: `0 0 10px ${riskCfg.color}80` }}
                  />
                </div>
              </div>

              {/* ID + Verdict + Status strip */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Reference
                  </div>
                  <div className="text-xs font-mono font-semibold text-cyan-300">
                    {tx.id}
                  </div>
                </div>
                <div className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Verdict
                  </div>
                  <span className={`text-xs font-semibold ${fraudCfg.text}`}>
                    {fraudCfg.label}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Status
                  </div>
                  <span className={`text-xs font-semibold ${statusCfg.text}`}>
                    {statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Transaction metadata */}
              <DrawerSection title="Transaction Details" icon={CreditCard}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                  <MetaRow
                    label="Timestamp"
                    value={formatExactTime(tx.timestamp)}
                    mono
                  />
                  <MetaRow
                    label="Merchant"
                    value={`${tx.merchant.icon} ${tx.merchant.name}`}
                  />
                  <MetaRow label="Category" value={tx.merchant.category} />
                  <MetaRow
                    label="Card ending"
                    value={`•••• ${tx.cardLast4}`}
                    mono
                  />
                  <MetaRow
                    label="Model confidence"
                    value={`${tx.modelConfidence}%`}
                  />
                </div>
              </DrawerSection>

              {/* Account context */}
              <DrawerSection title="Account Context" icon={User}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                  <MetaRow label="Account ID" value={tx.accountId} mono />
                  <MetaRow
                    label="Location"
                    value={
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {tx.geo}
                      </span>
                    }
                  />
                  <MetaRow
                    label="Device"
                    value={
                      <span className="flex items-center gap-1">
                        <Smartphone size={10} />
                        {tx.device}
                      </span>
                    }
                  />
                </div>
              </DrawerSection>

              {/* Fraud signals */}
              {tx.reasons.length > 0 && (
                <DrawerSection title="Fraud Signals" icon={AlertTriangle}>
                  <div>
                    {tx.reasons.map((r, i) => (
                      <ReasonTag key={i} reason={r} risk={tx.riskLevel} />
                    ))}
                  </div>
                </DrawerSection>
              )}

              {/* SHAP */}
              <DrawerSection title="AI Feature Importance (SHAP)" icon={Brain}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-3 border border-slate-700/30">
                  {tx.shapFeatures.slice(0, 6).map((f, i) => (
                    <ShapBar key={i} {...f} maxVal={maxShap} />
                  ))}
                  <p className="text-[10px] text-slate-600 mt-3 flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-rose-500 rounded" /> Increases
                    fraud risk
                    <span className="ml-2 w-2 h-0.5 bg-emerald-500 rounded" />{" "}
                    Reduces fraud risk
                  </p>
                </div>
              </DrawerSection>

              {/* Actions */}
              <DrawerSection title="Analyst Actions" icon={TrendingUp}>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: "Flag as Fraud",
                      cls: "bg-rose-500/10 border-rose-500/25 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40",
                    },
                    {
                      label: "Clear as Legitimate",
                      cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/40",
                    },
                    {
                      label: "Open Full Explanation",
                      cls: "bg-violet-500/10 border-violet-500/25 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/40",
                    },
                  ].map(({ label, cls }) => (
                    <button
                      key={label}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg border transition-all group ${cls}`}
                    >
                      <span className="text-xs font-semibold">{label}</span>
                      <ChevronRight
                        size={13}
                        className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </DrawerSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TransactionDrawer;
