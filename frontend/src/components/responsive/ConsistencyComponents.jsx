/**
 * ConsistencyComponents.jsx — FraudEye Visual Consistency Primitives
 *
 * Phase 16 — drop-in replacements for ad-hoc inline styling.
 * Using these ensures every page uses identical spacing,
 * hierarchy, and visual treatment.
 *
 * Exports:
 *   PageLayout         — standard page wrapper with correct padding
 *   PageHeader         — page title + subtitle + right-side actions
 *   SectionBlock       — labeled section with heading + content area
 *   ControlsBar        — responsive filter/search/action row
 *   SplitLayout        — left list + right detail panel layout
 *   ThreeColLayout     — three-column analyst workspace layout
 *   CardGrid           — responsive card grid with spotlight support
 *   DataTable          — table wrapper with horizontal scroll
 *   PanelCard          — standard content card
 *   PanelHeader        — standard panel/card header row
 *   Divider            — section separator
 *   MetaRow            — label + value row (used in drawers/panels)
 */

import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { useSpotlightGroup } from "../polish/useSpotlight";

/* ════════════════════════════════════════════════════════════
   PAGE LAYOUT
   ════════════════════════════════════════════════════════════ */

/**
 * PageLayout — wraps entire page content with correct
 * responsive padding and max-width.
 * Replaces all manual px-5 md:px-6 lg:px-8 patterns.
 */
export function PageLayout({ children, className = "" }) {
  return <div className={cn("fe-page-wrapper", className)}>{children}</div>;
}

/* ════════════════════════════════════════════════════════════
   PAGE HEADER
   ════════════════════════════════════════════════════════════ */

/**
 * PageHeader — consistent page title + subtitle + right actions.
 * Use at the top of every page's main component.
 */
export function PageHeader({
  title,
  subtitle,
  badge, // optional: ReactNode placed beside title
  actions, // optional: ReactNode for right-side buttons
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex items-start justify-between gap-4 flex-wrap mb-6",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="fe-page-title">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="fe-body-text mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION BLOCK
   ════════════════════════════════════════════════════════════ */

/**
 * SectionBlock — standard section with heading + gap + content.
 * Replaces ad-hoc heading + div patterns.
 */
export function SectionBlock({
  heading,
  headingAction,
  children,
  className = "",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={cn("fe-section-gap", className)}
    >
      {heading && (
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="fe-section-heading">{heading}</h2>
          {headingAction && (
            <div className="flex-shrink-0">{headingAction}</div>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   CONTROLS BAR
   ════════════════════════════════════════════════════════════ */

/**
 * ControlsBar — wraps search + filters + actions.
 * Handles responsive wrap automatically.
 */
export function ControlsBar({ children, className = "" }) {
  return (
    <div className={cn("fe-controls-bar mb-4", className)}>{children}</div>
  );
}

/* ════════════════════════════════════════════════════════════
   SPLIT LAYOUT (list + detail drawer)
   ════════════════════════════════════════════════════════════ */

/**
 * SplitLayout — responsive two-panel layout.
 * list: left feed/table, detail: right drawer/panel.
 * On < 1024px: detail becomes an overlay, list takes full width.
 */
export function SplitLayout({
  list,
  detail,
  detailOpen = false,
  height = 560,
  className = "",
}) {
  return (
    <div className={cn("flex gap-4 min-h-0", className)} style={{ height }}>
      {/* List panel */}
      <div
        className={cn(
          "flex-1 min-w-0 overflow-hidden transition-all duration-300",
          detailOpen && "hidden xl:flex xl:flex-col",
        )}
      >
        {list}
      </div>

      {/* Detail panel — inline on xl+, overlay on smaller */}
      {detailOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0 overflow-hidden"
          style={{ minWidth: detailOpen ? 320 : 0 }}
        >
          <div className="w-[380px] h-full">{detail}</div>
        </motion.div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   THREE COLUMN LAYOUT (analyst review)
   ════════════════════════════════════════════════════════════ */

/**
 * ThreeColLayout — queue (left) + detail (center) + actions (right).
 * Stacks to single column on tablet/mobile.
 */
export function ThreeColLayout({
  queue,
  detail,
  actions,
  height = 560,
  className = "",
}) {
  return (
    <div
      className={cn("grid grid-cols-1 lg:grid-cols-3 gap-4", className)}
      style={{ minHeight: height }}
    >
      <div className="overflow-hidden">{queue}</div>
      <div className="overflow-hidden">{detail}</div>
      <div className="overflow-hidden">{actions}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CARD GRID (with spotlight support)
   ════════════════════════════════════════════════════════════ */

/**
 * CardGrid — responsive grid with optional spotlight tracking.
 * cols: Tailwind cols shorthand or number (2|3|4|6)
 */
export function CardGrid({
  children,
  cols = 3,
  spotlight = false,
  gap = "gap-4",
  className = "",
}) {
  const groupRef = useSpotlightGroup(".fe-spotlight");

  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div
      ref={spotlight ? groupRef : undefined}
      className={cn("grid", colClasses[cols] ?? colClasses[3], gap, className)}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DATA TABLE
   ════════════════════════════════════════════════════════════ */

/**
 * DataTable — consistent table wrapper with scroll + styling.
 */
export function DataTable({ children, className = "" }) {
  return (
    <div className={cn("fe-table-container fe-card", className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PANEL CARD
   ════════════════════════════════════════════════════════════ */

/**
 * PanelCard — standard surface card.
 * variant: 'default' | 'elevated' | 'inner' | 'elite'
 */
export function PanelCard({
  children,
  variant = "default",
  spotlight = false,
  glow,
  className = "",
}) {
  const variants = {
    default: "fe-card",
    elevated: "fe-card-elevated rounded-xl",
    inner: "fe-card-inner",
    elite: "fe-panel-elite rounded-xl",
  };

  const glowClasses = {
    "soft-cyan": "fe-glow-soft-cyan",
    "soft-violet": "fe-glow-soft-violet",
    "emphasis-cyan": "fe-glow-emphasis-cyan",
    "emphasis-violet": "fe-glow-emphasis-violet",
    critical: "fe-glow-critical",
  };

  return (
    <div
      className={cn(
        variants[variant] ?? variants.default,
        spotlight && "fe-spotlight",
        glow && glowClasses[glow],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PANEL HEADER
   ════════════════════════════════════════════════════════════ */

/**
 * PanelHeader — standard header row for cards and panels.
 * Consistent across all pages.
 */
export function PanelHeader({
  icon: Icon,
  iconColor = "#22D3EE",
  title,
  subtitle,
  right,
  className = "",
}) {
  return (
    <div className={cn("fe-panel-header", className)}>
      {Icon && (
        <span
          className="fe-icon-sm flex-shrink-0"
          style={{
            background: `${iconColor}14`,
            border: `1px solid ${iconColor}28`,
          }}
        >
          <Icon size={13} strokeWidth={1.5} style={{ color: iconColor }} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-[#F8FAFC] leading-none">
          {title}
        </span>
        {subtitle && (
          <span className="text-[10px] text-[#475569] ml-2">{subtitle}</span>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DIVIDER
   ════════════════════════════════════════════════════════════ */

export function Divider({ className = "" }) {
  return <div className={cn("h-px bg-[#0F172A] my-4", className)} />;
}

/* ════════════════════════════════════════════════════════════
   META ROW (label + value in drawers/panels)
   ════════════════════════════════════════════════════════════ */

export function MetaRow({ label, value, mono = false, className = "" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 border-b border-[#0A1628] last:border-0",
        className,
      )}
    >
      <span className="text-[10px] text-[#475569] flex-shrink-0 w-24">
        {label}
      </span>
      <span
        className={cn(
          "text-[11px] text-[#94A3B8] truncate text-right flex-1",
          mono && "font-mono",
        )}
      >
        {value}
      </span>
    </div>
  );
}
