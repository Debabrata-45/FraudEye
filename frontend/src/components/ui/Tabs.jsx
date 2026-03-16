/**
 * Tabs.jsx — FraudEye Tab & Segmented Navigation
 *
 * Exports:
 *   TabGroup         — underline-style animated tabs
 *   SegmentedControl — pill-style segmented selector
 *   NavChip          — compact chip navigation item
 *   NavChipGroup     — horizontal group of NavChips
 *
 * All use Framer Motion layoutId for the animated active indicator.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/* ── TabGroup ────────────────────────────────────────────── */
export function TabGroup({
  tabs,
  value,
  onChange,
  className = "",
  id = "tabgroup",
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-0 border-b border-[#0F172A] overflow-x-auto",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        const key = tab.value ?? tab.label;

        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.value ?? tab.label)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-3 flex-shrink-0",
              "text-xs font-medium transition-colors duration-150 outline-none",
              "focus-visible:bg-[#FFFFFF04]",
              isActive
                ? "text-[#22D3EE]"
                : "text-[#475569] hover:text-[#94A3B8]",
            )}
          >
            {tab.icon && <tab.icon size={13} strokeWidth={1.5} />}
            {tab.label}
            {tab.count != null && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-bold min-w-[16px] text-center",
                  isActive
                    ? "bg-[#22D3EE18] text-[#22D3EE]"
                    : "bg-[#1E293B] text-[#475569]",
                )}
              >
                {tab.count}
              </span>
            )}

            {/* Animated underline */}
            {isActive && (
              <motion.span
                layoutId={`${id}-tab-indicator`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22D3EE] rounded-t-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── SegmentedControl ────────────────────────────────────── */
export function SegmentedControl({
  options,
  value,
  onChange,
  size = "sm",
  className = "",
  id = "seg",
}) {
  const heights = { xs: "h-6", sm: "h-7", md: "h-8" };
  const textSz = { xs: "text-[10px]", sm: "text-xs", md: "text-sm" };
  const px = { xs: "px-2", sm: "px-3", md: "px-4" };

  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 rounded-lg",
        "bg-[#0A1628] border border-[#1E293B]",
        className,
      )}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const isActive = value === val;

        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange?.(val)}
            className={cn(
              "relative flex-shrink-0 flex items-center justify-center",
              "font-medium rounded-md transition-colors duration-150 outline-none",
              heights[size],
              px[size],
              textSz[size],
              isActive
                ? "text-[#F8FAFC]"
                : "text-[#475569] hover:text-[#94A3B8]",
            )}
          >
            {/* Active background pill */}
            {isActive && (
              <motion.span
                layoutId={`${id}-seg-pill`}
                className="absolute inset-0 bg-[#1E293B] rounded-md border border-[#334155]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── NavChip ─────────────────────────────────────────────── */
export function NavChip({
  label,
  active = false,
  onClick,
  icon: Icon,
  count,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 h-7 rounded-full",
        "text-xs font-medium border transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#22D3EE44]",
        active
          ? "bg-[#22D3EE14] text-[#22D3EE] border-[#22D3EE33]"
          : "text-[#475569] border-[#1E293B] hover:text-[#94A3B8] hover:border-[#334155]",
        className,
      )}
    >
      {Icon && <Icon size={11} strokeWidth={1.5} />}
      {label}
      {count != null && (
        <span
          className={cn(
            "text-[9px] font-bold px-1 rounded",
            active
              ? "bg-[#22D3EE22] text-[#22D3EE]"
              : "bg-[#1E293B] text-[#475569]",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── NavChipGroup ────────────────────────────────────────── */
export function NavChipGroup({ chips = [], value, onChange, className = "" }) {
  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <NavChip
          key={chip.value ?? chip.label}
          label={chip.label}
          icon={chip.icon}
          count={chip.count}
          active={value === (chip.value ?? chip.label)}
          onClick={() => onChange?.(chip.value ?? chip.label)}
        />
      ))}
    </div>
  );
}

/* ── useTab — convenience hook ───────────────────────────── */
// eslint-disable-next-line react-refresh/only-export-components
export function useTab(initial) {
  const [tab, setTab] = useState(initial);
  return [tab, setTab];
}
