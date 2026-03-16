import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { FRAUD_LABEL_CONFIG } from './explanationsData';

const LABEL_ICON = {
  FRAUD:      ShieldX,
  SUSPICIOUS: ShieldAlert,
  LEGITIMATE: ShieldCheck,
};

const ConfidenceRing = ({ value, color }) => {
  const r   = 28;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <svg width="72" height="72" className="rotate-[-90deg]">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1E293B" strokeWidth="6" />
      <motion.circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
};

const ExplanationSummary = ({ xcase }) => {
  const labelCfg = FRAUD_LABEL_CONFIG[xcase.fraudLabel] || FRAUD_LABEL_CONFIG.LEGITIMATE;
  const LabelIcon = LABEL_ICON[xcase.fraudLabel] || ShieldCheck;
  const pct = Math.round(xcase.fraudScore * 100);

  const ringColor =
    xcase.fraudLabel === 'FRAUD'      ? '#F43F5E' :
    xcase.fraudLabel === 'SUSPICIOUS' ? '#F59E0B' : '#22C55E';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border p-5 mb-5 ${labelCfg.bg} ${labelCfg.border}`}
      style={{ boxShadow: `0 0 32px ${ringColor}12` }}
    >
      <div className="flex items-start gap-5">

        {/* Confidence ring */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <div className="relative">
            <ConfidenceRing value={pct} color={ringColor} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-black tabular-nums ${labelCfg.text}`}>{pct}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 text-center leading-tight">Fraud<br/>Probability</span>
        </div>

        {/* Decision block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold
              ${labelCfg.bg} ${labelCfg.border} ${labelCfg.text}`}
            >
              <LabelIcon size={13} />
              {xcase.fraudLabel}
            </span>
            <span className="text-[11px] font-mono text-slate-500">{xcase.txnId}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
              {xcase.explainMethod}
            </span>
          </div>

          {/* Narrative */}
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            {xcase.narrative}
          </p>

          {/* Confidence pills */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Model</span>
              <span className="text-xs font-bold text-cyan-300 tabular-nums">{xcase.modelConfidence}%</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Explanation</span>
              <span className="text-xs font-bold text-violet-300 tabular-nums">{xcase.explainConfidence}%</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Engine</span>
              <span className="text-xs font-semibold text-slate-300 font-mono">{xcase.modelVersion}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExplanationSummary;