import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Eye, ClipboardList } from "lucide-react";
import { PRIORITY, REVIEW_STATUS, formatAmount } from "./analystData";

// ─── Priority badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY[priority] || PRIORITY.LOW;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold
      ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = REVIEW_STATUS[status] || REVIEW_STATUS.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium
      ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Queue item ───────────────────────────────────────────────────────────────
const QueueItem = ({ item, isSelected, onClick }) => {
  const priCfg = PRIORITY[item.priority] || PRIORITY.LOW;
  const isClosed =
    item.reviewStatus === "RESOLVED" ||
    item.reviewStatus === "CONFIRMED" ||
    item.reviewStatus === "CLEARED";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(item)}
      className={`relative flex gap-0 cursor-pointer rounded-xl border transition-all duration-150 overflow-hidden group
        ${
          isSelected
            ? `bg-slate-800/90 ${priCfg.border} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]`
            : `bg-slate-900/50 border-slate-800/70 hover:bg-slate-800/50 hover:border-slate-700/60`
        }
        ${isClosed ? "opacity-55" : ""}
      `}
    >
      {/* Left priority edge */}
      <div
        className={`w-0.5 flex-shrink-0 ${priCfg.edge} ${isClosed ? "opacity-30" : ""}`}
      />

      {/* Content */}
      <div className="flex-1 px-3 py-3 min-w-0">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={item.priority} />
            <StatusBadge status={item.reviewStatus} />
          </div>
          <span className={`text-xs font-black tabular-nums ${priCfg.text}`}>
            {item.riskScore}
          </span>
        </div>

        {/* IDs */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-mono font-semibold transition-colors
            ${isSelected ? "text-cyan-300" : "text-slate-200 group-hover:text-cyan-300"}`}
          >
            {item.id}
          </span>
          <span className="text-[10px] text-slate-600">→</span>
          <span className="text-[10px] font-mono text-slate-500">
            {item.txnId}
          </span>
        </div>

        {/* Merchant + amount */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400 truncate">
            {item.merchant.icon} {item.merchant.name}
          </span>
          <span className="text-xs font-semibold text-slate-200 tabular-nums flex-shrink-0">
            {formatAmount(item.amount)}
          </span>
        </div>

        {/* Time + assignment */}
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <span className="text-[10px] text-slate-600">
            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
          </span>
          {item.assignedTo && (
            <span className="text-[10px] text-violet-400 font-medium truncate max-w-[100px]">
              {item.assignedTo.split("@")[0]}
            </span>
          )}
        </div>
      </div>

      {/* View button */}
      <div className="flex items-center pr-2.5">
        <div
          className={`p-1.5 rounded-lg border transition-all
          ${
            isSelected
              ? `${priCfg.bg} ${priCfg.border} ${priCfg.text}`
              : "border-transparent text-slate-600 group-hover:text-cyan-400 group-hover:border-cyan-500/25 group-hover:bg-cyan-500/10"
          }`}
        >
          <Eye size={12} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const QueueSkeleton = () => (
  <div className="flex gap-0 rounded-xl border border-slate-800/60 overflow-hidden">
    <div className="w-0.5 bg-slate-800 animate-pulse" />
    <div className="flex-1 px-3 py-3 space-y-2">
      <div className="flex gap-2">
        <div className="h-4 w-14 rounded bg-slate-800 animate-pulse" />
        <div className="h-4 w-16 rounded bg-slate-800 animate-pulse" />
      </div>
      <div className="h-3 w-28 rounded bg-slate-800 animate-pulse" />
      <div className="flex justify-between">
        <div className="h-3 w-24 rounded bg-slate-800 animate-pulse" />
        <div className="h-3 w-14 rounded bg-slate-800 animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const QueueEmpty = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center">
      <ClipboardList size={20} className="text-slate-600" />
    </div>
    <p className="text-xs font-medium text-slate-400 text-center">
      Queue is clear
    </p>
    <p className="text-[11px] text-slate-600 text-center">
      No cases pending review
    </p>
  </div>
);

// ─── Main queue ───────────────────────────────────────────────────────────────
const ReviewQueue = ({ cases, selectedId, onSelect, loading }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35 }}
    className="flex flex-col h-full"
  >
    {/* Panel header */}
    <div className="pb-3 border-b border-slate-800 mb-3 flex-shrink-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Review Queue
      </p>
      <p className="text-xs text-slate-600 mt-0.5">{cases.length} cases</p>
    </div>

    {/* List */}
    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
      {loading ? (
        Array.from({ length: 7 }, (_, i) => <QueueSkeleton key={i} />)
      ) : cases.length === 0 ? (
        <QueueEmpty />
      ) : (
        <AnimatePresence mode="popLayout">
          {cases.map((item) => (
            <QueueItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onClick={onSelect}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  </motion.div>
);

export default ReviewQueue;
