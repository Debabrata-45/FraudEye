import { motion, AnimatePresence } from "framer-motion";
import { X, ScrollText, Hash, User, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { MetaRow } from "../../components/Responsive";

/* ── Category config (derived from useAuditData normalizeLog) ── */
const CATEGORY_CONFIG = {
  Decision: {
    bg: "bg-[#22D3EE0A]",
    border: "border-[#22D3EE25]",
    color: "text-[#22D3EE]",
    icon: "⚖️",
  },
  Alert: {
    bg: "bg-[#F43F5E0A]",
    border: "border-[#F43F5E25]",
    color: "text-[#F43F5E]",
    icon: "🚨",
  },
  Config: {
    bg: "bg-[#8B5CF60A]",
    border: "border-[#8B5CF625]",
    color: "text-[#8B5CF6]",
    icon: "⚙️",
  },
  Auth: {
    bg: "bg-[#F59E0B0A]",
    border: "border-[#F59E0B25]",
    color: "text-[#F59E0B]",
    icon: "🔐",
  },
  Model: {
    bg: "bg-[#22C55E0A]",
    border: "border-[#22C55E25]",
    color: "text-[#22C55E]",
    icon: "🤖",
  },
  System: {
    bg: "bg-[#47556910]",
    border: "border-[#33415530]",
    color: "text-[#64748B]",
    icon: "🖥️",
  },
};

const RESULT_CONFIG = {
  SUCCESS: {
    bg: "bg-[#22C55E0A]",
    border: "border-[#22C55E25]",
    text: "text-[#22C55E]",
    label: "Success",
  },
  FAILURE: {
    bg: "bg-[#F43F5E0A]",
    border: "border-[#F43F5E25]",
    text: "text-[#F43F5E]",
    label: "Failed",
  },
};

/* ── Section wrapper ─────────────────────────────────────── */
const Section = ({ title, icon: _Icon, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2.5">
      <_Icon size={12} className="text-slate-500" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </span>
    </div>
    {children}
  </div>
);

/* ── Empty state ─────────────────────────────────────────── */
const DrawerEmpty = () => (
  <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
    <div className="w-14 h-14 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center">
      <ScrollText size={22} className="text-slate-600" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400">No log selected</p>
      <p className="text-xs text-slate-600 mt-1">
        Click any row to view full audit details
      </p>
    </div>
  </div>
);

/* ── Main drawer ─────────────────────────────────────────── */
const AuditDrawer = ({ log, onClose }) => {
  const catCfg = log
    ? (CATEGORY_CONFIG[log.category] ?? CATEGORY_CONFIG.System)
    : null;
  const resultCfg = log
    ? (RESULT_CONFIG[log.result] ?? RESULT_CONFIG.SUCCESS)
    : null;
  const ts = log ? new Date(log.ts) : null;
  const timeAgo = ts ? formatDistanceToNow(ts, { addSuffix: true }) : "—";
  const timeExact = ts ? format(ts, "MMM dd, yyyy HH:mm:ss") : "—";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col h-full bg-slate-900/95 border-l border-slate-800 backdrop-blur-md overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-slate-400 to-cyan-500" />
          <span className="text-sm font-semibold text-slate-100">
            Log Detail
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {!log ? (
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
              key={log.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* Event headline */}
              <div
                className={`p-4 rounded-xl border mb-5 ${catCfg.bg} ${catCfg.border}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{catCfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold mb-1 ${catCfg.color}`}>
                      {log.actionType?.replace(/_/g, " ").toUpperCase() ??
                        "UNKNOWN EVENT"}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.meta
                        ? Object.entries(log.meta)
                            .slice(0, 3)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")
                        : "No additional details"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${resultCfg.bg} ${resultCfg.border} ${resultCfg.text}`}
                  >
                    {resultCfg.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {log.id}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md border ${catCfg.bg} ${catCfg.border} ${catCfg.color}`}
                  >
                    {log.category}
                  </span>
                </div>
              </div>

              {/* Who & when */}
              <Section title="Who & When" icon={User}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                  <MetaRow label="Actor" value={log.actorEmail ?? "system"} />
                  <MetaRow label="Role" value={log.actorRole ?? "system"} />
                  <MetaRow label="Exact Time" value={timeExact} mono />
                  <MetaRow
                    label="Relative"
                    value={
                      <span className="flex items-center gap-1">
                        <Clock size={9} />
                        {timeAgo}
                      </span>
                    }
                  />
                </div>
              </Section>

              {/* Affected entity */}
              {(log.entityId || log.entityType) && (
                <Section title="Affected Entity" icon={Hash}>
                  <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                    {log.entityType && (
                      <MetaRow label="Type" value={log.entityType} />
                    )}
                    {log.entityId && (
                      <MetaRow
                        label="Entity ID"
                        value={String(log.entityId)}
                        mono
                      />
                    )}
                  </div>
                </Section>
              )}

              {/* Meta details */}
              {log.meta && Object.keys(log.meta).length > 0 && (
                <Section title="Event Details" icon={ScrollText}>
                  <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                    {Object.entries(log.meta).map(([k, v]) => (
                      <MetaRow
                        key={k}
                        label={k.replace(/_/g, " ")}
                        value={
                          typeof v === "object"
                            ? JSON.stringify(v)
                            : String(v ?? "—")
                        }
                        mono={
                          typeof v === "number" ||
                          k.toLowerCase().includes("id")
                        }
                      />
                    ))}
                  </div>
                </Section>
              )}

              {/* Before / after */}
              {(log.before || log.after) && (
                <Section title="State Change" icon={ArrowRight}>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 rounded-xl bg-rose-500/8 border border-rose-500/15">
                      <p className="text-[10px] text-rose-400 uppercase tracking-wider font-semibold mb-1">
                        Before
                      </p>
                      <p className="text-xs text-slate-300 font-mono">
                        {log.before ? JSON.stringify(log.before) : "—"}
                      </p>
                    </div>
                    <div className="flex items-center text-slate-600 flex-shrink-0">
                      <ArrowRight size={14} />
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                        After
                      </p>
                      <p className="text-xs text-slate-300 font-mono">
                        {log.after ? JSON.stringify(log.after) : "—"}
                      </p>
                    </div>
                  </div>
                </Section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AuditDrawer;
