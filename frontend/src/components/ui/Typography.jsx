/**
 * Typography.jsx — FraudEye Text & Heading Primitives
 *
 * Exports:
 *   PageHeader      — large page-level title + subtitle + actions
 *   SectionHeading  — labeled section with left accent bar
 *   CardTitle       — title inside a card/panel
 *   MetaText        — supporting meta info (timestamps, IDs, tags)
 *   Label           — tiny uppercase field label
 *   HelperText      — small hint text below inputs
 *   GradientHeading — cyan-to-violet gradient display heading
 *   MonoText        — monospace text for IDs, hashes, code values
 *   TruncatedText   — single-line overflow-hidden text with title tooltip
 */

import { cn } from "../../utils/cn";

/* ── PageHeader ──────────────────────────────────────────── */
export function PageHeader({
  title,
  subtitle,
  actions,
  className = "",
  eyebrow,
}) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 mb-6", className)}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-bold text-[#F8FAFC] leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#475569] mt-1 leading-none">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
          {actions}
        </div>
      )}
    </div>
  );
}

/* ── SectionHeading ──────────────────────────────────────── */
export function SectionHeading({ children, className = "" }) {
  return (
    <h3
      className={cn(
        "text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8]",
        "pl-3 border-l-2 border-[#22D3EE] leading-none",
        className,
      )}
    >
      {children}
    </h3>
  );
}

/* ── CardTitle ───────────────────────────────────────────── */
export function CardTitle({ children, subtitle, className = "" }) {
  return (
    <div className={cn("mb-4", className)}>
      <h4 className="text-sm font-semibold text-[#F8FAFC] leading-none">
        {children}
      </h4>
      {subtitle && (
        <p className="text-[11px] text-[#475569] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

/* ── MetaText ────────────────────────────────────────────── */
export function MetaText({ children, className = "" }) {
  return (
    <span className={cn("text-[11px] text-[#475569] leading-none", className)}>
      {children}
    </span>
  );
}

/* ── Label ───────────────────────────────────────────────── */
export function Label({ children, className = "", required }) {
  return (
    <label
      className={cn(
        "block text-[10px] font-semibold uppercase tracking-widest text-[#64748B] mb-1.5",
        className,
      )}
    >
      {children}
      {required && <span className="text-[#F43F5E] ml-0.5">*</span>}
    </label>
  );
}

/* ── HelperText ──────────────────────────────────────────── */
export function HelperText({ children, error, className = "" }) {
  return (
    <p
      className={cn(
        "text-[11px] mt-1.5 leading-snug",
        error ? "text-[#F43F5E]" : "text-[#475569]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ── GradientHeading ─────────────────────────────────────── */
export function GradientHeading({ children, size = "xl", className = "" }) {
  const sizes = {
    sm: "text-base font-bold",
    md: "text-lg font-bold",
    xl: "text-xl font-bold",
    "2xl": "text-2xl font-bold",
    "3xl": "text-3xl font-extrabold",
  };
  return (
    <span
      className={cn(
        sizes[size] ?? sizes.xl,
        "bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── MonoText ────────────────────────────────────────────── */
export function MonoText({ children, dim, className = "" }) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] tracking-wide",
        dim ? "text-[#475569]" : "text-[#94A3B8]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── TruncatedText ───────────────────────────────────────── */
export function TruncatedText({ children, className = "" }) {
  return (
    <span
      title={typeof children === "string" ? children : undefined}
      className={cn("block truncate", className)}
    >
      {children}
    </span>
  );
}
