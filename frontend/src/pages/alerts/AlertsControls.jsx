import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import {
  SEVERITY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  SEVERITY,
  ALERT_STATUS,
} from "./alertsData";

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const FilterSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];
  const isActive = value && value !== "ALL";

  // Derive accent from value
  const accentClass = isActive
    ? value in SEVERITY
      ? `border-[${SEVERITY[value]?.color}]/50 text-[${SEVERITY[value]?.color}]`
      : value in ALERT_STATUS
        ? "border-violet-500/40 text-violet-400"
        : "border-cyan-500/40 text-cyan-400"
    : "border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all whitespace-nowrap
          ${isActive ? `bg-slate-800 ${accentClass}` : `bg-slate-800/60 ${accentClass}`}`}
      >
        {selected.label}
        <ChevronDown
          size={11}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-1.5 z-20 min-w-[152px] bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl shadow-black/60 py-1 overflow-hidden"
            >
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
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Controls ─────────────────────────────────────────────────────────────────
const AlertsControls = ({
  filters,
  onChange,
  onReset,
  resultCount,
  totalCount,
}) => {
  const hasActive =
    filters.search ||
    "" ||
    (filters.severity && filters.severity !== "ALL") ||
    (filters.status && filters.status !== "ALL");

  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="mb-4"
    >
      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) => set("search")(e.target.value)}
              placeholder="Search alert ID, title, entity…"
              className="w-full pl-8 pr-8 py-2 text-xs bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200
                placeholder-slate-500 focus:outline-none focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/15
                focus:bg-slate-800 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => set("search")("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={11} />
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-slate-700/50 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-slate-500">
            <SlidersHorizontal size={13} />
            <span className="text-xs hidden sm:block">Triage</span>
          </div>

          {/* Severity — most important filter first */}
          <FilterSelect
            value={filters.severity || "ALL"}
            onChange={set("severity")}
            options={SEVERITY_FILTER_OPTIONS}
          />

          {/* Status */}
          <FilterSelect
            value={filters.status || "ALL"}
            onChange={set("status")}
            options={STATUS_FILTER_OPTIONS}
          />

          <div className="h-6 w-px bg-slate-700/50 hidden sm:block" />

          {/* Sort */}
          <FilterSelect
            value={filters.sort || "time_desc"}
            onChange={set("sort")}
            options={SORT_OPTIONS}
          />

          {/* Reset */}
          <AnimatePresence>
            {hasActive && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={onReset}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs text-slate-400
                  hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
              >
                <RotateCcw size={11} />
                <span className="hidden sm:block">Reset</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Count row */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-medium tabular-nums">
              {resultCount}
            </span>{" "}
            of <span className="text-slate-400 tabular-nums">{totalCount}</span>{" "}
            alerts
          </p>
          {hasActive && (
            <span className="text-xs text-rose-400/70 font-medium">
              Filters active
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AlertsControls;
