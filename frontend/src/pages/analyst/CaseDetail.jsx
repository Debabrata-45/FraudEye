import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, AlertTriangle, Brain, MapPin, Smartphone, TrendingUp, TrendingDown } from 'lucide-react';
import { PRIORITY, REVIEW_STATUS, DRIVER_COLOR, formatAmount, formatTime } from './analystData';

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ title, icon: _Icon, children }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2.5">
      <_Icon size={12} className="text-slate-500" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{title}</span>
    </div>
    {children}
  </div>
);

// ─── Meta row ─────────────────────────────────────────────────────────────────
const MetaRow = ({ label, value, accent }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className={`text-xs font-medium ${accent || 'text-slate-200'}`}>{value}</span>
  </div>
);

// ─── Driver chip ──────────────────────────────────────────────────────────────
const DriverChip = ({ label, severity }) => {
  const cfg = DRIVER_COLOR[severity] || DRIVER_COLOR.medium;
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[11px] font-medium
      ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {label}
    </span>
  );
};

// ─── SHAP preview bar ─────────────────────────────────────────────────────────
const ShapBar = ({ feature, value, fraud, maxVal, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25, delay: index * 0.05 }}
    className="flex items-center gap-2 mb-1.5 last:mb-0"
  >
    {fraud
      ? <TrendingUp  size={10} className="text-rose-400    flex-shrink-0" />
      : <TrendingDown size={10} className="text-emerald-400 flex-shrink-0" />
    }
    <span className="text-[10px] text-slate-400 truncate w-32 flex-shrink-0">{feature}</span>
    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / maxVal) * 100}%` }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
        className={`h-full rounded-full ${fraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
      />
    </div>
    <span className={`text-[10px] font-mono tabular-nums w-9 text-right flex-shrink-0
      ${fraud ? 'text-rose-400' : 'text-emerald-400'}`}
    >
      {fraud ? '+' : '-'}{value.toFixed(2)}
    </span>
  </motion.div>
);

// ─── Empty ────────────────────────────────────────────────────────────────────
const DetailEmpty = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
    <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center">
      <ClipboardList size={22} className="text-slate-600" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400">No case selected</p>
      <p className="text-xs text-slate-600 mt-1">Select a case from the queue to begin review</p>
    </div>
  </div>
);

// ─── Main detail panel ────────────────────────────────────────────────────────
const CaseDetail = ({ item }) => {
  if (!item) return <DetailEmpty />;

  const priCfg    = PRIORITY[item.priority]           || PRIORITY.LOW;
  const statusCfg = REVIEW_STATUS[item.reviewStatus]  || REVIEW_STATUS.PENDING;
  const maxShap   = Math.max(...item.shapPreview.map(f => f.value));

  const fraudLabel = item.fraudLabel;
  const labelColor = fraudLabel === 'FRAUD' ? 'text-rose-300' : fraudLabel === 'SUSPICIOUS' ? 'text-amber-300' : 'text-emerald-300';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22 }}
        className="overflow-y-auto h-full pr-0.5"
      >
        {/* Risk headline */}
        <div className={`p-4 rounded-2xl border mb-4 ${priCfg.bg} ${priCfg.border}`}
          style={{ boxShadow: `0 0 24px ${priCfg.color}12` }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-bold uppercase tracking-widest ${priCfg.text}`}>
                  {priCfg.label} Priority
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border
                  ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
                >
                  {statusCfg.label}
                </span>
              </div>
              <span className="text-xl font-black text-slate-50">
                {formatAmount(item.amount)}
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl font-black tabular-nums ${priCfg.text}`}>{item.riskScore}</div>
              <div className="text-[10px] text-slate-500">risk score</div>
            </div>
          </div>

          {/* Verdict + narrative */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold ${labelColor}`}>{fraudLabel}</span>
            <span className="text-slate-700">·</span>
            <span className="text-[11px] font-mono text-slate-500">{item.id}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{item.narrative}</p>
        </div>

        {/* Transaction context */}
        <Section title="Transaction Context" icon={AlertTriangle}>
          <div className="bg-slate-800/30 rounded-xl px-3 py-1 border border-slate-700/30 mb-2">
            <MetaRow label="Transaction" value={item.txnId}      accent="text-cyan-300" />
            <MetaRow label="Alert ID"    value={item.alertId}    accent="text-violet-300" />
            <MetaRow label="Account"     value={item.accountId} />
            <MetaRow label="Merchant"    value={`${item.merchant.icon} ${item.merchant.name}`} />
            <MetaRow label="Timestamp"   value={formatTime(item.timestamp)} />
            <MetaRow label="Model Conf." value={`${item.modelConf}%`} accent="text-cyan-300" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400">
              <MapPin size={10} className="text-slate-500" />
              {item.geo}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400">
              <Smartphone size={10} className="text-slate-500" />
              {item.device}
            </div>
          </div>
        </Section>

        {/* Fraud drivers */}
        <Section title="Fraud Drivers" icon={AlertTriangle}>
          <div className="flex flex-wrap gap-1.5">
            {item.drivers.map((d, i) => (
              <DriverChip key={i} {...d} />
            ))}
          </div>
        </Section>

        {/* XAI preview */}
        <Section title="AI Reasoning Preview (SHAP)" icon={Brain}>
          <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
            {item.shapPreview.map((f, i) => (
              <ShapBar key={f.feature} {...f} maxVal={maxShap} index={i} />
            ))}
            <p className="text-[10px] text-slate-600 mt-2 pt-2 border-t border-slate-800/50">
              Showing top {item.shapPreview.length} contributing features
            </p>
          </div>
        </Section>

      </motion.div>
    </AnimatePresence>
  );
};

export default CaseDetail;