/**
 * responsive.jsx — FraudEye Responsive Component Wrappers
 *
 * Thin React wrappers around the CSS classes defined in responsive.css
 * (Phase 16 index.css additions).
 *
 * Exports:
 *   PageLayout        — responsive page wrapper (fe-page-wrapper)
 *   SectionBlock      — labeled section container
 *   CardGrid          — responsive KPI/card grid with optional spotlight
 *   SplitLayout       — list + detail panel split
 *   ThreeColLayout    — queue + detail + actions three-column layout
 *   ControlsBar       — filter/search control row
 *   DataTable         — horizontally-scrollable table container
 *   PanelCard         — glass surface card for settings panels
 *   MetaRow           — label + value metadata row
 *   useDrawerBehavior — hook: tells you if drawer should be overlay vs inline
 *   useTableColumns   — hook: tells you which columns to show at current breakpoint
 */

import { useEffect, useState, useCallback } from "react";
import { cn } from "../utils/cn";
import { useSpotlightGroup } from "./polish";

/* ════════════════════════════════════════════════════════════
   PAGE LAYOUT
   Replaces manual: w-full px-5 md:px-6 lg:px-8 pt-6 pb-12 max-w-[1600px] mx-auto
   ════════════════════════════════════════════════════════════ */
export function PageLayout({ children, className = "" }) {
  return <div className={cn("fe-page-wrapper", className)}>{children}</div>;
}

/* ════════════════════════════════════════════════════════════
   SECTION BLOCK
   Labeled section with consistent bottom spacing
   ════════════════════════════════════════════════════════════ */
export function SectionBlock({ heading, action, children, className = "" }) {
  return (
    <div className={cn("fe-section-gap", className)}>
      {heading && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="fe-section-heading">{heading}</h2>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CARD GRID
   Responsive KPI grid — uses fe-kpi-grid CSS classes.
   Pass spotlight={true} to enable mouse-tracking glow on children
   that have className="fe-spotlight"
   ════════════════════════════════════════════════════════════ */
export function CardGrid({
  children,
  cols = 6,
  spotlight = false,
  className = "",
}) {
  const spotlightRef = useSpotlightGroup(".fe-spotlight");
  const colClass = cols === 6 ? "fe-kpi-grid" : `grid grid-cols-${cols} gap-4`;

  return (
    <div
      ref={spotlight ? spotlightRef : undefined}
      className={cn(colClass, className)}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SPLIT LAYOUT
   List panel (left/top) + Detail panel (right/overlay on mobile).
   On mobile (< lg): detail overlays as fe-drawer-inline.
   On desktop (>= lg): side by side.
   ════════════════════════════════════════════════════════════ */
export function SplitLayout({
  list,
  detail,
  detailOpen = false,
  height = 520,
  listCols = 2, // out of 3 on lg grid
  className = "",
}) {
  const { isOverlay } = useDrawerBehavior();

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 relative",
        className,
      )}
      style={{ minHeight: height }}
    >
      {/* List — takes 2/3 cols on lg */}
      <div
        className={cn(
          "min-h-0",
          listCols === 2 ? "lg:col-span-2" : "lg:col-span-1",
        )}
        style={{ height }}
      >
        {list}
      </div>

      {/* Detail — inline on desktop, overlay on mobile */}
      {detailOpen && (
        <div
          className={cn(isOverlay ? "fe-drawer-inline" : "", "min-h-0")}
          style={isOverlay ? undefined : { height }}
        >
          {detail}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   THREE COL LAYOUT
   Queue (fixed left) + Detail (flex center) + Actions (fixed right)
   Used by Analyst Review page.
   Stacks vertically on mobile, three columns on lg+.
   ════════════════════════════════════════════════════════════ */
export function ThreeColLayout({
  queue,
  detail,
  actions,
  height = 580,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row gap-3 min-h-0 overflow-hidden",
        className,
      )}
      style={{ height }}
    >
      {/* Col 1 — queue, fixed 256px */}
      <div className="w-full lg:w-64 flex-shrink-0 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-4 overflow-hidden flex flex-col">
        {queue}
      </div>

      {/* Col 2 — case detail, flex-1 */}
      <div className="flex-1 min-w-0 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-4 overflow-hidden flex flex-col">
        {detail}
      </div>

      {/* Col 3 — actions, fixed 288px */}
      <div className="w-full lg:w-72 flex-shrink-0 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-4 overflow-y-auto">
        {actions}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CONTROLS BAR
   Wraps filter controls with fe-controls-bar responsive class
   ════════════════════════════════════════════════════════════ */
export function ControlsBar({ children, className = "" }) {
  return (
    <div className={cn("fe-controls-bar mb-4", className)}>{children}</div>
  );
}

/* ════════════════════════════════════════════════════════════
   DATA TABLE
   Wraps table in fe-table-container for horizontal scroll
   ════════════════════════════════════════════════════════════ */
export function DataTable({ children, className = "" }) {
  return (
    <div className={cn("fe-table-container fe-card", className)}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PANEL CARD
   Glass surface card for settings and info panels.
   variant="default"  — standard dark glass surface
   variant="elevated" — slightly lighter, more prominent
   ════════════════════════════════════════════════════════════ */
export function PanelCard({ children, variant = "default", className = "" }) {
  const variants = {
    default:
      "bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm",
    elevated:
      "bg-slate-800/60 border border-slate-700/60 rounded-2xl backdrop-blur-sm shadow-[0_0_0_1px_rgba(34,211,238,0.04)]",
  };

  return (
    <div
      className={cn(variants[variant] ?? variants.default, "p-5", className)}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   META ROW
   Label + value row for system info, profile, metadata panels.
   Pass mono={true} for monospace value rendering.
   ════════════════════════════════════════════════════════════ */
export function MetaRow({ label, value, mono = false, className = "" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0",
        className,
      )}
    >
      <span className="text-xs text-slate-500">{label}</span>
      <span
        className={cn(
          "text-xs font-medium text-slate-200",
          mono && "font-mono",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   USE DRAWER BEHAVIOR
   Returns { isOverlay: bool }
   isOverlay = true  when viewport < 1024px (lg breakpoint)
   isOverlay = false on desktop — drawer stays inline
   ════════════════════════════════════════════════════════════ */
export function useDrawerBehavior() {
  const [isOverlay, setIsOverlay] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e) => setIsOverlay(e.matches);
    setIsOverlay(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return { isOverlay };
}

/* ════════════════════════════════════════════════════════════
   USE TABLE COLUMNS
   Returns column visibility flags based on current breakpoint.
   Use these to conditionally show/hide <th> and <td> elements.

   Usage:
     const cols = useTableColumns();
     // In table header/rows:
     {cols.merchant && <td>...</td>}
   ════════════════════════════════════════════════════════════ */
export function useTableColumns() {
  const getBreakpoint = () => {
    const w = window.innerWidth;
    if (w >= 1280) return "xl";
    if (w >= 1024) return "lg";
    if (w >= 768) return "md";
    if (w >= 640) return "sm";
    return "xs";
  };

  const [bp, setBp] = useState(() =>
    typeof window !== "undefined" ? getBreakpoint() : "xl",
  );

  useEffect(() => {
    const handler = () => setBp(getBreakpoint());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    // Always visible
    id: true,
    amount: true,
    status: true,
    riskScore: true,
    action: true,
    // Hidden on tablet and below
    timestamp: bp !== "xs" && bp !== "sm",
    fraudLabel: bp !== "xs" && bp !== "sm",
    // Hidden on mobile only
    merchant: bp !== "xs",
    device: bp !== "xs",
    geo: bp !== "xs",
    reason: bp !== "xs",
  };
}

/* ════════════════════════════════════════════════════════════
   USE SIDEBAR BEHAVIOR
   Returns { defaultCollapsed: bool }
   defaultCollapsed = true on tablet (768–1279px) to save space
   ════════════════════════════════════════════════════════════ */
export function useSidebarBehavior() {
  const [defaultCollapsed, setDefaultCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const w = window.innerWidth;
    return w >= 768 && w < 1280;
  });

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setDefaultCollapsed(w >= 768 && w < 1280);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return { defaultCollapsed };
}

/* ════════════════════════════════════════════════════════════
   USE MOBILE MENU
   Returns { isOpen, toggle, close }
   Manages mobile sidebar drawer open/close state.
   ════════════════════════════════════════════════════════════ */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, toggle, close };
}
