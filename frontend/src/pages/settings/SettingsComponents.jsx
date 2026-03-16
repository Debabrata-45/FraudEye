import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// ─── Section card ─────────────────────────────────────────────────────────────
export const SettingsCard = ({ title, description, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
  >
    {/* Card header */}
    <div className="px-5 py-4 border-b border-slate-800/80 flex items-center gap-3">
      {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
      <div>
        <h3 className="text-sm font-bold text-slate-100">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="px-5 py-4 space-y-4">{children}</div>
  </motion.div>
);

// ─── Settings row wrapper ─────────────────────────────────────────────────────
export const SettingsRow = ({ label, description, children, last }) => (
  <div
    className={`flex items-center justify-between gap-4 ${!last ? "pb-4 border-b border-slate-800/50" : ""}`}
  >
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-200">{label}</p>
      {description && (
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
          {description}
        </p>
      )}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

// ─── Toggle switch ────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative w-10 h-5 rounded-full border transition-all duration-200 focus:outline-none
      ${
        checked
          ? "bg-cyan-500/20 border-cyan-500/50"
          : "bg-slate-800 border-slate-700/60"
      }
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <motion.span
      animate={{ x: checked ? 20 : 2 }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
      className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-colors duration-200
        ${checked ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "bg-slate-500"}`}
    />
  </button>
);

// ─── Inline select ────────────────────────────────────────────────────────────
export const SettingsSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60
          text-xs text-slate-200 font-medium hover:border-slate-600 transition-all min-w-[120px]"
      >
        <span className="flex-1 text-left">{selected.label}</span>
        <ChevronDown
          size={11}
          className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[160px] bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl shadow-black/50 py-1 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors
                  ${
                    value === opt.value
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  }`}
              >
                <div>{opt.label}</div>
                {opt.desc && (
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    {opt.desc}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Radio group (segmented) ──────────────────────────────────────────────────
export const RadioGroup = ({ value, onChange, options }) => (
  <div className="flex bg-slate-800/60 rounded-lg p-0.5 border border-slate-700/50 gap-0.5">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
          ${
            value === opt.value
              ? "bg-slate-700 text-slate-100 shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// ─── Info pill ────────────────────────────────────────────────────────────────
export const InfoPill = ({ label, value, colorClass }) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClass || "bg-slate-800/40 border-slate-700/40"}`}
  >
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="text-xs font-semibold text-slate-200">{value}</span>
  </div>
);
