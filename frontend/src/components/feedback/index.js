/**
 * FraudEye Feedback System — Barrel Export
 * Phase 14 — Loading, Empty, Error, Success states
 *
 * Import from: '../../components/feedback'   (from pages/sub-components)
 * Import from: '../components/feedback'      (from pages/)
 *
 * Quick reference:
 *
 * SKELETONS
 *   PageSkeleton({ variant })         — full page (default|table|split|dashboard|three-col|explanation)
 *   KPIRowSkeleton({ count })         — row of KPI cards
 *   TableSkeleton({ rows, cols })     — full table
 *   TableRowSkeleton({ cols })        — single row (use inside <tbody>)
 *   ChartSkeleton({ height })         — chart panel
 *   AlertFeedSkeleton({ count })      — alert feed list
 *   AlertItemSkeleton()               — single alert row
 *   DetailPanelSkeleton()             — side drawer / detail panel
 *   ExplanationSkeleton()             — SHAP/XAI panel
 *   SettingsFormSkeleton({ rows })    — settings card
 *   StatCardSkeleton()                — single KPI card
 *   SkeletonLine({ width, height })   — text line
 *   SkeletonBlock({ className })      — generic block
 *
 * EMPTY STATES
 *   EmptyState({ icon, title, message, action })  — base
 *   NoThreats()                 — live monitoring / alerts all clear
 *   NoTransactions({ onReset }) — transactions page
 *   NoAlerts()                  — alerts page
 *   NoExplanationSelected()     — explanations — waiting for selection
 *   NoAuditLogs({ onReset })    — audit logs
 *   NoInsights()                — AI insights panel
 *   NoQueueItems()              — analyst review queue empty
 *   NoChartData({ title })      — chart has no data
 *   StreamIdle({ paused })      — live monitoring idle/paused
 *   NoSearchResults({ query, onReset })
 *   NoFilterResults({ filterLabel, onReset })
 *   InlineFilterEmpty({ colSpan, onReset }) — inside <tbody>
 *
 * ERROR STATES
 *   PageError({ onRetry, message, technical })     — full page error
 *   SectionError({ title, message, onRetry })      — section-level
 *   InlineSectionError({ message, onRetry })       — inside a panel
 *   StreamDisconnected({ onRetry })                — SSE disconnect banner
 *   StreamReconnecting()                           — reconnecting banner
 *   StaleDataWarning({ lastUpdate })               — stale data pill
 *   PartialDataBanner({ message })                 — partial load banner
 *   UnavailablePanel({ title, message, onRetry })  — panel unavailable
 *   TerminalError({ title, message })              — non-retryable
 *
 * SUCCESS / TOAST
 *   ToastProvider                   — wrap App in this
 *   useToast()                      — { showToast, dismiss }
 *   InlineSuccess({ message })      — green inline confirmation
 *   InlineFailure({ message, onRetry }) — red inline failure
 *   ActionFeedback({ status, message }) — status: idle|loading|success|error
 *   SaveBar({ isDirty, saveStatus, onSave, onDiscard }) — sticky save bar
 *   ConfirmModal({ open, title, message, confirmLabel, confirmVariant, onConfirm, onCancel })
 *
 * PAGE FALLBACK MAPS (pre-assembled per page)
 *   OverviewFallbacks.Loading / Error / KPILoading / ChartsLoading / Partial
 *   LiveMonitoringFallbacks.Loading / Disconnected / Reconnecting / EmptyFeed / NoThreats / StaleData / NoSelection / Error
 *   TransactionsFallbacks.Loading / TableLoading / DrawerLoading / Empty / NoResults / Error / DrawerError
 *   AlertsFallbacks.Loading / FeedLoading / DrawerLoading / Empty / AllClear / NoResults / Error / DrawerError
 *   ExplanationsFallbacks.Loading / ExplanationLoading / NoSelection / Empty / Partial / ContributionError / Error
 *   AnalystReviewFallbacks.Loading / QueueLoading / CaseLoading / Empty / NoResults / ActionSuccess / ActionError / Error
 *   AuditLogsFallbacks.Loading / TableLoading / DrawerLoading / Empty / NoResults / DrawerEmpty / Error
 *   SettingsFallbacks.Loading / SaveSuccess / SaveError / SystemInfoError / Error
 */

// ── Skeletons ─────────────────────────────────────────────
export {
  SkeletonLine,
  SkeletonBlock,
  StatCardSkeleton,
  KPIRowSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  AlertItemSkeleton,
  AlertFeedSkeleton,
  ChartSkeleton,
  DetailPanelSkeleton,
  ExplanationSkeleton,
  SettingsFormSkeleton,
  PageSkeleton,
} from "./skeletons";

// ── Empty States ──────────────────────────────────────────
export {
  EmptyState,
  NoThreats,
  NoTransactions,
  NoAlerts,
  NoExplanationSelected,
  NoAuditLogs,
  NoInsights,
  NoQueueItems,
  NoChartData,
  StreamIdle,
  NoSearchResults,
  NoFilterResults,
  InlineFilterEmpty,
} from "./emptyStates";

// ── Error States ──────────────────────────────────────────
export {
  ErrorState,
  PageError,
  SectionError,
  InlineSectionError,
  StreamDisconnected,
  StreamReconnecting,
  StaleDataWarning,
  PartialDataBanner,
  UnavailablePanel,
  TerminalError,
} from "./errorStates";

// ── Success / Toast / Feedback ────────────────────────────
// ── Success / Toast / Feedback ────────────────────────────
export {
  ToastProvider,
  InlineSuccess,
  InlineFailure,
  ActionFeedback,
  SaveBar,
  ConfirmModal,
} from "./feedbackToast";

export { useToast } from "./useToast";
// ── Page Fallback Maps ────────────────────────────────────
export {
  OverviewFallbacks,
  LiveMonitoringFallbacks,
  TransactionsFallbacks,
  AlertsFallbacks,
  ExplanationsFallbacks,
  AnalystReviewFallbacks,
  AuditLogsFallbacks,
  SettingsFallbacks,
} from "./pageFallbacks";
