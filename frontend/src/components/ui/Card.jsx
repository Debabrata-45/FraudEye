/**
 * Card.jsx — FraudEye Surface Primitives
 *
 * Exports:
 *   GlassCard      — standard glassmorphism card (most common)
 *   GlowCard       — glass card with accent glow border
 *   FlatCard       — minimal flat surface, no glass effect
 *   PanelShell     — full-bleed panel with header/body/footer slots
 *   SectionWrapper — logical section wrapper with label + optional action
 *   InsetPanel     — recessed inset surface for nested content
 *
 * When to use which:
 *   GlassCard   → general cards, stat tiles, content blocks
 *   GlowCard    → highlighted metrics, active alerts, emphasized items
 *   FlatCard    → table rows, compact list items, dense layouts
 *   PanelShell  → full sections with titled header (Analytics, Queue etc.)
 *   SectionWrapper → groups of cards with a section label
 *   InsetPanel  → SHAP bars, code blocks, nested detail areas
 */

import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/* ── Glow map ────────────────────────────────────────────── */
const GLOW = {
  cyan: "border-[#22D3EE44] shadow-[0_0_20px_#22D3EE12]",
  violet: "border-[#8B5CF644] shadow-[0_0_20px_#8B5CF612]",
  danger: "border-[#F43F5E44] shadow-[0_0_20px_#F43F5E12]",
  success: "border-[#22C55E44] shadow-[0_0_20px_#22C55E12]",
  warning: "border-[#F59E0B44] shadow-[0_0_20px_#F59E0B12]",
  none: "border-[#1E293B]",
};

/* ── GlassCard ───────────────────────────────────────────── */
export function GlassCard({
  children,
  className = "",
  padding = "p-5",
  animate = false,
  onClick,
}) {
  const base = cn(
    "bg-[#111827]/80 border border-[#1E293B] rounded-xl backdrop-blur-sm",
    padding,
    onClick && "cursor-pointer",
    className,
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={
          onClick ? { y: -1, transition: { duration: 0.15 } } : undefined
        }
        onClick={onClick}
        className={base}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={base}>
      {children}
    </div>
  );
}

/* ── GlowCard ────────────────────────────────────────────── */
export function GlowCard({
  children,
  glow = "cyan",
  className = "",
  padding = "p-5",
  animate = false,
  onClick,
}) {
  const base = cn(
    "bg-[#111827]/80 border rounded-xl backdrop-blur-sm transition-shadow duration-200",
    GLOW[glow] ?? GLOW.cyan,
    padding,
    onClick && "cursor-pointer hover:shadow-[0_0_32px_#22D3EE1A]",
    className,
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={onClick}
        className={base}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={base}>
      {children}
    </div>
  );
}

/* ── FlatCard ────────────────────────────────────────────── */
export function FlatCard({
  children,
  className = "",
  padding = "p-4",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#0A1628] border border-[#0F172A] rounded-lg",
        padding,
        onClick &&
          "cursor-pointer hover:bg-[#0F1F35] transition-colors duration-150",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── PanelShell ──────────────────────────────────────────── */
export function PanelShell({
  title,
  subtitle,
  action,
  children,
  footer,
  className = "",
  bodyClass = "",
  glow,
}) {
  const Card = glow ? GlowCard : GlassCard;
  const cardProps = glow ? { glow, padding: "p-0" } : { padding: "p-0" };

  return (
    <Card {...cardProps} className={cn("overflow-hidden", className)}>
      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#0F172A]">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-[#F8FAFC] truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-[#475569] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      {/* Body */}
      <div className={cn("p-5", bodyClass)}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-5 py-3 border-t border-[#0F172A] bg-[#080F1A]/40">
          {footer}
        </div>
      )}
    </Card>
  );
}

/* ── SectionWrapper ──────────────────────────────────────── */
export function SectionWrapper({
  label,
  action,
  children,
  className = "",
  spacing = "mb-8",
}) {
  return (
    <section className={cn(spacing, className)}>
      {label && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="fe-section-heading">{label}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/* ── InsetPanel ──────────────────────────────────────────── */
export function InsetPanel({ children, className = "" }) {
  return (
    <div
      className={cn(
        "bg-[#080F1A] border border-[#0F172A] rounded-lg p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
