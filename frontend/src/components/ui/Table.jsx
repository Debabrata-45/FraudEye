/**
 * Table.jsx — FraudEye Table System
 *
 * Exports:
 *   TableShell      — scrollable table wrapper with sticky header
 *   TableHead       — <thead> with consistent styling
 *   SortableHeader  — <th> with sort icon and toggle
 *   TableBody       — <tbody> wrapper
 *   TableRow        — <tr> with risk edge, hover, selected, flash states
 *   TableCell       — <td> with alignment and truncation helpers
 *   EmptyTableRow   — colSpan empty state row
 *
 * Row states:
 *   hover       → subtle cyan highlight
 *   selected    → stronger cyan background
 *   risk=HIGH   → left red edge
 *   risk=MEDIUM → left amber edge
 *   risk=LOW    → left emerald edge
 *   isNew       → flash animation (SSE arrival)
 */

import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "../../utils/cn";

const RISK_EDGE = {
  HIGH: "border-l-[#F43F5E]",
  MEDIUM: "border-l-[#F59E0B]",
  LOW: "border-l-[#22C55E]",
  SAFE: "border-l-[#22C55E]",
  UNKNOWN: "border-l-transparent",
};

/* ── TableShell ──────────────────────────────────────────── */
export function TableShell({ children, className = "", stickyHeader = true }) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl",
        "border border-[#1E293B] bg-[#080F1A]",
        className,
      )}
    >
      <table
        className={cn(
          "w-full border-collapse text-sm",
          stickyHeader &&
            "[&_thead_tr]:sticky [&_thead_tr]:top-0 [&_thead_tr]:z-10",
        )}
      >
        {children}
      </table>
    </div>
  );
}

/* ── TableHead ───────────────────────────────────────────── */
export function TableHead({ children }) {
  return (
    <thead>
      <tr className="bg-[#0A1628] border-b border-[#0F172A]">{children}</tr>
    </thead>
  );
}

/* ── SortableHeader ──────────────────────────────────────── */
export function SortableHeader({
  children,
  field,
  sortField,
  sortDir,
  onSort,
  align = "left",
  width,
  className = "",
}) {
  const isActive = sortField === field;
  const Icon = isActive
    ? sortDir === "asc"
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown;

  return (
    <th
      onClick={() => onSort?.(field)}
      style={width ? { width } : undefined}
      className={cn(
        "px-4 py-3 font-semibold text-[10px] uppercase tracking-wider",
        "text-[#334155] whitespace-nowrap select-none",
        align === "right" && "text-right",
        align === "center" && "text-center",
        onSort && "cursor-pointer hover:text-[#64748B] transition-colors",
        isActive && "text-[#22D3EE]",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {onSort && <Icon size={10} strokeWidth={2} />}
      </span>
    </th>
  );
}

/* ── Plain header cell ───────────────────────────────────── */
export function TableHeaderCell({
  children,
  align = "left",
  width,
  className = "",
}) {
  return (
    <th
      style={width ? { width } : undefined}
      className={cn(
        "px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-[#334155]",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </th>
  );
}

/* ── TableBody ───────────────────────────────────────────── */
export function TableBody({ children }) {
  return <tbody className="divide-y divide-[#0F172A]">{children}</tbody>;
}

/* ── TableRow ────────────────────────────────────────────── */
export function TableRow({
  children,
  risk,
  selected = false,
  isNew = false,
  onClick,
  className = "",
}) {
  const riskEdge = RISK_EDGE[risk?.toUpperCase()] ?? RISK_EDGE.UNKNOWN;

  return (
    <motion.tr
      layout
      initial={isNew ? { backgroundColor: "rgba(34,211,238,0.08)" } : undefined}
      animate={{ backgroundColor: "rgba(0,0,0,0)" }}
      transition={isNew ? { duration: 1.2 } : undefined}
      onClick={onClick}
      className={cn(
        "border-l-2 transition-colors duration-100 group",
        riskEdge,
        selected
          ? "bg-[#22D3EE08] hover:bg-[#22D3EE0C]"
          : "hover:bg-[#FFFFFF04]",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.tr>
  );
}

/* ── TableCell ───────────────────────────────────────────── */
export function TableCell({
  children,
  align = "left",
  mono = false,
  muted = false,
  truncate = false,
  className = "",
  ...props
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-sm",
        align === "right" && "text-right",
        align === "center" && "text-center",
        mono && "font-mono text-xs",
        muted && "text-[#475569]",
        !muted && "text-[#CBD5E1]",
        truncate && "max-w-[200px] truncate",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

/* ── EmptyTableRow ───────────────────────────────────────── */
export function EmptyTableRow({ colSpan = 6, message = "No data to display" }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-[#334155]"
      >
        {message}
      </td>
    </tr>
  );
}

/* ── TableRowSkeleton ────────────────────────────────────── */
const SKELETON_WIDTHS = [
  "75%",
  "60%",
  "85%",
  "55%",
  "70%",
  "65%",
  "80%",
  "50%",
];

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="border-l-2 border-l-transparent">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="fe-shimmer h-3 rounded-full"
            style={{ width: SKELETON_WIDTHS[i % SKELETON_WIDTHS.length] }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ── AnimatedTableBody — wraps rows with AnimatePresence ── */
export function AnimatedTableBody({ children }) {
  return (
    <tbody className="divide-y divide-[#0F172A]">
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </tbody>
  );
}
