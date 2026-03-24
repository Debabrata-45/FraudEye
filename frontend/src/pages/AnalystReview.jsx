import { useState, useMemo, useCallback } from "react";
import { RefreshCw, Wifi, Database } from "lucide-react";
import { useToast } from "../components/feedback";

import { PageWrapper } from "../components/layout/PageShell";
import { ThreeColLayout } from "../components/Responsive";
import AnalystHeader from "./analyst/AnalystHeader";
import ReviewQueue from "./analyst/ReviewQueue";
import CaseDetail from "./analyst/CaseDetail";
import ActionPanel from "./analyst/ActionPanel";
import { useReviewQueue, useAnalystActions } from "./analyst/useAnalystData";
import { cn } from "../utils/cn";

const AnalystReview = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const { showToast } = useToast();

  const { cases, loading, error, summary, mode, toggleMode, refresh } =
    useReviewQueue();

  const { actionStatus, actionMessage, submitAction, resetAction } =
    useAnalystActions({
      onSuccess: ({ actionKey }) => {
        const messages = {
          CONFIRM_FRAUD: {
            type: "success",
            message: "Transaction confirmed as fraud",
          },
          CLEAR_LEGITIMATE: {
            type: "success",
            message: "Case cleared as legitimate",
          },
          ESCALATE: {
            type: "info",
            message: "Case escalated to senior analyst",
          },
          REQUEST_INFO: { type: "info", message: "Additional info requested" },
        };
        const msg = messages[actionKey];
        if (msg) showToast(msg);
      },
      onError: ({ message }) => {
        showToast({
          type: "error",
          message: message ?? "Action failed — please retry",
        });
      },
      onRefresh: () => {
        refresh();
        setTimeout(() => setSelectedCase(null), 300);
      },
    });

  const handleSelect = useCallback(
    (item) => {
      setSelectedCase(item);
      resetAction();
    },
    [resetAction],
  );

  const handleRefresh = useCallback(() => {
    setSelectedCase(null);
    refresh();
  }, [refresh]);

  const handleAction = useCallback(
    (actionKey, note) => {
      if (!selectedCase) return;
      submitAction({ actionKey, caseData: selectedCase, note });
    },
    [selectedCase, submitAction],
  );

  const sortedCases = useMemo(() => {
    const RISK = { critical: 0, high: 1, medium: 2, low: 3 };
    const STATUS = {
      pending: 0,
      reviewing: 1,
      escalated: 2,
      confirmed: 3,
      cleared: 4,
    };
    return [...cases].sort((a, b) => {
      const sd = (STATUS[a.status] ?? 9) - (STATUS[b.status] ?? 9);
      if (sd !== 0) return sd;
      const rd = (RISK[a.severity] ?? 9) - (RISK[b.severity] ?? 9);
      if (rd !== 0) return rd;
      return (b.score ?? 0) - (a.score ?? 0);
    });
  }, [cases]);

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <AnalystHeader summary={summary} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={toggleMode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all",
                mode === "live"
                  ? "bg-[#22D3EE0A] border-[#22D3EE33] text-[#22D3EE]"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200",
              )}
            >
              {mode === "live" ? <Wifi size={12} /> : <Database size={12} />}
              {mode === "live" ? "Live" : "Demo"}
            </button>
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
                    #{selectedCase.transactionId}
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
                    Reviewing #{selectedCase.transactionId}
                  </span>
                )}
              </div>
              <ActionPanel
                item={selectedCase}
                onAction={handleAction}
                actionStatus={actionStatus}
                actionMessage={actionMessage}
              />
            </div>
          }
        />
      </div>
    </PageWrapper>
  );
};

export default AnalystReview;
