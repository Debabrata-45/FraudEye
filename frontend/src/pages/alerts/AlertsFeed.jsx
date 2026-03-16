import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Eye } from "lucide-react";
import { SEVERITY, ALERT_STATUS, formatAlertTime } from "./alertsData";

// ─── Severity badge ───────────────────────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const cfg = SEVERITY[severity] || SEVERITY.INFO;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-bold ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: cfg.color,
          boxShadow: `0 0 5px ${cfg.color}80`,
        }}
      />
      {cfg.label}
    </span>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = ALERT_STATUS[status] || ALERT_STATUS.DISMISSED;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

// ─── Reason chip ──────────────────────────────────────────────────────────────
const ReasonChip = ({ reason, severity }) => {
  const isCritical = severity === "CRITICAL" || severity === "HIGH";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border
      ${
        isCritical
          ? "bg-rose-500/10 border-rose-500/20 text-rose-300/80"
          : "bg-slate-700/40 border-slate-600/30 text-slate-400"
      }`}
    >
      {reason}
    </span>
  );
};

// ─── Alert item ───────────────────────────────────────────────────────────────
const AlertItem = ({ alert, isSelected, onClick, isNew }) => {
  const sev = SEVERITY[alert.severity] || SEVERITY.INFO;
  const isCritical = alert.severity === "CRITICAL";
  const isHigh = alert.severity === "HIGH";
  const isResolved =
    alert.status === "RESOLVED" || alert.status === "DISMISSED";

  return (
    <motion.div
      layout
      initial={
        isNew
          ? { opacity: 0, x: -8, backgroundColor: "rgba(244,63,94,0.08)" }
          : { opacity: 0 }
      }
      animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
      transition={{ duration: isNew ? 1.0 : 0.22 }}
      onClick={() => onClick(alert)}
      className={`
        relative flex gap-0 cursor-pointer rounded-xl border transition-all duration-150 overflow-hidden group
        ${
          isSelected
            ? `${sev.bgStrong} ${sev.borderStrong} ${sev.glow}`
            : `bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700/60`
        }
        ${isResolved ? "opacity-60" : ""}
        ${isCritical && !isSelected ? "hover:border-rose-500/25" : ""}
        ${isHigh && !isSelected ? "hover:border-orange-500/20" : ""}
      `}
    >
      {/* Left severity edge */}
      <div
        className={`w-1 flex-shrink-0 rounded-l-xl ${sev.edge} ${isResolved ? "opacity-30" : ""}`}
      />

      {/* Content */}
      <div className="flex-1 px-4 py-3.5 min-w-0">
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + meta */}
          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <SeverityBadge severity={alert.severity} />
              <StatusBadge status={alert.status} />
              <span className="text-[10px] font-mono text-slate-600">
                {alert.id}
              </span>
            </div>

            {/* Title */}
            <p
              className={`text-sm font-semibold leading-snug mb-1 transition-colors
              ${isSelected ? sev.textStrong : "text-slate-100 group-hover:text-white"}
            `}
            >
              {alert.title}
            </p>

            {/* Summary */}
            <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-1">
              {alert.summary}
            </p>

            {/* Reason chips */}
            <div className="flex flex-wrap gap-1">
              {alert.reasons.map((r, i) => (
                <ReasonChip key={i} reason={r} severity={alert.severity} />
              ))}
            </div>
          </div>

          {/* Right: score + time + action */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Risk score */}
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-xl font-black tabular-nums leading-none ${sev.text}`}
              >
                {alert.riskScore}
              </span>
              <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${sev.bar}`}
                  style={{
                    width: `${alert.riskScore}%`,
                    boxShadow:
                      isCritical || isHigh
                        ? `0 0 6px ${sev.color}80`
                        : undefined,
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-600">risk score</span>
            </div>

            {/* Time */}
            <span className="text-[11px] text-slate-500 whitespace-nowrap">
              {formatAlertTime(alert.timestamp)}
            </span>

            {/* View button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(alert);
              }}
              className={`p-1.5 rounded-lg border transition-all
                ${
                  isSelected
                    ? `${sev.bg} ${sev.border} ${sev.text}`
                    : "bg-slate-700/40 border-slate-600/30 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10"
                }`}
            >
              <Eye size={12} />
            </button>
          </div>
        </div>

        {/* Entity + txn footer */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">
              {alert.entity.type}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {alert.entity.value}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600">TXN</span>
            <span className="text-[11px] font-mono text-slate-500">
              {alert.txnId}
            </span>
            {alert.assignedTo && (
              <span className="text-[10px] text-violet-400 font-medium">
                → {alert.assignedTo}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const AlertSkeleton = () => (
  <div className="flex gap-0 rounded-xl border border-slate-800/80 overflow-hidden">
    <div className="w-1 bg-slate-800 animate-pulse" />
    <div className="flex-1 px-4 py-3.5 space-y-2">
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-md bg-slate-800 animate-pulse" />
        <div className="h-5 w-14 rounded-md bg-slate-800 animate-pulse" />
      </div>
      <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" />
      <div className="h-3 w-1/2 rounded bg-slate-800 animate-pulse" />
      <div className="flex gap-1">
        <div className="h-4 w-16 rounded bg-slate-800 animate-pulse" />
        <div className="h-4 w-20 rounded bg-slate-800 animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const AlertsEmpty = ({ hasFilters }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 gap-4"
  >
    <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
      <ShieldAlert size={22} className="text-slate-600" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400">
        {hasFilters ? "No alerts match your filters" : "No alerts detected"}
      </p>
      <p className="text-xs text-slate-600 mt-1">
        {hasFilters
          ? "Try adjusting or resetting your filters"
          : "The system is actively monitoring — alerts will appear here"}
      </p>
    </div>
  </motion.div>
);

// ─── Feed ─────────────────────────────────────────────────────────────────────
const AlertsFeed = ({ alerts, selectedId, onSelect, loading, hasFilters }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.15 }}
    className="flex flex-col gap-2"
  >
    {loading ? (
      Array.from({ length: 6 }, (_, i) => <AlertSkeleton key={i} />)
    ) : alerts.length === 0 ? (
      <AlertsEmpty hasFilters={hasFilters} />
    ) : (
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            isSelected={selectedId === alert.id}
            onClick={onSelect}
            isNew={alert.isNew || false}
          />
        ))}
      </AnimatePresence>
    )}
  </motion.div>
);

export default AlertsFeed;
