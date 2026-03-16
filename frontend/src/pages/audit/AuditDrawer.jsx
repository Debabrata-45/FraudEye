import { motion, AnimatePresence } from "framer-motion";
import { X, ScrollText, Hash, User, Clock, ArrowRight } from "lucide-react";
import {
  EVENT_TYPES,
  ACTOR_CONFIG,
  RESULT_CONFIG,
  formatExactTime,
} from "./auditData";
import { formatDistanceToNow } from "date-fns";

// ─── Section ──────────────────────────────────────────────────────────────────
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

// ─── Meta row ─────────────────────────────────────────────────────────────────
const MetaRow = ({ label, value, accent }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0">
    <span className="text-xs text-slate-500">{label}</span>
    <span className={`text-xs font-medium ${accent || "text-slate-200"}`}>
      {value}
    </span>
  </div>
);

// ─── Empty ────────────────────────────────────────────────────────────────────
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

// ─── Main drawer ──────────────────────────────────────────────────────────────
const AuditDrawer = ({ log, onClose }) => {
  const evtCfg = log
    ? EVENT_TYPES[log.eventType] || EVENT_TYPES.MODEL_SCORED
    : null;
  const actorCfg = log
    ? ACTOR_CONFIG[log.actor.role] || ACTOR_CONFIG.system
    : null;
  const resultCfg = log
    ? RESULT_CONFIG[log.result] || RESULT_CONFIG.INFO
    : null;

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
                className={`p-4 rounded-xl border mb-5 ${evtCfg.bg} ${evtCfg.border}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{evtCfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold mb-1 ${evtCfg.color}`}>
                      {evtCfg.label}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.detail}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border
                    ${resultCfg.bg} ${resultCfg.border} ${resultCfg.text}`}
                  >
                    {resultCfg.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {log.id}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md border ${actorCfg.bg} ${actorCfg.border} ${actorCfg.color}`}
                  >
                    {evtCfg.category}
                  </span>
                </div>
              </div>

              {/* Who & when */}
              <Section title="Who & When" icon={User}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                  <MetaRow
                    label="Actor"
                    value={log.actor.name}
                    accent={actorCfg.color}
                  />
                  <MetaRow label="Role" value={log.actor.role} />
                  <MetaRow
                    label="Exact Time"
                    value={formatExactTime(log.timestamp)}
                  />
                  <MetaRow
                    label="Relative"
                    value={
                      <span className="flex items-center gap-1">
                        <Clock size={9} />
                        {formatDistanceToNow(log.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                    }
                  />
                  <MetaRow
                    label="IP Address"
                    value={log.ipAddress}
                    accent="text-slate-400"
                  />
                  <MetaRow
                    label="Session ID"
                    value={log.sessionId}
                    accent="text-slate-500"
                  />
                </div>
              </Section>

              {/* Affected entities */}
              <Section title="Affected Entities" icon={Hash}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                  <MetaRow
                    label="Transaction"
                    value={log.entityId}
                    accent="text-cyan-300"
                  />
                  <MetaRow
                    label="Case ID"
                    value={log.caseId}
                    accent="text-violet-300"
                  />
                </div>
              </Section>

              {/* Before / after state */}
              {log.beforeAfter && (
                <Section title="State Change" icon={ArrowRight}>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 rounded-xl bg-rose-500/8 border border-rose-500/15">
                      <p className="text-[10px] text-rose-400 uppercase tracking-wider font-semibold mb-1">
                        Before
                      </p>
                      <p className="text-xs text-slate-300 font-mono">
                        {log.beforeAfter.before}
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
                        {log.beforeAfter.after}
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
