import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Filter, Trash2, ChevronDown } from "lucide-react";
import { useSSE } from "../../hooks/useSSE";
import RiskBadge from "../../components/ui/RiskBadge";
import TransactionDetail from "./TransactionDetail";
import { getRiskConfig } from "../../utils/constants";
import { cn } from "../../utils/cn";

function StatPill({ label, value, color }) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 rounded-fe bg-fe-surface border text-xs flex items-center gap-2",
        color,
      )}
    >
      <span className="text-fe-text-3">{label}</span>
      <span className="font-bold text-fe-text">{value}</span>
    </div>
  );
}

function TxnRow({ txn, onClick, isNew }) {
  const config = getRiskConfig(txn.riskLabel || txn.riskScore);
  return (
    <motion.tr
      initial={isNew ? { backgroundColor: "rgba(34,211,238,0.1)" } : false}
      animate={{ backgroundColor: "transparent" }}
      transition={{ duration: 1.5 }}
      onClick={onClick}
      className={cn(
        "border-b border-fe-border2 hover:bg-white/[0.03] transition-colors cursor-pointer group",
        config.rowEdge,
      )}
    >
      <td className="px-4 py-3 text-fe-text-3 text-xs font-mono whitespace-nowrap">
        {txn.timestamp ? new Date(txn.timestamp).toLocaleTimeString() : "—"}
      </td>
      <td className="px-4 py-3 text-fe-text-2 font-mono text-xs">
        #{txn.transactionId || "—"}
      </td>
      <td className="px-4 py-3 text-fe-text-2 text-sm">{txn.userId || "—"}</td>
      <td className="px-4 py-3 text-fe-text-2 text-sm">
        {txn.merchantId || "—"}
      </td>
      <td className="px-4 py-3 text-right text-fe-text font-semibold text-sm whitespace-nowrap">
        ₹{txn.amount?.toLocaleString("en-IN") || "—"}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={cn("font-bold text-sm", config.color)}>
            {txn.riskScore ?? "—"}
          </span>
          <div className="w-16 h-1.5 bg-fe-surface rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", config.bar)}
              style={{ width: `${txn.riskScore || 0}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {txn.riskLabel ? (
          <RiskBadge label={txn.riskLabel} score={txn.riskScore} size="sm" />
        ) : (
          <span className="text-fe-text-3 text-xs">—</span>
        )}
      </td>
    </motion.tr>
  );
}

export default function TransactionsFeed() {
  const { transactions, connected, error, clear } = useSSE(100);
  const [filters, setFilters] = useState({ riskLabel: "", search: "" });
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  const filtered = transactions.filter((t) => {
    if (filters.riskLabel && t.riskLabel?.toLowerCase() !== filters.riskLabel)
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !t.transactionId?.toString().includes(q) &&
        !t.userId?.toLowerCase().includes(q) &&
        !t.merchantId?.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const counts = {
    total: transactions.length,
    high: transactions.filter((t) =>
      ["high", "critical"].includes(t.riskLabel?.toLowerCase()),
    ).length,
    medium: transactions.filter((t) => t.riskLabel?.toLowerCase() === "medium")
      .length,
    low: transactions.filter((t) => t.riskLabel?.toLowerCase() === "low")
      .length,
  };

  const newThreshold = transactions.length - prevCount;

  useEffect(() => {
    setPrevCount(transactions.length);
  }, [transactions.length]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-fe-cyan" />
            <h1 className="text-xl font-bold text-fe-text">Live Threat Feed</h1>
            <span
              className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ml-1",
                connected
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : "text-rose-400 border-rose-500/30 bg-rose-500/10",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400",
                )}
              />
              {connected ? "Live" : "Disconnected"}
            </span>
          </div>
          <p className="text-fe-text-3 text-sm">
            Real-time fraud scoring powered by XGBoost + SHAP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-fe border text-xs font-medium transition-all",
              showFilters
                ? "bg-fe-cyan/10 border-fe-cyan/40 text-fe-cyan"
                : "bg-fe-surface border-fe-border text-fe-text-2 hover:border-fe-border2",
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform",
                showFilters && "rotate-180",
              )}
            />
          </button>
          <button
            onClick={clear}
            className="flex items-center gap-2 px-3 py-2 rounded-fe border border-fe-border bg-fe-surface text-fe-text-3 text-xs hover:text-fe-danger hover:border-fe-danger/40 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatPill label="Total" value={counts.total} color="border-fe-border" />
        <StatPill label="High" value={counts.high} color="border-rose-500/20" />
        <StatPill
          label="Medium"
          value={counts.medium}
          color="border-amber-500/20"
        />
        <StatPill
          label="Low"
          value={counts.low}
          color="border-emerald-500/20"
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-fe bg-fe-danger/10 border border-fe-danger/30 text-fe-danger text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 p-4 rounded-fe bg-fe-surface border border-fe-border">
              <select
                value={filters.riskLabel}
                onChange={(e) =>
                  setFilters({ ...filters, riskLabel: e.target.value })
                }
                className="bg-fe-card border border-fe-border text-fe-text-2 text-sm rounded-fe px-3 py-2 focus:outline-none focus:border-fe-cyan transition-colors"
              >
                <option value="">All Risk Levels</option>
                <option value="critical">Critical Fraud</option>
                <option value="high">High Risk</option>
                <option value="medium">Moderate Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <input
                type="text"
                placeholder="Search by ID, user, or merchant..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="flex-1 bg-fe-card border border-fe-border text-fe-text-2 text-sm rounded-fe px-3 py-2 placeholder:text-fe-text-3 focus:outline-none focus:border-fe-cyan transition-colors"
              />
              <button
                onClick={() => setFilters({ riskLabel: "", search: "" })}
                className="px-3 py-2 rounded-fe border border-fe-border text-fe-text-3 text-xs hover:text-fe-text transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="fe-glass rounded-fe-xl overflow-hidden fe-glow-cyan">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fe-border bg-fe-surface/50">
                {[
                  "Time",
                  "Txn ID",
                  "User",
                  "Merchant",
                  "Amount",
                  "Risk Score",
                  "Label",
                ].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-3 text-fe-text-3 text-xs uppercase tracking-wider font-medium",
                      h === "Amount" || h === "Risk Score"
                        ? "text-right"
                        : h === "Label"
                          ? "text-center"
                          : "text-left",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Activity className="w-8 h-8 text-fe-text-3 animate-pulse" />
                        <p className="text-fe-text-3 text-sm">
                          {connected
                            ? "Monitoring for transactions..."
                            : "Connecting to live feed..."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((txn, i) => (
                    <TxnRow
                      key={txn.transactionId || i}
                      txn={txn}
                      isNew={i < newThreshold}
                      onClick={() => setSelectedTxn(txn)}
                    />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-fe-border bg-fe-surface/30 flex items-center justify-between">
          <p className="text-fe-text-3 text-xs">
            Showing{" "}
            <span className="text-fe-text-2 font-medium">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="text-fe-text-2 font-medium">
              {transactions.length}
            </span>{" "}
            transactions
          </p>
          <p className="text-fe-text-3 text-xs">
            Model: <span className="text-fe-cyan font-mono">xgb_v1</span>
          </p>
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedTxn && (
          <TransactionDetail
            txn={selectedTxn}
            onClose={() => setSelectedTxn(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
