import { motion } from "framer-motion";
import { CheckCircle, Wifi } from "lucide-react";
import { SettingsCard } from "./SettingsComponents";

const SysRow = ({ label, value, accent, mono }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
    <span className="text-xs text-slate-500">{label}</span>
    <span
      className={`text-xs font-semibold ${mono ? "font-mono" : ""} ${accent || "text-slate-200"}`}
    >
      {value}
    </span>
  </div>
);

const StatusDot = ({ ok, label }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${ok ? "bg-emerald-400 shadow-[0_0_6px_#22C55E]" : "bg-rose-400 shadow-[0_0_6px_#F43F5E]"}`}
    />
    <span className="text-xs text-slate-300">{label}</span>
    {ok ? (
      <CheckCircle size={11} className="text-emerald-400 ml-auto" />
    ) : (
      <Wifi size={11} className="text-rose-400 ml-auto" />
    )}
  </div>
);

const SystemSection = ({ info }) => (
  <SettingsCard
    title="System Information"
    description="Platform environment, model status, and connectivity"
    icon="⚙️"
  >
    {/* Status indicators */}
    <div className="grid grid-cols-2 gap-2 mb-2">
      <StatusDot
        ok={info.apiStatus === "Healthy"}
        label={`API: ${info.apiStatus}`}
      />
      <StatusDot
        ok={info.wsStatus === "Connected"}
        label={`Stream: ${info.wsStatus}`}
      />
    </div>

    {/* System metadata */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="bg-slate-800/30 rounded-xl px-4 py-1 border border-slate-700/30"
    >
      <SysRow
        label="App Version"
        value={info.appVersion}
        mono
        accent="text-cyan-300"
      />
      <SysRow
        label="Environment"
        value={info.environment}
        accent={
          info.environment === "Production"
            ? "text-emerald-300"
            : "text-amber-300"
        }
      />
      <SysRow
        label="ML Model"
        value={info.model}
        mono
        accent="text-violet-300"
      />
      <SysRow
        label="XAI Method"
        value={info.xaiMethod}
        accent="text-violet-200"
      />
      <SysRow
        label="Model AUC"
        value={info.modelAuc}
        mono
        accent="text-cyan-300"
      />
      <SysRow label="Last Deploy" value={info.lastDeploy} />
    </motion.div>

    <p className="text-[11px] text-slate-600">
      System configuration is managed by platform administrators. Contact admin
      for model or infrastructure changes.
    </p>
  </SettingsCard>
);

export default SystemSection;
