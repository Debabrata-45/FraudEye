import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useToast } from "../components/feedback";

import { PageWrapper } from "../components/layout/PageShell";
import { ThreeColLayout } from "../components/Responsive";
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
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setCases(MOCK_CASES);
      setLoading(false);
    }, 750);
    return () => clearTimeout(t);
  }, [refreshKey]);

  const summary = useMemo(() => getQueueSummary(cases), [cases]);

  const handleSelect = useCallback((item) => setSelectedCase(item), []);
  const handleRefresh = useCallback(() => {
    setSelectedCase(null);
    setRefreshKey((k) => k + 1);
  }, []);

  const sortedCases = useMemo(() => {
    const P = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const S = {
      PENDING: 0,
      IN_REVIEW: 1,
      ESCALATED: 2,
      RESOLVED: 3,
      CONFIRMED: 4,
      CLEARED: 5,
    };
    return [...cases].sort((a, b) => {
      const pd = (P[a.priority] ?? 9) - (P[b.priority] ?? 9);
      return pd !== 0
        ? pd
        : (S[a.reviewStatus] ?? 9) - (S[b.reviewStatus] ?? 9);
    });
  }, [cases]);

  const handleAction = useCallback(
    (actionKey) => {
      const messages = {
        CONFIRM_FRAUD: {
          type: "success",
          message: "Transaction confirmed as fraud",
        },
        CLEAR_LEGITIMATE: {
          type: "success",
          message: "Case cleared as legitimate",
        },
        ESCALATE: { type: "info", message: "Case escalated to senior analyst" },
        REQUEST_INFO: { type: "info", message: "Additional info requested" },
      };
      const msg = messages[actionKey];
      if (msg) showToast(msg);
    },
    [showToast],
  );

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <AnalystHeader summary={summary} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="fe-btn-ghost"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Three-column workspace */}
        <ThreeColLayout
          height={580}
          queue={
            <ReviewQueue
              cases={sortedCases}
              selectedId={selectedCase?.id}
              onSelect={handleSelect}
              loading={loading}
            />
          }
          detail={
            <div className="flex flex-col h-full">
              <div className="fe-panel-header flex-shrink-0 mb-3">
                <span className="fe-panel-header-title">Case Detail</span>
                {selectedCase && (
                  <span className="text-xs text-[#475569] font-mono">
                    {selectedCase.id}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <CaseDetail item={selectedCase} />
              </div>
            </div>
          }
          actions={
            <div>
              <div className="fe-panel-header mb-3">
                <span className="fe-panel-header-title">
                  Actions &amp; Notes
                </span>
                {selectedCase && (
                  <span className="text-xs text-[#475569]">
                    Reviewing {selectedCase.txnId}
                  </span>
                )}
              </div>
              <ActionPanel item={selectedCase} onAction={handleAction} />
            </div>
          }
        />
      </div>
    </PageWrapper>
  );
};

export default AnalystReview;
