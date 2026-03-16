/**
 * MotionComponents.jsx — FraudEye Pre-wired Motion Components
 *
 * Drop-in animated wrappers built on top of the motion token system.
 * These are not UI components — they are motion wrappers.
 * Wrap existing components with these for consistent animation.
 *
 * Exports:
 *   AnimatedCard       — card with stagger-aware fade-up entry + hover lift
 *   AnimatedRow        — table row with entry, flash, risk-edge awareness
 *   AnimatedSection    — section wrapper with fade-up reveal
 *   AnimatedList       — stagger container for lists
 *   LiveDot            — animated status indicator (3 urgency levels)
 *   FeedbackFlash      — wraps any element for success/error feedback
 *   AnimatedCounter    — number display with change-flash
 *   SkeletonPulse      — single shimmer block (configurable size)
 *   PageEntrance       — wraps page content for route transition
 *   DrawerShell        — motion wrapper for slide drawers
 *   ModalShell         — motion wrapper for centered modals
 *   OverlayBackdrop    — motion backdrop for overlays
 */

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "../utils/cn";
import {
  fadeUp,
  fade,
  rowEnter,
  rowEnterDanger,
  staggerNormal,
  staggerFast,
  HOVER,
  TAP,
  drawerRight,
  drawerLeft,
  modalCenter,
  overlayFade,
  pageTransition,
  liveDotCalm,
  liveDotUrgent,
  liveDotWarning,
  DURATION,
  EASING,
  chartEntrance,
} from "./motion";
import { useValueChange } from "./useMotion";

/* ── AnimatedCard ────────────────────────────────────────── */
/**
 * Wraps any card with stagger-aware fade-up entry + hover lift.
 * stagger prop = index in list (0-based).
 *
 * Usage:
 *   <AnimatedCard stagger={i} onClick={fn}>
 *     <KPICard ... />
 *   </AnimatedCard>
 */
export function AnimatedCard({
  children,
  stagger = 0,
  onClick,
  className = "",
}) {
  const reduced = useReducedMotion();
  const maxDelay = 0.4;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{
        duration: DURATION.normal,
        ease: EASING.out,
        delay: reduced ? 0 : Math.min(stagger * 0.06, maxDelay),
      }}
      whileHover={reduced || !onClick ? undefined : HOVER.card}
      whileTap={reduced || !onClick ? undefined : TAP.card}
      onClick={onClick}
      className={cn(onClick && "cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}

/* ── AnimatedRow ─────────────────────────────────────────── */
/**
 * Table row wrapper with entry animation, SSE flash, risk-level entry.
 *
 * Usage:
 *   <AnimatedRow index={i} isNew={newIds.has(id)} risk="HIGH">
 *     <td>...</td>
 *   </AnimatedRow>
 */
export function AnimatedRow({
  children,
  index = 0,
  _isNew = false,
  risk,
  onClick,
  className = "",
}) {
  const reduced = useReducedMotion();
  const isDanger = risk === "HIGH" || risk === "FRAUD";
  const variant = isDanger ? rowEnterDanger : rowEnter;

  return (
    <motion.tr
      layout
      key={index}
      variants={reduced ? fade : variant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: reduced ? 0 : Math.min(index * 0.03, 0.3) }}
      onClick={onClick}
      className={cn(onClick && "cursor-pointer", className)}
    >
      {children}
    </motion.tr>
  );
}

/* ── AnimatedSection ─────────────────────────────────────── */
/**
 * Wraps a page section for reveal animation on mount.
 *
 * Usage:
 *   <AnimatedSection delay={0.1}>
 *     <SectionWrapper label="Recent Alerts">...</SectionWrapper>
 *   </AnimatedSection>
 */
export function AnimatedSection({ children, delay = 0, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION.normal,
        ease: EASING.out,
        delay: reduced ? 0 : delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── AnimatedList ────────────────────────────────────────── */
/**
 * Stagger container for lists of cards, alerts, chips.
 * density: "tight" = 0.04s, "normal" = 0.06s
 *
 * Usage:
 *   <AnimatedList density="normal">
 *     {items.map(item => <AnimatedCard key={item.id}>...</AnimatedCard>)}
 *   </AnimatedList>
 */
export function AnimatedList({
  children,
  density = "normal",
  className = "",
  as = "div",
}) {
  const Tag = as === "ul" ? motion.ul : motion.div;
  const stagger = density === "tight" ? staggerFast : staggerNormal;

  return (
    <Tag
      variants={stagger}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ── LiveDot ─────────────────────────────────────────────── */
/**
 * Animated pulsing status dot.
 * urgency: "calm" | "warning" | "urgent"
 *
 * Usage:
 *   <LiveDot urgency="urgent" />
 *   <LiveDot urgency="calm" size={6} />
 */
const DOT_COLORS = {
  calm: "#22C55E",
  warning: "#F59E0B",
  urgent: "#F43F5E",
};

export function LiveDot({ urgency = "calm", size = 8, className = "" }) {
  const reduced = useReducedMotion();
  const color = DOT_COLORS[urgency] ?? DOT_COLORS.calm;
  const config =
    urgency === "urgent"
      ? liveDotUrgent
      : urgency === "warning"
        ? liveDotWarning
        : liveDotCalm;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center flex-shrink-0",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Outer ring pulse */}
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color, opacity: 0.4 }}
          animate={config.animate}
          transition={config.transition}
        />
      )}
      {/* Core dot */}
      <span
        className="relative rounded-full"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          backgroundColor: color,
        }}
      />
    </span>
  );
}

/* ── FeedbackFlash ───────────────────────────────────────── */
/**
 * Wraps any element and fires a success or error animation imperatively.
 * Use ref: flashRef.current.success() / flashRef.current.error()
 *
 * OR pass `status` prop: null | "success" | "error" | "loading"
 *
 * Usage:
 *   <FeedbackFlash status={submitStatus}>
 *     <Button>Submit</Button>
 *   </FeedbackFlash>
 */
export function FeedbackFlash({ children, status, className = "" }) {
  const reduced = useReducedMotion();

  const animations = {
    success: reduced
      ? {}
      : {
          animate: {
            boxShadow: [
              "0 0 0 0 rgba(34,197,94,0)",
              "0 0 0 8px rgba(34,197,94,0.2)",
              "0 0 0 0 rgba(34,197,94,0)",
            ],
          },
          transition: { duration: 0.7 },
        },
    error: reduced
      ? {}
      : {
          animate: { x: [0, -5, 5, -3, 3, 0] },
          transition: { duration: 0.35 },
        },
  };

  const anim = animations[status] ?? {};

  return (
    <motion.div {...anim} className={cn("inline-flex", className)}>
      {children}
    </motion.div>
  );
}

/* ── AnimatedCounter ─────────────────────────────────────── */
/**
 * Displays a value that flashes when it changes.
 * Perfect for live KPI numbers updated via SSE.
 *
 * Usage:
 *   <AnimatedCounter value={txnCount} prefix="" suffix="" color="#22D3EE" />
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  color,
  className = "",
}) {
  const flashKey = useValueChange(value);
  const reduced = useReducedMotion();

  return (
    <motion.span
      key={flashKey}
      initial={reduced ? {} : { opacity: 0.5, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.fast, ease: EASING.outBack }}
      className={cn("tabular-nums font-bold", className)}
      style={color ? { color } : undefined}
    >
      {prefix}
      {value}
      {suffix}
    </motion.span>
  );
}

/* ── SkeletonPulse ───────────────────────────────────────── */
/**
 * A single shimmer skeleton block.
 * Use inside CardSkeleton, TableRowSkeleton, etc.
 *
 * Usage:
 *   <SkeletonPulse className="h-4 w-32 rounded-full" />
 */
export function SkeletonPulse({ className = "" }) {
  return <div className={cn("fe-shimmer rounded-md", className)} />;
}

/* ── ChartEntrance ───────────────────────────────────────── */
/**
 * Wraps a Recharts chart with a fade-up entrance.
 */
export function ChartEntrance({ children, delay = 0.1, className = "" }) {
  return (
    <motion.div
      variants={chartEntrance}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── PageEntrance ────────────────────────────────────────── */
/**
 * Wraps page content for route-change transition.
 * Already used in Layout.jsx — export here for manual use.
 */
export function PageEntrance({ children, routeKey, className = "" }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn("h-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── DrawerShell ─────────────────────────────────────────── */
/**
 * Motion wrapper for slide drawers. Use inside AnimatePresence.
 * side: "right" | "left"
 *
 * Usage:
 *   <AnimatePresence>
 *     {open && <DrawerShell side="right" width={480}>...</DrawerShell>}
 *   </AnimatePresence>
 */
export function DrawerShell({
  children,
  side = "right",
  width = 480,
  className = "",
}) {
  const config = side === "right" ? drawerRight : drawerLeft;
  return (
    <motion.aside
      {...config}
      style={{ width, maxWidth: "100vw" }}
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-[#0A1628]",
        side === "right"
          ? "right-0 border-l border-[#1E293B]"
          : "left-0 border-r border-[#1E293B]",
        className,
      )}
    >
      {children}
    </motion.aside>
  );
}

/* ── ModalShell ──────────────────────────────────────────── */
/**
 * Motion wrapper for centered modals. Use inside AnimatePresence + fixed overlay.
 *
 * Usage:
 *   <AnimatePresence>
 *     {open && (
 *       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 *         <ModalShell width={480}>...</ModalShell>
 *       </div>
 *     )}
 *   </AnimatePresence>
 */
export function ModalShell({ children, width = 480, className = "" }) {
  return (
    <motion.div
      {...modalCenter}
      style={{ width, maxWidth: "100%" }}
      className={cn(
        "flex flex-col max-h-[90vh] rounded-2xl",
        "bg-[#0A1628] border border-[#1E293B]",
        "shadow-[0_24px_64px_#00000060]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ── OverlayBackdrop ─────────────────────────────────────── */
/**
 * Animated backdrop. Use inside AnimatePresence.
 *
 * Usage:
 *   <AnimatePresence>
 *     {open && <OverlayBackdrop onClick={onClose} />}
 *   </AnimatePresence>
 */
export function OverlayBackdrop({ onClick, blur = true }) {
  return (
    <motion.div
      {...overlayFade}
      onClick={onClick}
      className={cn(
        "fixed inset-0 z-40 bg-black/60",
        blur && "backdrop-blur-sm",
      )}
    />
  );
}

/* ── SkeletonReveal ──────────────────────────────────────── */
/**
 * Crossfades from skeleton to real content with context-appropriate animation.
 * context: "card" | "table" | "chart" | "alerts" | "explanation"
 *
 * Usage:
 *   <SkeletonReveal loading={isLoading} context="card" skeleton={<CardSkeleton />}>
 *     <ActualContent />
 *   </SkeletonReveal>
 */
import {
  skeletonToCard,
  skeletonToTable,
  skeletonToChart,
  skeletonToAlerts,
  skeletonToExplanation,
} from "./motion";
import { useSkeletonVisible } from "./useMotion";

const SKELETON_VARIANTS = {
  card: skeletonToCard,
  table: skeletonToTable,
  chart: skeletonToChart,
  alerts: skeletonToAlerts,
  explanation: skeletonToExplanation,
};

export function SkeletonReveal({
  loading,
  context = "card",
  skeleton,
  children,
  className = "",
}) {
  const { showSkeleton, showContent } = useSkeletonVisible(loading);
  const variant = SKELETON_VARIANTS[context] ?? skeletonToCard;

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {skeleton}
          </motion.div>
        ) : showContent ? (
          <motion.div
            key="content"
            variants={variant}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── AnimatedExpandIcon ──────────────────────────────────── */
/**
 * Rotating chevron for table row expand triggers.
 * expanded: boolean
 */
import { rowExpandIcon } from "./motion";

export function AnimatedExpandIcon({ expanded, children, className = "" }) {
  return (
    <motion.span
      variants={rowExpandIcon}
      animate={expanded ? "expanded" : "collapsed"}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}

/* ── CriticalWarningFlash ────────────────────────────────── */
/**
 * Wraps critical fraud items with a pulsing red border emphasis.
 * Use sparingly — only for CRITICAL / confirmed FRAUD items.
 */
import { criticalWarning, aiHighlight } from "./motion";

export function CriticalWarningFlash({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={reduced ? undefined : criticalWarning.animate}
      transition={reduced ? undefined : criticalWarning.transition}
      className={cn("rounded-xl", className)}
    >
      {children}
    </motion.div>
  );
}

/* ── AIInsightHighlight ──────────────────────────────────── */
/**
 * Wraps AI insight cards with a violet glow on mount.
 */
export function AIInsightHighlight({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={reduced ? undefined : aiHighlight.animate}
      transition={reduced ? undefined : aiHighlight.transition}
      className={cn("rounded-xl", className)}
    >
      {children}
    </motion.div>
  );
}
