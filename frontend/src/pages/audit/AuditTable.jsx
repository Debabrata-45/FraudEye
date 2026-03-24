import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Eye, ScrollText } from "lucide-react";
import {
  EVENT_TYPES,
  ACTOR_CONFIG,
  RESULT_CONFIG,
  formatExactTime,
} from "./auditData";

/* ── Safe time helper ────────────────────────────────────── */
function safeTimeAgo(ts) {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

/* ── Event badge ─────────────────────────────────────────── */
const EventBadge = ({ eventType }) => {
  const cfg = EVENT_TYPES[eventType] ?? Object.values(EVENT_TYPES)[0];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold
        bg-[${cfg.color}14] border-[${cfg.color}33] text-[${cfg.color}]`}
      style={{
        color: cfg.color,
        background: `${cfg.color}14`,
        borderColor: `${cfg.color}33`,
      }}
    >
      {cfg.label}
    </span>
  );
};

/* ── Actor badge ─────────────────────────────────────────── */
const ActorBadge = ({ actor }) => {
  if (!actor) return <span className="text-[11px] text-slate-500">—</span>;
  const cfg = ACTOR_CONFIG[actor.role] ?? ACTOR_CONFIG.system;
  const display =
    actor.role === "system"
      ? "System"
      : (actor.name ?? "").split("@")[0] || "Unknown";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium
        ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      {display}
    </span>
  );
};

/* ── Result badge ────────────────────────────────────────── */
const ResultBadge = ({ result }) => {
  const cfg = RESULT_CONFIG[result] ?? RESULT_CONFIG.INFO;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium
        ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

/* ── Table row ───────────────────────────────────────────── */
const AuditRow = ({ log, isSelected, onClick, isNew }) => {
  const evtCfg =
    EVENT_TYPES[log.eventType] ??
    EVENT_TYPES[log.actionType] ??
    Object.values(EVENT_TYPES)[0];
  const isDecision = evtCfg?.category === "Decision";
  const isFailure = log.result === "FAILURE";

  return (
    <motion.tr
      layout
      initial={
        isNew
          ? { opacity: 0, backgroundColor: "rgba(34,211,238,0.08)" }
          : { opacity: 0 }
      }
      animate={{ opacity: 1, backgroundColor: "transparent" }}
      transition={{ duration: isNew ? 1.2 : 0.2 }}
      onClick={() => onClick(log)}
      className={`border-b transition-all duration-150 cursor-pointer group
        ${isSelected ? "bg-slate-800/80 border-b-slate-700" : "border-b-slate-800/60 hover:bg-slate-800/40"}
        ${isFailure && !isSelected ? "hover:bg-rose-500/5" : ""}
      `}
    >
      {/* Left accent edge */}
      <td className="w-0.5 p-0">
        <div
          className={`w-0.5 min-h-[48px] h-full transition-all duration-150
            ${
              isSelected
                ? `opacity-100 ${isDecision ? "" : "bg-cyan-500"}`
                : isDecision
                  ? "opacity-0 group-hover:opacity-30"
                  : "opacity-0 group-hover:opacity-20 bg-slate-500"
            }`}
          style={isDecision ? { backgroundColor: evtCfg?.color } : undefined}
        />
      </td>

      {/* Log ID + relative time */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-xs font-mono font-semibold transition-colors
            ${isSelected ? "text-cyan-300" : "text-slate-300 group-hover:text-cyan-300"}`}
          >
            #{log.id}
          </span>
          <span className="text-[10px] text-slate-600">
            {safeTimeAgo(log.timestamp ?? log.ts)}
          </span>
        </div>
      </td>

      {/* Exact timestamp */}
      <td className="px-3 py-3">
        <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
          {formatExactTime(log.timestamp ?? log.ts)}
        </span>
      </td>

      {/* Actor */}
      <td className="px-3 py-3">
        <ActorBadge actor={log.actor} />
      </td>

      {/* Event type */}
      <td className="px-3 py-3">
        <EventBadge eventType={log.eventType ?? log.actionType} />
      </td>

      {/* Entity */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-mono text-slate-300">
            {log.entityId ?? "—"}
          </span>
          <span className="text-[10px] text-slate-600">
            {log.caseId ?? log.entityType ?? ""}
          </span>
        </div>
      </td>

      {/* Result */}
      <td className="px-3 py-3">
        <ResultBadge result={log.result} />
      </td>

      {/* Action */}
      <td className="px-3 py-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(log);
          }}
          className={`p-1.5 rounded-lg border transition-all
            ${
              isSelected
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : "bg-slate-700/30 border-slate-600/30 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/25 hover:bg-cyan-500/10"
            }`}
        >
          <Eye size={12} />
        </button>
      </td>
    </motion.tr>
  );
};

/* ── Skeleton ────────────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="border-b border-slate-800/50">
    <td className="w-0.5 p-0" />
    {[56, 80, 60, 88, 72, 52, 28].map((w, i) => (
      <td key={i} className="px-3 py-3.5">
        <div
          className="h-3 rounded bg-slate-800 animate-pulse"
          style={{ width: w }}
        />
      </td>
    ))}
  </tr>
);

/* ── Empty ───────────────────────────────────────────────── */
const EmptyRows = ({ hasFilters }) => (
  <tr>
    <td colSpan={8} className="py-20 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
          <ScrollText size={20} className="text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">
            {hasFilters
              ? "No logs match your filters"
              : "No audit logs available"}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {hasFilters
              ? "Try adjusting or resetting your filters"
              : "System activity will appear here"}
          </p>
        </div>
      </div>
    </td>
  </tr>
);

/* ── Main table ──────────────────────────────────────────── */
const HEADERS = [
  "Log ID",
  "Timestamp",
  "Actor",
  "Event",
  "Entity / Case",
  "Result",
  "",
];

const AuditTable = ({ logs, selectedId, onSelect, loading, hasFilters }) => (
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
            {HEADERS.map((h, i) => (
              <th
                key={i}
                className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)
          ) : logs.length === 0 ? (
            <EmptyRows hasFilters={hasFilters} />
          ) : (
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <AuditRow
                  key={log.id}
                  log={log}
                  isSelected={selectedId === log.id}
                  onClick={onSelect}
                  isNew={log.isNew || false}
                />
              ))}
            </AnimatePresence>
          )}
        </tbody>
      </table>
    </div>

    {logs.length > 0 && !loading && (
      <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          {logs.length} entries displayed
        </span>
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Eye size={10} /> Click row to expand
        </span>
      </div>
    )}
  </motion.div>
);

export default AuditTable;
