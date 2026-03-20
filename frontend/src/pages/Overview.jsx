/**
 * Overview.jsx — FraudEye Main Dashboard Overview Page
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { PageWrapper } from "../components/layout/PageShell";
import { CardSkeleton, ErrorState } from "../components/ui/States";
import { Button } from "../components/ui";
import { fadeUp, staggerNormal } from "../motion";
import { OverviewFallbacks } from "../components/feedback";
import { SectionBlock, CardGrid } from "../components/Responsive";

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
      <div className="mb-8 space-y-3">
        <div className="fe-shimmer h-4 w-48 rounded-full" />
        <div className="fe-shimmer h-8 w-72 rounded-lg" />
        <div className="fe-shimmer h-3 w-96 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 fe-shimmer h-64 rounded-xl" />
        <div className="fe-shimmer h-64 rounded-xl" />
        <div className="fe-shimmer h-48 rounded-xl" />
        <div className="fe-shimmer h-48 rounded-xl" />
      </div>
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

  if (loading) return <OverviewFallbacks.Loading />;
  if (error) return <OverviewFallbacks.Error onRetry={handleRefresh} />;

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

          <KPIRow />

          {/* ── 3. Charts ───────────────────────────────── */}
          <SectionBlock heading="Analytics Overview">
            <OverviewCharts />
          </SectionBlock>

          {/* ── 4. Intelligence & Monitoring triptych ───── */}
          <SectionBlock
            heading="Intelligence & Monitoring"
            action={
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
            }
          >
            <motion.div
              variants={staggerNormal}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              >
                <div className="bg-[#0D1627] border border-[#1E293B] rounded-xl p-5">
                  <AIInsightsPanel />
                </div>
                <div className="bg-[#0D1627] border border-[#1E293B] rounded-xl p-5">
                  <LiveAlertsPanel />
                </div>
                <div>
                  <XAIPreviewPanel />
                </div>
              </motion.div>
            </motion.div>
          </SectionBlock>

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
