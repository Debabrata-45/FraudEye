import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Hash,
  User,
  Clock,
  FileSearch,
} from "lucide-react";
import { SEVERITY, ALERT_STATUS, formatAlertTime } from "./alertsData";
import { formatDistanceToNow } from "date-fns";
import { MetaRow } from "../../components/Responsive";

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ title, icon: _Icon, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-3">
      <_Icon size={12} className="text-slate-500" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </span>
    </div>
    {children}
  </div>
);

// ─── Reason tag ───────────────────────────────────────────────────────────────
const ReasonTag = ({ reason, severity }) => {
  const isCritical = severity === "CRITICAL" || severity === "HIGH";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border mr-1.5 mb-1.5
      ${
        isCritical
          ? "bg-rose-500/10 border-rose-500/25 text-rose-300"
          : "bg-amber-500/10 border-amber-500/20 text-amber-300"
      }`}
    >
      <AlertTriangle size={9} />
      {reason}
    </span>
  );
};

// ─── Empty ────────────────────────────────────────────────────────────────────
const DrawerEmpty = () => (
  <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
    <div className="w-14 h-14 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center">
      <ShieldAlert size={22} className="text-slate-600" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400">No alert selected</p>
      <p className="text-xs text-slate-600 mt-1">
        Click any alert to review details
      </p>
    </div>
  </div>
);

// ─── Main drawer ──────────────────────────────────────────────────────────────
const AlertDrawer = ({ alert, onClose }) => {
  const sev = alert ? SEVERITY[alert.severity] || SEVERITY.INFO : null;
  const status = alert
    ? ALERT_STATUS[alert.status] || ALERT_STATUS.DISMISSED
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
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-rose-500 to-violet-500" />
          <span className="text-sm font-semibold text-slate-100">
            Alert Detail
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
          {!alert ? (
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
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* Severity headline */}
              <div
                className={`p-4 rounded-xl border mb-5 ${sev.bgStrong} ${sev.borderStrong}`}
                style={{ boxShadow: `0 0 24px ${sev.color}15` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: sev.color,
                        boxShadow: `0 0 10px ${sev.color}`,
                      }}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${sev.text}`}
                    >
                      {sev.label} Severity
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-black tabular-nums ${sev.text}`}
                  >
                    {alert.riskScore}
                  </span>
                </div>
                <p
                  className={`text-base font-bold leading-snug mb-1 ${sev.textStrong}`}
                >
                  {alert.title}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {alert.summary}
                </p>
                <div className="mt-3 h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${alert.riskScore}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`h-full rounded-full ${sev.bar}`}
                    style={{ boxShadow: `0 0 8px ${sev.color}80` }}
                  />
                </div>
              </div>

              {/* Status + ID strip */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Alert ID
                  </div>
                  <div className="text-xs font-mono font-semibold text-cyan-300">
                    {alert.id}
                  </div>
                </div>
                <div className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Status
                  </div>
                  <span className={`text-xs font-semibold ${status.text}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Alert context — MetaRow from responsive */}
              <Section title="Alert Context" icon={Hash}>
                <div className="bg-slate-800/30 rounded-lg px-3 py-1 border border-slate-700/30">
                  <MetaRow
                    label="Triggered"
                    value={formatAlertTime(alert.ts ?? alert.timestamp)}
                  />
                  <MetaRow label="Linked TXN" value={alert.txnId} />
                  <MetaRow
                    label={alert.entity?.type ?? "Merchant"}
                    value={alert.entity?.value ?? alert.merchant ?? "—"}
                  />
                  <MetaRow
                    label="Location"
                    value={
                      <span className="flex items-center gap-1">
                        <MapPin size={9} />
                        {alert.geo ?? "-"}
                      </span>
                    }
                  />
                  {alert.assignedTo && (
                    <MetaRow
                      label="Assigned"
                      value={
                        <span className="flex items-center gap-1">
                          <User size={9} />
                          {alert.assignedTo}
                        </span>
                      }
                    />
                  )}
                  {alert.resolvedAt && (
                    <MetaRow
                      label="Resolved"
                      value={
                        <span className="flex items-center gap-1">
                          <Clock size={9} />
                          {formatDistanceToNow(alert.resolvedAt, {
                            addSuffix: true,
                          })}
                        </span>
                      }
                    />
                  )}
                </div>
              </Section>

              {/* Fraud signals */}
              <Section title="Fraud Signals" icon={AlertTriangle}>
                <div>
                  {alert.reasons.map((r, i) => (
                    <ReasonTag key={i} reason={r} severity={alert.severity} />
                  ))}
                </div>
              </Section>

              {/* Triage actions */}
              <Section title="Triage Actions" icon={FileSearch}>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: "Escalate Alert",
                      cls: "bg-rose-500/10 border-rose-500/25 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40",
                    },
                    {
                      label: "Mark Under Review",
                      cls: "bg-amber-500/10 border-amber-500/25 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/40",
                    },
                    {
                      label: "Resolve Alert",
                      cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/40",
                    },
                    {
                      label: "Open Investigation",
                      cls: "bg-violet-500/10 border-violet-500/25 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/40",
                    },
                    {
                      label: "Dismiss",
                      cls: "bg-slate-700/30 border-slate-600/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300",
                    },
                  ].map(({ label, cls }) => (
                    <button
                      key={label}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg border transition-all group ${cls}`}
                    >
                      <span className="text-xs font-semibold">{label}</span>
                      <ChevronRight
                        size={13}
                        className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AlertDrawer;
