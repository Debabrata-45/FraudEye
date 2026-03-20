/**
 * polish.jsx — FraudEye Elite Visual Polish Layer
 *
 * Exports:
 *   BrandLogo          — animated brand logo for Sidebar
 *   SystemStatusDot    — premium status indicator dot
 *   LiveBadge          — live/paused/disconnected stream badge
 *   HeroLine           — ambient animated scan line for hero sections
 *   ScanFrame          — scan-line border wrapper for panels
 *   ElitePanel         — premium glassmorphism panel wrapper
 *   useSpotlight       — mouse-tracking spotlight glow on a single card
 *   useSpotlightGroup  — spotlight glow across a grid of cards
 */

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

/* ════════════════════════════════════════════════════════════
   BRAND LOGO
   ════════════════════════════════════════════════════════════ */
export function BrandLogo({ collapsed = false }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 overflow-hidden",
        collapsed && "justify-center",
      )}
    >
      {/* Icon mark */}
      <div className="relative flex-shrink-0 w-8 h-8">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] opacity-20 blur-sm" />
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE22] to-[#8B5CF622] border border-[#22D3EE33] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5L13.5 4.5V11.5L8 14.5L2.5 11.5V4.5L8 1.5Z"
              stroke="#22D3EE"
              strokeWidth="1.2"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 5L10.5 6.5V9.5L8 11L5.5 9.5V6.5L8 5Z"
              fill="#22D3EE"
              fillOpacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Text — hidden when collapsed */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col leading-none"
        >
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
            FraudEye
          </span>
          <span className="text-[9px] font-medium text-[#334155] uppercase tracking-widest mt-0.5">
            AI Fraud Platform
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SYSTEM STATUS DOT
   ════════════════════════════════════════════════════════════ */
const STATUS_DOT_CONFIG = {
  ok: { color: "#22C55E", label: "Operational", pulse: true },
  warn: { color: "#F59E0B", label: "Degraded", pulse: true },
  err: { color: "#F43F5E", label: "Down", pulse: false },
  unknown: { color: "#475569", label: "Unknown", pulse: false },
};

export function SystemStatusDot({ status = "ok", label, showLabel = true }) {
  const cfg = STATUS_DOT_CONFIG[status] || STATUS_DOT_CONFIG.unknown;

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex items-center justify-center w-3 h-3 flex-shrink-0">
        {cfg.pulse && (
          <span
            className="absolute inline-flex w-full h-full rounded-full opacity-50 animate-ping"
            style={{ backgroundColor: cfg.color }}
          />
        )}
        <span
          className="relative inline-flex w-2 h-2 rounded-full"
          style={{
            backgroundColor: cfg.color,
            boxShadow: `0 0 6px ${cfg.color}80`,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-medium" style={{ color: cfg.color }}>
          {label || cfg.label}
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LIVE BADGE
   ════════════════════════════════════════════════════════════ */
const LIVE_BADGE_CONFIG = {
  active: {
    bg: "bg-[#22C55E0A]",
    border: "border-[#22C55E33]",
    text: "text-[#22C55E]",
    dot: "#22C55E",
    label: "Stream Active",
    pulse: true,
  },
  paused: {
    bg: "bg-[#47556918]",
    border: "border-[#33415533]",
    text: "text-[#64748B]",
    dot: "#64748B",
    label: "Stream Paused",
    pulse: false,
  },
  disconnected: {
    bg: "bg-[#F59E0B0A]",
    border: "border-[#F59E0B33]",
    text: "text-[#F59E0B]",
    dot: "#F59E0B",
    label: "Reconnecting…",
    pulse: true,
  },
};

export function LiveBadge({ variant = "active", className = "" }) {
  const cfg = LIVE_BADGE_CONFIG[variant] || LIVE_BADGE_CONFIG.active;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold",
        cfg.bg,
        cfg.border,
        cfg.text,
        className,
      )}
    >
      <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
        {cfg.pulse && (
          <span
            className="absolute inline-flex w-full h-full rounded-full opacity-50 animate-ping"
            style={{ backgroundColor: cfg.dot }}
          />
        )}
        <span
          className="relative inline-flex w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: cfg.dot }}
        />
      </span>
      {cfg.label}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO LINE
   ════════════════════════════════════════════════════════════ */
export function HeroLine({ className = "", delay = 0.3, color = "cyan" }) {
  const gradients = {
    cyan: "from-[#22D3EE44] via-[#8B5CF633] to-transparent",
    red: "from-[#F43F5E55] via-[#F59E0B33] to-transparent",
    violet: "from-[#8B5CF655] via-[#22D3EE33] to-transparent",
  };

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay }}
      style={{ originX: 0 }}
      className={cn(
        "h-px bg-gradient-to-r mt-4",
        gradients[color] || gradients.cyan,
        className,
      )}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   SCAN FRAME
   ════════════════════════════════════════════════════════════ */
export function ScanFrame({ children, className = "" }) {
  return (
    <div className={cn("relative", className)}>
      {/* Top scan line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0, 0, 0.2, 1] }}
        style={{ originX: 0 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#22D3EE66] via-[#22D3EE22] to-transparent z-10 pointer-events-none"
      />
      {/* Bottom scan line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0, 0, 0.2, 1], delay: 0.15 }}
        style={{ originX: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-[#8B5CF666] via-[#8B5CF622] to-transparent z-10 pointer-events-none"
      />
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ELITE PANEL
   ════════════════════════════════════════════════════════════ */
export function ElitePanel({ children, className = "" }) {
  return (
    <div
      className={cn(
        "relative bg-[#0D1627] border border-[#1E293B] rounded-xl overflow-hidden",
        "shadow-[0_0_0_1px_rgba(34,211,238,0.04),0_8px_32px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {/* Corner accent — top left */}
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#22D3EE44] to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-[#22D3EE44] to-transparent" />
      </div>
      {/* Corner accent — bottom right */}
      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-[#8B5CF644] to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-[#8B5CF644] to-transparent" />
      </div>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   USE SPOTLIGHT — single card mouse-tracking glow
   ════════════════════════════════════════════════════════════ */
export function useSpotlight() {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    // Set initial CSS vars
    el.style.setProperty("--spotlight-opacity", "0");
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

/* ════════════════════════════════════════════════════════════
   USE SPOTLIGHT GROUP — spotlight across a grid
   Attach returned ref to the grid container.
   Pass a CSS selector for the child cards (e.g. '.fe-spotlight')
   ════════════════════════════════════════════════════════════ */
export function useSpotlightGroup(cardSelector = ".fe-spotlight") {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e) => {
      const cards = grid.querySelectorAll(cardSelector);
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--spotlight-x", `${x}px`);
        card.style.setProperty("--spotlight-y", `${y}px`);
        card.style.setProperty("--spotlight-opacity", "1");
      });
    };

    const handleMouseLeave = () => {
      const cards = grid.querySelectorAll(cardSelector);
      cards.forEach((card) => {
        card.style.setProperty("--spotlight-opacity", "0");
      });
    };

    grid.addEventListener("mousemove", handleMouseMove);
    grid.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      grid.removeEventListener("mousemove", handleMouseMove);
      grid.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cardSelector]);

  return gridRef;
}
