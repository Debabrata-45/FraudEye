import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import AnalystHeader from "./analyst/AnalystHeader";
import ReviewQueue from "./analyst/ReviewQueue";
import CaseDetail from "./analyst/CaseDetail";
import ActionPanel from "./analyst/ActionPanel";
import { MOCK_CASES, getQueueSummary } from "./analyst/analystData";

const AnalystReview = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load cases
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setCases(MOCK_CASES);
      setLoading(false);
    }, 750);
    return () => clearTimeout(t);
  }, [refreshKey]);

  const summary = useMemo(() => getQueueSummary(cases), [cases]);

  const handleSelect = useCallback((item) => {
    setSelectedCase(item);
  }, []);

  const handleRefresh = useCallback(() => {
    setSelectedCase(null);
    setRefreshKey((k) => k + 1);
  }, []);

  // Sort: critical + pending first
  const sortedCases = useMemo(() => {
    const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const STATUS_ORDER = {
      PENDING: 0,
      IN_REVIEW: 1,
      ESCALATED: 2,
      RESOLVED: 3,
      CONFIRMED: 4,
      CLEARED: 5,
    };
    return [...cases].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority] ?? 9;
      const pb = PRIORITY_ORDER[b.priority] ?? 9;
      if (pa !== pb) return pa - pb;
      return (
        (STATUS_ORDER[a.reviewStatus] ?? 9) -
        (STATUS_ORDER[b.reviewStatus] ?? 9)
      );
    });
  }, [cases]);

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <AnalystHeader summary={summary} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50
                text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Three-column workspace */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-1 gap-3 min-h-0 overflow-hidden"
        >
          {/* Col 1: Review queue */}
          <div className="w-64 flex-shrink-0 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-4 overflow-hidden flex flex-col">
            <ReviewQueue
              cases={sortedCases}
              selectedId={selectedCase?.id}
              onSelect={handleSelect}
              loading={loading}
            />
          </div>

          {/* Col 2: Case detail */}
          <div className="flex-1 min-w-0 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-4 overflow-hidden flex flex-col">
            <div className="pb-3 border-b border-slate-800 mb-3 flex-shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Case Detail
              </p>
              {selectedCase && (
                <p className="text-xs text-slate-600 mt-0.5 font-mono">
                  {selectedCase.id}
                </p>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <CaseDetail item={selectedCase} />
            </div>
          </div>

          {/* Col 3: Actions + notes */}
          <div className="w-72 flex-shrink-0 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="pb-3 border-b border-slate-800 mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Actions &amp; Notes
              </p>
              {selectedCase && (
                <p className="text-xs text-slate-600 mt-0.5">
                  Reviewing {selectedCase.txnId}
                </p>
              )}
            </div>
            <ActionPanel item={selectedCase} onAction={null} />
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default AnalystReview;
