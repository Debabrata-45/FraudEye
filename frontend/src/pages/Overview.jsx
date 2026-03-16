/**
 * Overview.jsx — FraudEye Main Dashboard Overview Page
 *
 * The primary landing screen. Communicates:
 *   - Real-time fraud intelligence at a glance
 *   - Explainable AI capability
 *   - Operational monitoring seriousness
 *   - Premium analytics product quality
 *
 * Structure (top to bottom):
 *   1. Hero / header
 *   2. KPI row (6 cards)
 *   3. Analytics charts (fraud trend, risk dist, hourly, merchants)
 *   4. Bottom triptych: AI Insights | Live Alerts | XAI Preview
 *
 * Swap mock data → real API by replacing MOCK_* imports with
 * useQuery/useEffect calls that hit the backend endpoints.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { PageWrapper } from "../components/layout/PageShell";
import { CardSkeleton, ErrorState } from "../components/ui/States";
import { Button } from "../components/ui";
import { fadeUp, staggerNormal } from "../motion";

import OverviewHero from "./overview/OverviewHero";
import KPIRow from "./overview/KPIRow";
import OverviewCharts from "./overview/OverviewCharts";
import AIInsightsPanel from "./overview/AIInsightsPanel";
import LiveAlertsPanel from "./overview/LiveAlertsPanel";
import XAIPreviewPanel from "./overview/XAIPreviewPanel";

/* ── Loading state ───────────────────────────────────────── */
function OverviewSkeleton() {
  return (
    <PageWrapper>
      {/* Hero skeleton */}
      <div className="mb-8 space-y-3">
        <div className="fe-shimmer h-4 w-48 rounded-full" />
        <div className="fe-shimmer h-8 w-72 rounded-lg" />
        <div className="fe-shimmer h-3 w-96 rounded-full" />
      </div>

      {/* KPI skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 fe-shimmer h-64 rounded-xl" />
        <div className="fe-shimmer h-64 rounded-xl" />
        <div className="fe-shimmer h-48 rounded-xl" />
        <div className="fe-shimmer h-48 rounded-xl" />
      </div>

      {/* Bottom panels skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="fe-shimmer h-80 rounded-xl" />
        ))}
      </div>
    </PageWrapper>
  );
}

/* ── Main Overview page ──────────────────────────────────── */
export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate initial load (replace with real API calls)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setLastRefresh(new Date());
    }, 600);
  };

  /* Loading */
  if (loading) return <OverviewSkeleton />;

  /* Error */
  if (error) {
    return (
      <PageWrapper>
        <ErrorState
          title="Failed to load overview"
          message={error}
          onRetry={handleRefresh}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <AnimatePresence mode="wait">
        <motion.div
          key="overview-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── 1. Hero ─────────────────────────────────── */}
          <OverviewHero />

          {/* ── 2. KPI Row ──────────────────────────────── */}
          <KPIRow />

          {/* ── 3. Charts ───────────────────────────────── */}
          <OverviewCharts />

          {/* ── 4. Bottom triptych ──────────────────────── */}
          <motion.div
            variants={staggerNormal}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            {/* Section heading row */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between mb-4"
            >
              <h2 className="fe-section-heading">
                Intelligence &amp; Monitoring
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#334155]">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  icon={RefreshCw}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </div>
            </motion.div>

            {/* 3-column grid */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            >
              {/* AI Insights */}
              <div className="bg-[#0D1627] border border-[#1E293B] rounded-xl p-5">
                <AIInsightsPanel />
              </div>

              {/* Live Alerts */}
              <div className="bg-[#0D1627] border border-[#1E293B] rounded-xl p-5">
                <LiveAlertsPanel />
              </div>

              {/* XAI Preview — spans full on small, 1 col on lg */}
              <div>
                <XAIPreviewPanel />
              </div>
            </motion.div>
          </motion.div>

          {/* ── 5. Footer bar ───────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between py-4 border-t border-[#0F172A]"
          >
            <span className="text-[10px] text-[#1E293B] font-mono uppercase tracking-widest">
              FraudEye v1.0.0 · XGBoost v1 · AUC 0.9962 · F1 0.8308
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-[#1E293B]">
                24,847 txns processed today
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#22C55E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                All systems operational
              </span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
}
