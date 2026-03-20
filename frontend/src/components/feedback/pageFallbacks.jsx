/**
 * pageFallbacks.jsx — Page-Specific Fallback Strategies
 *
 * Each page has its own loading, empty, error, and partial-data strategy.
 * Drop these directly into each page's render path.
 *
 * Exports one component per page:
 *   OverviewFallbacks
 *   LiveMonitoringFallbacks
 *   TransactionsFallbacks
 *   AlertsFallbacks
 *   ExplanationsFallbacks
 *   AnalystReviewFallbacks
 *   AuditLogsFallbacks
 *   SettingsFallbacks
 *
 * Each exports: Loading, Empty, Error, Partial sub-components.
 *
 * Usage:
 *   import { OverviewFallbacks } from '../components/feedback/pageFallbacks';
 *   if (loading) return <OverviewFallbacks.Loading />;
 *   if (error)   return <OverviewFallbacks.Error onRetry={refetch} />;
 */

import {
  PageSkeleton,
  KPIRowSkeleton,
  ChartSkeleton,
  AlertFeedSkeleton,
  DetailPanelSkeleton,
  ExplanationSkeleton,
  TableSkeleton,
  SettingsFormSkeleton,
  StatCardSkeleton,
} from "./skeletons";

import {
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
} from "./emptyStates";

import {
  PageError,
  SectionError,
  InlineSectionError,
  StreamDisconnected,
  StreamReconnecting,
  StaleDataWarning,
  PartialDataBanner,
  UnavailablePanel,
} from "./errorStates";

import { InlineSuccess, InlineFailure } from "./feedbackToast";

/* ════════════════════════════════════════════════════════════
   OVERVIEW PAGE
   ════════════════════════════════════════════════════════════ */
export const OverviewFallbacks = {
  /** Full page skeleton with KPI + charts */
  Loading: () => <PageSkeleton variant="dashboard" />,

  /** KPI row loading only */
  KPILoading: () => <KPIRowSkeleton className="mb-8" />,

  /** Charts section loading only */
  ChartsLoading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      <ChartSkeleton className="md:col-span-2" height={200} />
      <ChartSkeleton height={200} />
      <ChartSkeleton height={180} />
      <ChartSkeleton height={180} />
    </div>
  ),

  /** Page-level fetch failure */
  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="The overview dashboard could not be loaded. Your fraud monitoring system is still running."
    />
  ),

  /** Charts loaded but insights missing */
  Partial: () => (
    <PartialDataBanner message="AI Insights could not be loaded. Transaction analytics are available." />
  ),
};

/* ════════════════════════════════════════════════════════════
   LIVE MONITORING PAGE
   ════════════════════════════════════════════════════════════ */
export const LiveMonitoringFallbacks = {
  Loading: () => <PageSkeleton variant="split" />,

  /** Stream disconnected banner */
  Disconnected: ({ onRetry }) => <StreamDisconnected onRetry={onRetry} />,

  /** Reconnecting banner */
  Reconnecting: () => <StreamReconnecting />,

  /** No events in feed */
  EmptyFeed: ({ paused }) => <StreamIdle paused={paused} />,

  /** All clear — no threats */
  NoThreats: () => <NoThreats compact />,

  /** Stale data indicator */
  StaleData: ({ lastUpdate }) => <StaleDataWarning lastUpdate={lastUpdate} />,

  /** Spotlight panel has nothing selected */
  NoSelection: () => <NoExplanationSelected />,

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="Could not connect to the live monitoring stream. Please check your connection."
    />
  ),
};

/* ════════════════════════════════════════════════════════════
   TRANSACTIONS PAGE
   ════════════════════════════════════════════════════════════ */
export const TransactionsFallbacks = {
  Loading: () => <PageSkeleton variant="table" />,

  TableLoading: () => <TableSkeleton rows={10} cols={7} />,

  DrawerLoading: () => <DetailPanelSkeleton className="h-[560px]" />,

  /** No transactions in system */
  Empty: ({ onReset }) => <NoTransactions onReset={onReset} compact />,

  /** Filter/search returned nothing */
  NoResults: ({ query, onReset }) =>
    query ? (
      <NoSearchResults query={query} onReset={onReset} compact />
    ) : (
      <NoFilterResults onReset={onReset} compact />
    ),

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="Transaction records could not be loaded. Your data is safe — this is a temporary display issue."
    />
  ),

  DrawerError: ({ onRetry }) => (
    <UnavailablePanel
      title="Details unavailable"
      message="Transaction details could not be loaded for this record."
      onRetry={onRetry}
    />
  ),
};

/* ════════════════════════════════════════════════════════════
   ALERTS PAGE
   ════════════════════════════════════════════════════════════ */
export const AlertsFallbacks = {
  Loading: () => <PageSkeleton variant="split" />,

  FeedLoading: () => <AlertFeedSkeleton count={7} />,

  DrawerLoading: () => <DetailPanelSkeleton />,

  /** No alerts at all */
  Empty: () => <NoAlerts compact />,

  /** All clear */
  AllClear: () => <NoThreats compact />,

  /** Filter returned nothing */
  NoResults: ({ filterLabel, onReset }) => (
    <NoFilterResults filterLabel={filterLabel} onReset={onReset} compact />
  ),

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="Alert records could not be loaded. Live detection is still running."
    />
  ),

  DrawerError: ({ onRetry }) => (
    <UnavailablePanel
      title="Alert detail unavailable"
      message="This alert's details could not be loaded."
      onRetry={onRetry}
    />
  ),
};

/* ════════════════════════════════════════════════════════════
   EXPLANATIONS PAGE
   ════════════════════════════════════════════════════════════ */
export const ExplanationsFallbacks = {
  Loading: () => <PageSkeleton variant="explanation" />,

  ExplanationLoading: () => <ExplanationSkeleton />,

  /** No case selected yet */
  NoSelection: () => <NoExplanationSelected />,

  /** Case list empty */
  Empty: () => <NoThreats compact />,

  /** SHAP loaded but LIME unavailable */
  Partial: () => (
    <PartialDataBanner message="LIME explanations are temporarily unavailable. SHAP analysis is displayed." />
  ),

  /** Summary loaded but contribution bars failed */
  ContributionError: ({ onRetry }) => (
    <InlineSectionError
      message="Feature contributions could not be loaded."
      onRetry={onRetry}
    />
  ),

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="Explanation data could not be loaded from the ML service."
    />
  ),
};

/* ════════════════════════════════════════════════════════════
   ANALYST REVIEW PAGE
   ════════════════════════════════════════════════════════════ */
export const AnalystReviewFallbacks = {
  Loading: () => <PageSkeleton variant="three-col" />,

  QueueLoading: () => <AlertFeedSkeleton count={6} />,

  CaseLoading: () => <DetailPanelSkeleton />,

  /** Review queue is empty */
  Empty: () => <NoQueueItems compact />,

  /** No filtered results in queue */
  NoResults: ({ filterLabel, onReset }) => (
    <NoFilterResults filterLabel={filterLabel} onReset={onReset} compact />
  ),

  /** Action submitted successfully */
  ActionSuccess: ({ message }) => (
    <InlineSuccess message={message ?? "Decision submitted successfully"} />
  ),

  /** Action failed */
  ActionError: ({ message, onRetry }) => (
    <InlineFailure
      message={message ?? "Action could not be completed. Please try again."}
      onRetry={onRetry}
    />
  ),

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="The analyst review queue could not be loaded."
    />
  ),
};

/* ════════════════════════════════════════════════════════════
   AUDIT LOGS PAGE
   ════════════════════════════════════════════════════════════ */
export const AuditLogsFallbacks = {
  Loading: () => <PageSkeleton variant="table" />,

  TableLoading: () => <TableSkeleton rows={12} cols={6} />,

  DrawerLoading: () => <DetailPanelSkeleton />,

  /** No logs found */
  Empty: ({ onReset }) => <NoAuditLogs onReset={onReset} compact />,

  /** No results after search/filter */
  NoResults: ({ query, onReset }) =>
    query ? (
      <NoSearchResults query={query} onReset={onReset} compact />
    ) : (
      <NoFilterResults onReset={onReset} compact />
    ),

  /** Drawer detail unavailable */
  DrawerEmpty: () => (
    <UnavailablePanel
      title="No entry selected"
      message="Select a log entry to view its full details and state diff."
    />
  ),

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="Audit log records could not be loaded."
    />
  ),
};

/* ════════════════════════════════════════════════════════════
   SETTINGS PAGE
   ════════════════════════════════════════════════════════════ */
export const SettingsFallbacks = {
  Loading: () => (
    <div className="w-full px-5 md:px-6 lg:px-8 pt-6 pb-12 max-w-[1600px] mx-auto space-y-6">
      <div className="space-y-2 mb-6">
        <div className="fe-shimmer h-7 w-32 rounded-lg" />
        <div className="fe-shimmer h-3 w-56 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <SettingsFormSkeleton rows={5} />
          <SettingsFormSkeleton rows={4} />
          <SettingsFormSkeleton rows={3} />
        </div>
        <div className="space-y-4">
          <StatCardSkeleton />
          <SettingsFormSkeleton rows={3} />
        </div>
      </div>
    </div>
  ),

  /** Settings saved */
  SaveSuccess: () => <InlineSuccess message="Settings saved successfully" />,

  /** Settings save failed */
  SaveError: ({ onRetry }) => (
    <InlineFailure
      message="Settings could not be saved. Please try again."
      onRetry={onRetry}
    />
  ),

  /** System info unavailable */
  SystemInfoError: () => (
    <InlineSectionError message="System connectivity status could not be loaded." />
  ),

  Error: ({ onRetry }) => (
    <PageError
      onRetry={onRetry}
      message="Settings could not be loaded. Your current configuration is unchanged."
    />
  ),
};
