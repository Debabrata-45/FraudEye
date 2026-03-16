/**
 * motion.js — FraudEye Motion Token System
 *
 * Single source of truth for all animation behavior across the product.
 * Import from here in every component — never hardcode animation values inline.
 *
 * Usage:
 *   import { fadeUp, staggerContainer, DURATION, EASING } from '../motion/motion';
 *   <motion.div variants={fadeUp} initial="hidden" animate="visible" />
 *
 * Philosophy:
 *   - Operational, not decorative
 *   - Fast entry (150–300ms), never slow
 *   - Easing always decelerates into final state (easeOut)
 *   - Critical fraud states get urgency; safe states get calm
 *   - Every animation must justify its existence
 */

/* ============================================================
   1. DURATION TOKENS
   ============================================================ */
export const DURATION = {
  instant: 0.08, // immediate feedback (button tap, toggle)
  fast: 0.15, // micro-interactions (hover, badge change)
  normal: 0.22, // standard transitions (page elements, cards)
  moderate: 0.3, // drawers, modals entering
  slow: 0.45, // progress bars, risk rings (deliberate reveal)
  verySlow: 0.7, // charts, large section reveals
};

/* ============================================================
   2. EASING TOKENS
   ============================================================ */
export const EASING = {
  // Standard deceleration — element enters and settles
  out: [0.0, 0.0, 0.2, 1.0],
  // Slight overshoot then settle — for cards/panels
  outBack: [0.34, 1.56, 0.64, 1.0],
  // Accelerate out — element leaving
  in: [0.4, 0.0, 1.0, 1.0],
  // Standard in-out — for progress, state changes
  inOut: [0.4, 0.0, 0.2, 1.0],
  // Spring-like — for tab indicators, pill selectors
  spring: { type: "spring", stiffness: 500, damping: 35 },
  springSnappy: { type: "spring", stiffness: 700, damping: 40 },
};

/* ============================================================
   3. STAGGER TIMING
   ============================================================ */
export const STAGGER = {
  fast: 0.04, // tight lists (table rows, chip groups)
  normal: 0.06, // card grids (KPI row, alert list)
  slow: 0.1, // large section reveals
  xslow: 0.15, // onboarding / first-load sequences
};

/* ============================================================
   4. ENTRY VARIANTS
   All variants follow hidden → visible pattern.
   Use with: initial="hidden" animate="visible" exit="hidden"
   ============================================================ */

/** Fade only — for overlays, tooltips, subtle content */
export const fade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/** Fade + rise from below — primary page content, cards */
export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/** Fade + slight slide from right — drawers, panels, detail views */
export const fadeRight = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.moderate, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: DURATION.normal, ease: EASING.in },
  },
};

/** Fade + slight slide from left — sidebar items, secondary panels */
export const fadeLeft = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/** Scale up from slightly smaller — modals, popovers, dropdowns */
export const scalePop = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASING.outBack },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/** For new SSE rows entering the live feed — slides in from left edge */
export const rowEnter = {
  hidden: { opacity: 0, x: -8, backgroundColor: "rgba(34,211,238,0.08)" },
  visible: {
    opacity: 1,
    x: 0,
    backgroundColor: "rgba(0,0,0,0)",
    transition: {
      opacity: { duration: DURATION.normal, ease: EASING.out },
      x: { duration: DURATION.normal, ease: EASING.out },
      backgroundColor: { duration: 1.2, ease: "linear" },
    },
  },
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/** For high-risk rows — red flash on enter */
export const rowEnterDanger = {
  hidden: { opacity: 0, x: -8, backgroundColor: "rgba(244,63,94,0.10)" },
  visible: {
    opacity: 1,
    x: 0,
    backgroundColor: "rgba(0,0,0,0)",
    transition: {
      opacity: { duration: DURATION.normal, ease: EASING.out },
      x: { duration: DURATION.normal, ease: EASING.out },
      backgroundColor: { duration: 1.5, ease: "linear" },
    },
  },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

/* ============================================================
   5. STAGGER CONTAINER VARIANTS
   Wrap a list of items — children animate in sequence.
   ============================================================ */

/** Fast stagger — table rows, chips, tight lists */
export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.fast, delayChildren: 0.02 },
  },
};

/** Normal stagger — card grids, KPI rows */
export const staggerNormal = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.normal, delayChildren: 0.04 },
  },
};

/** Slow stagger — large section reveals, onboarding */
export const staggerSlow = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.slow, delayChildren: 0.06 },
  },
};

/* ============================================================
   6. PAGE TRANSITION VARIANTS
   Used in Layout.jsx for route changes.
   ============================================================ */
export const pageTransition = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/* ============================================================
   7. HOVER INTERACTION CONFIGS
   Use with whileHover prop on motion elements.
   ============================================================ */
export const HOVER = {
  /** KPI cards — slight lift + no scale */
  card: {
    y: -2,
    transition: { duration: DURATION.fast, ease: EASING.out },
  },

  /** Glass surfaces — minimal lift */
  glass: {
    y: -1,
    transition: { duration: DURATION.fast, ease: EASING.out },
  },

  /** Buttons — micro scale tap feel */
  button: {
    scale: 1.01,
    transition: { duration: DURATION.instant, ease: EASING.out },
  },

  /** Table rows — no movement, just CSS bg change (handled in CSS) */
  row: {},

  /** Alert items — micro shift */
  alert: {
    x: 2,
    transition: { duration: DURATION.fast, ease: EASING.out },
  },

  /** Sidebar nav items — negligible — CSS handles color */
  nav: {},

  /** Icon buttons — tiny scale */
  icon: {
    scale: 1.08,
    transition: { duration: DURATION.instant, ease: EASING.outBack },
  },
};

/** Tap/press config — used with whileTap */
export const TAP = {
  button: { scale: 0.97, transition: { duration: DURATION.instant } },
  icon: { scale: 0.92, transition: { duration: DURATION.instant } },
  card: { scale: 0.99, transition: { duration: DURATION.instant } },
};

/* ============================================================
   8. DRAWER & MODAL TRANSITION CONFIGS
   Pass directly to motion.div as initial/animate/exit.
   ============================================================ */

/** Right-side slide drawer */
export const drawerRight = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: DURATION.moderate, ease: EASING.out },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: DURATION.normal, ease: EASING.in },
  },
};

/** Left-side slide drawer (mobile sidebar) */
export const drawerLeft = {
  initial: { x: "-100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: DURATION.moderate, ease: EASING.out },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: DURATION.normal, ease: EASING.in },
  },
};

/** Centered modal */
export const modalCenter = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.outBack },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/** Backdrop overlay */
export const overlayFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASING.in },
  },
};

/* ============================================================
   9. LIVE STATE ANIMATION CONFIGS
   For Framer Motion animate prop — drives real-time UI.
   ============================================================ */

/** Live dot — breathing pulse (emerald, calm) */
export const liveDotCalm = {
  animate: {
    scale: [1, 1.25, 1],
    opacity: [1, 0.5, 1],
  },
  transition: { duration: 2.0, repeat: Infinity, ease: "easeInOut" },
};

/** Live dot — urgent pulse (red, critical) */
export const liveDotUrgent = {
  animate: {
    scale: [1, 1.4, 1],
    opacity: [1, 0.3, 1],
  },
  transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
};

/** Live dot — warning pulse (amber, review) */
export const liveDotWarning = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [1, 0.4, 1],
  },
  transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
};

/** Risk bar fill — animated on mount */
export const riskBarFill = (pct) => ({
  initial: { width: 0 },
  animate: { width: `${pct}%` },
  transition: { duration: DURATION.slow, ease: EASING.out, delay: 0.1 },
});

/** Ring progress — SVG stroke offset */
export const ringProgress = (offset) => ({
  initial: { strokeDashoffset: 999 },
  animate: { strokeDashoffset: offset },
  transition: { duration: DURATION.verySlow, ease: EASING.out, delay: 0.15 },
});

/** Number value change — flash highlight */
export const valueFlash = {
  initial: { opacity: 0.5, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: DURATION.fast, ease: EASING.outBack },
};

/* ============================================================
   10. FEEDBACK ANIMATION CONFIGS
   ============================================================ */

/** Success confirmation — brief green glow pulse */
export const successPulse = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(34,197,94,0)",
      "0 0 0 6px rgba(34,197,94,0.25)",
      "0 0 0 0 rgba(34,197,94,0)",
    ],
  },
  transition: { duration: 0.6, ease: "easeOut" },
};

/** Error shake — horizontal micro-shake */
export const errorShake = {
  animate: { x: [0, -6, 6, -4, 4, -2, 2, 0] },
  transition: { duration: 0.4, ease: "easeInOut" },
};

/** Loading spinner rotation */
export const spinnerRotate = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" },
};

/** Filter change — brief content fade + re-enter */
export const filterChange = {
  exit: { opacity: 0, y: -4, transition: { duration: DURATION.fast } },
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
};

/* ============================================================
   11. SKELETON SHIMMER CONFIG
   Applied via CSS class fe-shimmer — this defines the keyframe
   behavior conceptually. Actual CSS is in index.css.
   Shimmer direction: left-to-right sweep on dark bg.
   ============================================================ */
export const SKELETON = {
  baseColor: "#111827",
  highlightColor: "#1E293B",
  duration: "1.5s",
  borderRadius: "4px",
};

/* ============================================================
   12. TAB INDICATOR — spring layoutId config
   Use as transition prop on the animated tab underline/pill.
   ============================================================ */
export const TAB_INDICATOR = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};

/* ============================================================
   13. CHART ENTRANCE
   For Recharts wrapper — fades in the entire chart container.
   ============================================================ */
export const chartEntrance = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.verySlow, ease: EASING.out, delay: 0.1 },
  },
};

/* ============================================================
   14. URGENCY LEVELS
   Maps risk/severity to animation intensity.
   Use getRiskMotion(level) to get appropriate live-dot config.
   ============================================================ */
export function getRiskMotion(level) {
  switch (level?.toUpperCase()) {
    case "HIGH":
    case "FRAUD":
    case "CRITICAL":
      return liveDotUrgent;
    case "MEDIUM":
    case "REVIEW":
      return liveDotWarning;
    default:
      return liveDotCalm;
  }
}

/* ============================================================
   15. REDUCED MOTION UTILITY
   Respect prefers-reduced-motion. Call this to get safe variants.
   ============================================================ */
export function safeVariant(variant, reducedMotion) {
  if (!reducedMotion) return variant;
  // Strip transforms, keep only opacity transitions
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.fast } },
    exit: { opacity: 0, transition: { duration: DURATION.instant } },
  };
}

/* ============================================================
   16. CONVENIENCE: STAGGER DELAY HELPER
   Returns transition with delay for nth item in a list.
   Use when NOT using stagger container variants.
   ============================================================ */
export function staggerDelay(index, base = STAGGER.normal, maxDelay = 0.4) {
  return {
    transition: {
      delay: Math.min(index * base, maxDelay),
      duration: DURATION.normal,
      ease: EASING.out,
    },
  };
}

/* ============================================================
   17. MISSING ADDITIONS — Gap Fill

   Added after audit:
   - HOVER.tab
   - rowSelect, rowExpand, rowFocused table variants
   - aiHighlight, criticalWarning badge/indicator motion
   - retryPulse, sortChange feedback animations
   - Named skeleton variants for chart, alerts, explanation
   ============================================================ */

/* D3 gap: tab hover */
HOVER.tab = {
  color: "#22D3EE", // handled via CSS mostly
  transition: { duration: DURATION.fast },
};

/* D7: Table row interaction variants */

/** Row selected state — animate in */
export const rowSelect = {
  initial: { backgroundColor: "rgba(0,0,0,0)" },
  selected: {
    backgroundColor: "rgba(34,211,238,0.06)",
    transition: { duration: DURATION.fast },
  },
  deselected: {
    backgroundColor: "rgba(0,0,0,0)",
    transition: { duration: DURATION.fast },
  },
};

/** Row expand trigger — brief scale nudge on the expand icon */
export const rowExpandIcon = {
  collapsed: { rotate: 0 },
  expanded: {
    rotate: 90,
    transition: { duration: DURATION.fast, ease: EASING.out },
  },
};

/** Row focused (keyboard nav) — subtle left glow pulse */
export const rowFocused = {
  animate: {
    boxShadow: [
      "inset 2px 0 0 rgba(34,211,238,0)",
      "inset 2px 0 0 rgba(34,211,238,0.6)",
      "inset 2px 0 0 rgba(34,211,238,0.6)",
    ],
  },
  transition: { duration: DURATION.fast, ease: EASING.out },
};

/* D8: Badge/indicator motion gaps */

/** AI insight card — violet glow pulse on mount */
export const aiHighlight = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(139,92,246,0)",
      "0 0 12px 2px rgba(139,92,246,0.18)",
      "0 0 6px 1px rgba(139,92,246,0.10)",
    ],
  },
  transition: { duration: 1.2, ease: "easeOut" },
};

/** Critical warning — red border pulse, more aggressive than successPulse */
export const criticalWarning = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(244,63,94,0)",
      "0 0 0 6px rgba(244,63,94,0.3)",
      "0 0 0 3px rgba(244,63,94,0.15)",
      "0 0 0 0 rgba(244,63,94,0)",
    ],
  },
  transition: { duration: 0.8, ease: "easeOut", repeat: 2 },
};

/** Status badge transition — for status changing from one value to another */
export const statusTransition = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.fast, ease: EASING.outBack },
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: DURATION.instant } },
};

/* D5: Feedback animation gaps */

/** Retry button — spin once then settle */
export const retryPulse = {
  animate: { rotate: [0, -20, 340, 360] },
  transition: { duration: 0.5, ease: "easeInOut" },
};

/** Sort column change — table content brief fade+shift */
export const sortChange = {
  exit: { opacity: 0, y: -3, transition: { duration: DURATION.fast } },
  initial: { opacity: 0, y: 3 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
};

/** Inline confirmation tick — brief scale-in then fade */
export const inlineConfirm = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.fast, ease: EASING.outBack },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: DURATION.fast, delay: 1.2 },
  },
};

/* D9: Named skeleton entrance variants
   These are fade-in configs for when skeleton transitions to real content.
   The skeleton itself uses the fe-shimmer CSS class.
   These animate the REVEAL (skeleton → content crossfade). */

/** Card skeleton → content */
export const skeletonToCard = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASING.out },
  },
};

/** Table skeleton → rows */
export const skeletonToTable = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.out,
      staggerChildren: STAGGER.fast,
    },
  },
};

/** Chart skeleton → chart */
export const skeletonToChart = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.moderate, ease: EASING.out },
  },
};

/** Alert list skeleton → items */
export const skeletonToAlerts = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.out,
      staggerChildren: STAGGER.fast,
    },
  },
};

/** Explanation panel skeleton → SHAP content */
export const skeletonToExplanation = {
  hidden: { opacity: 0, x: -4 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.moderate, ease: EASING.out },
  },
};
