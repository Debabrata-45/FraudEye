/**
 * FraudEye Motion System — Complete Barrel Export
 * Import anything from '../../motion'
 */

// ── Core tokens ───────────────────────────────────────────
export {
  DURATION,
  EASING,
  STAGGER,
  HOVER,
  TAP,
  TAB_INDICATOR,
  SKELETON,
} from "./motion";

// ── Entry variants ────────────────────────────────────────
export {
  fade,
  fadeUp,
  fadeRight,
  fadeLeft,
  scalePop,
  rowEnter,
  rowEnterDanger,
  pageTransition,
  chartEntrance,
} from "./motion";

// ── Stagger containers ────────────────────────────────────
export { staggerFast, staggerNormal, staggerSlow } from "./motion";

// ── Overlay / drawer / modal ──────────────────────────────
export { drawerRight, drawerLeft, modalCenter, overlayFade } from "./motion";

// ── Live state ────────────────────────────────────────────
export {
  liveDotCalm,
  liveDotUrgent,
  liveDotWarning,
  riskBarFill,
  ringProgress,
  valueFlash,
} from "./motion";

// ── Feedback ──────────────────────────────────────────────
export {
  successPulse,
  errorShake,
  spinnerRotate,
  filterChange,
  retryPulse,
  sortChange,
  inlineConfirm,
} from "./motion";

// ── Table interactions ────────────────────────────────────
export { rowSelect, rowExpandIcon, rowFocused } from "./motion";

// ── Badge / indicator ─────────────────────────────────────
export { aiHighlight, criticalWarning, statusTransition } from "./motion";

// ── Skeleton reveal variants ──────────────────────────────
export {
  skeletonToCard,
  skeletonToTable,
  skeletonToChart,
  skeletonToAlerts,
  skeletonToExplanation,
} from "./motion";

// ── Utilities ─────────────────────────────────────────────
export { getRiskMotion, safeVariant, staggerDelay } from "./motion";

// ── Hooks ─────────────────────────────────────────────────
export {
  useFraudEyeMotion,
  useRowFlash,
  useLiveEntry,
  useStaggeredList,
  useValueChange,
  useSkeletonVisible,
  useRiskMotion,
} from "./useMotion";

// ── Pre-wired components ──────────────────────────────────
export {
  AnimatedCard,
  AnimatedRow,
  AnimatedSection,
  AnimatedList,
  LiveDot,
  FeedbackFlash,
  AnimatedCounter,
  SkeletonPulse,
  SkeletonReveal,
  AnimatedExpandIcon,
  CriticalWarningFlash,
  AIInsightHighlight,
  ChartEntrance,
  PageEntrance,
  DrawerShell,
  ModalShell,
  OverlayBackdrop,
} from "./MotionComponents";
