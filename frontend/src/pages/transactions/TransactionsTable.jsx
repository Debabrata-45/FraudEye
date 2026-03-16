import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ExternalLink, Eye, Minus } from "lucide-react";
import {
  RISK_LEVELS,
  STATUS_CONFIG,
  FRAUD_LABEL_CONFIG,
  formatAmount,
  formatTimestamp,
} from "./transactionsData";

// ─── Risk score cell ──────────────────────────────────────────────────────────
const RiskScoreCell = ({ score, riskLevel }) => {
  const cfg = RISK_LEVELS[riskLevel] || RISK_LEVELS.SAFE;
  const pct = Math.round(score * 100);

  return (
    <div className="flex flex-col gap-1 min-w-[88px]">
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold w-fit ${cfg.bg} ${cfg.border} ${cfg.text}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: cfg.color,
            boxShadow: `0 0 5px ${cfg.color}80`,
          }}
        />
        {cfg.label}
      </div>
      {/* Mini bar */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 tabular-nums w-6 text-right">
          {pct}%
        </span>
      </div>
    </div>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

// ─── Fraud label badge ────────────────────────────────────────────────────────
const FraudLabelBadge = ({ fraudLabel }) => {
  const cfg = FRAUD_LABEL_CONFIG[fraudLabel] || FRAUD_LABEL_CONFIG.UNKNOWN;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

// ─── Sortable header ──────────────────────────────────────────────────────────
const SortableCol = ({ label, sortKey, currentSort, onSort }) => {
  const [field, dir] = (currentSort || "").split("_");
  const active = field === sortKey;

  return (
    <th
      onClick={() => onSort(sortKey)}
      className="px-3 py-3 text-left cursor-pointer select-none group"
    >
      <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors">
        {label}
        <span className="flex flex-col gap-px">
          <ChevronUp
            size={9}
            className={
              active && dir === "asc" ? "text-cyan-400" : "text-slate-700"
            }
          />
          <ChevronDown
            size={9}
            className={
              active && dir === "desc" ? "text-cyan-400" : "text-slate-700"
            }
          />
        </span>
      </div>
    </th>
  );
};

// ─── Table row ────────────────────────────────────────────────────────────────
const TableRow = ({ tx, isSelected, onClick, isNew }) => {
  const isCritical = tx.riskLevel === "CRITICAL";
  const isHigh = tx.riskLevel === "HIGH";
  const isSafe = tx.riskLevel === "SAFE" || tx.riskLevel === "LOW";

  return (
    <motion.tr
      layout
      initial={
        isNew
          ? { opacity: 0, backgroundColor: "rgba(34,211,238,0.12)" }
          : { opacity: 0 }
      }
      animate={{ opacity: 1, backgroundColor: "transparent" }}
      transition={{ duration: isNew ? 1.2 : 0.25 }}
      onClick={() => onClick(tx)}
      className={`
        relative cursor-pointer border-b transition-all duration-150 group
        ${
          isSelected
            ? "bg-slate-800/90 border-b-slate-700"
            : "border-b-slate-800/60 hover:bg-slate-800/50"
        }
      `}
    >
      {/* Left accent edge */}
      <td className="w-0.5 p-0">
        <div
          className={`w-0.5 h-full min-h-[52px] rounded-full transition-all duration-200
          ${isSelected ? `opacity-100 ${isCritical || isHigh ? "bg-rose-500" : isSafe ? "bg-emerald-500" : "bg-cyan-500"}` : "opacity-0"}
          ${
            !isSelected &&
            (isCritical
              ? "group-hover:opacity-40 group-hover:bg-rose-500"
              : isHigh
                ? "group-hover:opacity-30 group-hover:bg-orange-500"
                : isSafe
                  ? "group-hover:opacity-30 group-hover:bg-emerald-500"
                  : "group-hover:opacity-20 group-hover:bg-cyan-500")
          }
        `}
        />
      </td>

      {/* ID */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-xs font-mono font-semibold transition-colors ${isSelected ? "text-cyan-300" : "text-slate-200 group-hover:text-cyan-300"}`}
          >
            {tx.id}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {tx.accountId}
          </span>
        </div>
      </td>

      {/* Timestamp */}
      <td className="px-3 py-3">
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {formatTimestamp(tx.timestamp)}
        </span>
      </td>

      {/* Merchant */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{tx.merchant.icon}</span>
          <div>
            <div className="text-xs font-medium text-slate-200 whitespace-nowrap max-w-[140px] truncate">
              {tx.merchant.name}
            </div>
            <div className="text-[10px] text-slate-500">
              {tx.merchant.category}
            </div>
          </div>
        </div>
      </td>

      {/* Amount */}
      <td className="px-3 py-3">
        <span
          className={`text-sm font-bold tabular-nums ${isCritical ? "text-rose-300" : isHigh ? "text-orange-300" : "text-slate-100"}`}
        >
          {formatAmount(tx.amount, tx.currency)}
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-3">
        <StatusBadge status={tx.status} />
      </td>

      {/* Fraud label */}
      <td className="px-3 py-3">
        <FraudLabelBadge fraudLabel={tx.fraudLabel} />
      </td>

      {/* Risk score */}
      <td className="px-3 py-3">
        <RiskScoreCell score={tx.riskScore} riskLevel={tx.riskLevel} />
      </td>

      {/* Top reason */}
      <td className="px-3 py-3 max-w-[160px]">
        <span
          className={`text-[11px] leading-snug ${isCritical || isHigh ? "text-rose-300/80" : "text-slate-500"}`}
        >
          {tx.reasons[0] || "—"}
        </span>
      </td>

      {/* Action */}
      <td className="px-3 py-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(tx);
          }}
          className="p-1.5 rounded-lg bg-slate-700/50 border border-slate-600/40 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all"
        >
          <Eye size={13} />
        </button>
      </td>
    </motion.tr>
  );
};

// ─── Empty / loading states ───────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-slate-800/50">
    <td className="w-0.5 p-0" />
    {[64, 40, 120, 60, 56, 64, 88, 100, 28].map((w, i) => (
      <td key={i} className="px-3 py-3.5">
        <div
          className="h-3 rounded bg-slate-800 animate-pulse"
          style={{ width: w }}
        />
      </td>
    ))}
  </tr>
);

const EmptyRows = ({ hasFilters }) => (
  <tr>
    <td colSpan={10} className="py-20 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
          <Minus size={20} className="text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">
            {hasFilters
              ? "No transactions match your filters"
              : "No transactions found"}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {hasFilters
              ? "Try adjusting or resetting your filters"
              : "Transactions will appear here when available"}
          </p>
        </div>
      </div>
    </td>
  </tr>
);

// ─── Main table ───────────────────────────────────────────────────────────────
const TransactionsTable = ({
  transactions,
  selectedId,
  onSelect,
  loading,
  sort,
  onSort,
  hasFilters,
}) => {
  const handleSort = (field) => {
    const [curField, curDir] = (sort || "timestamp_desc").split("_");
    const newDir = curField === field && curDir === "desc" ? "asc" : "desc";
    onSort(`${field}_${newDir}`);
  };

  const COLS = [
    { label: "Transaction ID", sortKey: null },
    { label: "Time", sortKey: "timestamp" },
    { label: "Merchant", sortKey: null },
    { label: "Amount", sortKey: "amount" },
    { label: "Status", sortKey: null },
    { label: "Verdict", sortKey: null },
    { label: "Risk Score", sortKey: "risk" },
    { label: "Top Signal", sortKey: null },
    { label: "", sortKey: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="w-0.5 p-0" />
              {COLS.map((col, i) =>
                col.sortKey ? (
                  <SortableCol
                    key={i}
                    label={col.label}
                    sortKey={col.sortKey}
                    currentSort={sort}
                    onSort={handleSort}
                  />
                ) : (
                  <th
                    key={i}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {col.label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)
            ) : transactions.length === 0 ? (
              <EmptyRows hasFilters={hasFilters} />
            ) : (
              <AnimatePresence mode="popLayout">
                {transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    tx={tx}
                    isSelected={selectedId === tx.id}
                    onClick={onSelect}
                    isNew={tx.isNew || false}
                  />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {transactions.length > 0 && !loading && (
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            {transactions.length} transactions displayed
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <ExternalLink size={10} />
            Click row to investigate
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionsTable;
