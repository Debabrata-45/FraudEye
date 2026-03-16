import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Smartphone } from "lucide-react";
import {
  FRAUD_LABEL_CONFIG,
  formatAmount,
  formatTime,
} from "./explanationsData";

const MetaItem = ({ label, value, mono, accent }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span
      className={`text-xs font-medium ${mono ? "font-mono" : ""} ${accent || "text-slate-200"}`}
    >
      {value}
    </span>
  </div>
);

const STATUS_CONFIG = {
  FLAGGED: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
  },
  UNDER_REVIEW: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  APPROVED: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  BLOCKED: {
    text: "text-rose-300",
    bg: "bg-rose-900/20",
    border: "border-rose-700/30",
  },
};

const RelatedTransaction = ({ xcase }) => {
  const labelCfg =
    FRAUD_LABEL_CONFIG[xcase.fraudLabel] || FRAUD_LABEL_CONFIG.LEGITIMATE;
  const statusCfg = STATUS_CONFIG[xcase.status] || STATUS_CONFIG.APPROVED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.18 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 mb-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            Related Transaction
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Source record for this explanation
          </p>
        </div>
        <button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40
          text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
        >
          View Full
          <ArrowUpRight size={11} />
        </button>
      </div>

      {/* Amount + merchant hero */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl border mb-4 ${labelCfg.bg} ${labelCfg.border}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{xcase.merchant.icon}</span>
          <div>
            <p className="text-sm font-bold text-slate-100">
              {xcase.merchant.name}
            </p>
            <p className="text-xs text-slate-500">{xcase.merchant.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-slate-50">
            {formatAmount(xcase.amount)}
          </p>
          <span className={`text-[11px] font-semibold ${labelCfg.text}`}>
            {xcase.fraudLabel}
          </span>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="bg-slate-800/30 rounded-xl px-3 py-1 border border-slate-700/30 mb-3">
        <MetaItem
          label="Transaction ID"
          value={xcase.txnId}
          mono
          accent="text-cyan-300"
        />
        <MetaItem label="Account" value={xcase.accountId} mono />
        <MetaItem label="Timestamp" value={formatTime(xcase.timestamp)} />
        <MetaItem
          label="Status"
          value={
            <span
              className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold
              ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
            >
              {xcase.status.replace("_", " ")}
            </span>
          }
        />
      </div>

      {/* Geo + device */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400">
          <MapPin size={11} className="text-slate-500" />
          {xcase.geo}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400">
          <Smartphone size={11} className="text-slate-500" />
          {xcase.device}
        </div>
      </div>
    </motion.div>
  );
};

export default RelatedTransaction;
