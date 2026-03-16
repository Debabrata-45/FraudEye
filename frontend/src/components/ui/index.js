/**
 * FraudEye UI Component Library — Phase 3
 * Barrel export — import anything from '../../components/ui'
 *
 * Usage:
 *   import { GlassCard, Button, RiskBadge, TabGroup } from '../../components/ui';
 */

// ── Surfaces ──────────────────────────────────────────────
export {
  GlassCard,
  GlowCard,
  FlatCard,
  PanelShell,
  SectionWrapper,
  InsetPanel,
} from "./Card";

// ── Typography ────────────────────────────────────────────
export {
  PageHeader,
  SectionHeading,
  CardTitle,
  MetaText,
  Label,
  HelperText,
  GradientHeading,
  MonoText,
  TruncatedText,
} from "./Typography";

// ── Buttons ───────────────────────────────────────────────
export { Button, IconButton, ButtonGroup } from "./Button";

// ── Inputs ────────────────────────────────────────────────
export {
  TextInput,
  SearchBar,
  Select,
  FilterChip,
  FilterChipGroup,
  DateRangeShell,
} from "./Input";

// ── Badges & Status ───────────────────────────────────────
export {
  RiskBadge,
  StatusBadge,
  SeverityPill,
  LiveBadge,
  RiskBar,
  SeverityRing,
  CountBadge,
  RISK_CONFIG,
} from "./Badge";

// ── Metrics & Insights ────────────────────────────────────
export {
  MetricCard,
  InsightCard,
  MiniMetricTile,
  TrendIndicator,
  CountUp,
} from "./MetricCard";

// ── Table ─────────────────────────────────────────────────
export {
  TableShell,
  TableHead,
  TableHeaderCell,
  SortableHeader,
  TableBody,
  AnimatedTableBody,
  TableRow,
  TableCell,
  EmptyTableRow,
  TableRowSkeleton,
} from "./Table";

// ── Drawer / Modal / Overlay ──────────────────────────────
export {
  SlideDrawer,
  Modal,
  Overlay,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "./Drawer";

// ── Alerts & Live Feed ────────────────────────────────────
export {
  AlertItem,
  AlertFeed,
  ReasonTag,
  TimelineMarker,
  LivePulse,
  AlertSkeleton,
} from "./Alert";

// ── XAI Components ────────────────────────────────────────
export {
  ExplanationSummary,
  ContributionBar,
  FraudDriverChip,
  ConfidenceBox,
  RecommendationBox,
  ExplanationMetaRow,
  FeatureTable,
  ExplanationSkeleton,
} from "./XAI";

// ── States & Feedback ─────────────────────────────────────
export {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  CardSkeleton,
  PageLoader,
  InlineSpinner,
} from "./States";

// ── Tabs & Navigation ─────────────────────────────────────
export {
  TabGroup,
  SegmentedControl,
  NavChip,
  NavChipGroup,
  useTab,
} from "./Tabs";
