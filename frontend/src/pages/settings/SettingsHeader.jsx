import { motion, AnimatePresence } from "framer-motion";
import { Settings2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const SaveState = ({ state }) => {
  const configs = {
    idle: null,
    dirty: {
      icon: AlertCircle,
      text: "Unsaved changes",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
    },
    saving: {
      icon: Loader2,
      text: "Saving…",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      spin: true,
    },
    saved: {
      icon: CheckCircle,
      text: "Changes saved",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    error: {
      icon: AlertCircle,
      text: "Save failed",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/25",
    },
  };

  const cfg = configs[state];
  if (!cfg) return null;
  const _Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium
        ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <_Icon size={12} className={cfg.spin ? "animate-spin" : ""} />
      {cfg.text}
    </motion.div>
  );
};

const SettingsHeader = ({ saveState, user }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mb-6"
  >
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-violet-400 to-cyan-500 flex-shrink-0 mt-0.5" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">
            Settings
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your profile, preferences, and platform configuration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User context pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200 leading-none">
              {user.name}
            </span>
            <span className="text-[10px] text-slate-500 leading-none mt-0.5">
              {user.role}
            </span>
          </div>
          <Settings2 size={12} className="text-slate-500" />
        </div>

        {/* Save state */}
        <AnimatePresence mode="wait">
          {saveState !== "idle" && (
            <SaveState key={saveState} state={saveState} />
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

export default SettingsHeader;
