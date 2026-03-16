/**
 * Input.jsx — FraudEye Filter & Input Controls
 *
 * Exports:
 *   TextInput      — standard text field with label + helper
 *   SearchBar      — prominent search input with icon + clear
 *   Select         — styled native select with chevron
 *   FilterChip     — toggleable filter pill
 *   FilterChipGroup — managed group of FilterChips
 *   DateRangeShell — placeholder shell for date range picker
 */

import { useRef } from "react";
import { Search, X, ChevronDown, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { Label, HelperText } from "./Typography";

/* ── Base input class ────────────────────────────────────── */
const INPUT_BASE = cn(
  "w-full bg-[#0A1628] border border-[#1E293B] rounded-lg",
  "text-sm text-[#F8FAFC] placeholder:text-[#334155]",
  "transition-colors duration-150 outline-none",
  "focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE22]",
  "disabled:opacity-40 disabled:cursor-not-allowed",
);

/* ── TextInput ───────────────────────────────────────────── */
export function TextInput({
  label,
  helper,
  error,
  icon: Icon,
  iconRight,
  required,
  className = "",
  inputClass = "",
  id,
  ...props
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <span className="absolute left-3 text-[#334155] pointer-events-none">
            <Icon size={14} strokeWidth={1.5} />
          </span>
        )}

        <input
          id={inputId}
          className={cn(
            INPUT_BASE,
            "h-9 px-3 py-2",
            Icon && "pl-9",
            iconRight && "pr-9",
            error &&
              "border-[#F43F5E33] focus:border-[#F43F5E] focus:ring-[#F43F5E22]",
            inputClass,
          )}
          {...props}
        />

        {iconRight && (
          <span className="absolute right-3 text-[#334155] pointer-events-none">
            <iconRight size={14} strokeWidth={1.5} />
          </span>
        )}
      </div>

      {(helper || error) && (
        <HelperText error={!!error}>{error ?? helper}</HelperText>
      )}
    </div>
  );
}

/* ── SearchBar ───────────────────────────────────────────── */
export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search transactions, merchants, IDs…",
  className = "",
  size = "md",
}) {
  const inputRef = useRef(null);
  const hasValue = value && value.length > 0;

  const heights = { sm: "h-8", md: "h-9", lg: "h-10" };

  return (
    <div className={cn("relative flex items-center group", className)}>
      {/* Search icon */}
      <span
        className="absolute left-3 text-[#334155] group-focus-within:text-[#22D3EE]
                        transition-colors duration-150 pointer-events-none z-10"
      >
        <Search size={14} strokeWidth={1.5} />
      </span>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          INPUT_BASE,
          heights[size] ?? heights.md,
          "pl-9 pr-9 text-sm",
          "group-focus-within:border-[#22D3EE22]",
        )}
      />

      {/* Clear button */}
      <AnimatePresence>
        {hasValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            type="button"
            onClick={() => {
              onClear?.();
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-0.5 rounded text-[#334155]
                        hover:text-[#94A3B8] hover:bg-[#FFFFFF08] transition-colors"
            aria-label="Clear search"
          >
            <X size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Select ──────────────────────────────────────────────── */
export function Select({
  label,
  helper,
  error,
  options = [],
  className = "",
  selectClass = "",
  required,
  id,
  ...props
}) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={cn(
            INPUT_BASE,
            "h-9 pl-3 pr-8 appearance-none cursor-pointer",
            error && "border-[#F43F5E33]",
            selectClass,
          )}
          {...props}
        >
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ),
          )}
        </select>

        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className="absolute right-2.5 top-1/2 -translate-y-1/2
                      text-[#334155] pointer-events-none"
        />
      </div>

      {(helper || error) && (
        <HelperText error={!!error}>{error ?? helper}</HelperText>
      )}
    </div>
  );
}

/* ── FilterChip ──────────────────────────────────────────── */
export function FilterChip({
  label,
  active = false,
  onToggle,
  color = "cyan",
  count,
  className = "",
}) {
  const colors = {
    cyan: active
      ? "bg-[#22D3EE18] text-[#22D3EE] border-[#22D3EE44]"
      : "text-[#475569] border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
    violet: active
      ? "bg-[#8B5CF618] text-[#8B5CF6] border-[#8B5CF644]"
      : "text-[#475569] border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
    danger: active
      ? "bg-[#F43F5E18] text-[#F43F5E] border-[#F43F5E44]"
      : "text-[#475569] border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
    success: active
      ? "bg-[#22C55E18] text-[#22C55E] border-[#22C55E44]"
      : "text-[#475569] border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
    warning: active
      ? "bg-[#F59E0B18] text-[#F59E0B] border-[#F59E0B44]"
      : "text-[#475569] border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full",
        "text-xs font-medium border transition-all duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE44]",
        colors[color] ?? colors.cyan,
        className,
      )}
    >
      {label}
      {count != null && (
        <span className="text-[10px] opacity-70">({count})</span>
      )}
    </button>
  );
}

/* ── FilterChipGroup ─────────────────────────────────────── */
export function FilterChipGroup({
  chips = [],
  value,
  onChange,
  className = "",
}) {
  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <FilterChip
          key={chip.value ?? chip.label}
          label={chip.label}
          count={chip.count}
          color={chip.color}
          active={value === (chip.value ?? chip.label)}
          onToggle={() => onChange?.(chip.value ?? chip.label)}
        />
      ))}
    </div>
  );
}

/* ── DateRangeShell ──────────────────────────────────────── */
export function DateRangeShell({ label, value, onClick, className = "" }) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label && <Label>{label}</Label>}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          INPUT_BASE,
          "h-9 px-3 flex items-center gap-2 text-sm text-left",
          !value && "text-[#334155]",
        )}
      >
        <Calendar
          size={13}
          strokeWidth={1.5}
          className="text-[#334155] flex-shrink-0"
        />
        <span className="flex-1 truncate">{value ?? "Select date range"}</span>
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className="text-[#334155] flex-shrink-0"
        />
      </button>
    </div>
  );
}
