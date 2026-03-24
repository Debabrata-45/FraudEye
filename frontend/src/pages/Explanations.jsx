import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RefreshCw, Wifi, Database } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import { SplitLayout } from "../components/Responsive";
import ExplanationsHeader from "./explanations/ExplanationsHeader";
import CaseSelector from "./explanations/CaseSelector";
import ExplanationSummary from "./explanations/ExplanationSummary";
import ContributionChart from "./explanations/ContributionChart";
import FraudDrivers from "./explanations/FraudDrivers";
import RelatedTransaction from "./explanations/RelatedTransaction";
import { useCaseList, useCaseDetail } from "./explanations/useExplanationsData";
import { cn } from "../utils/cn";

/* ── Empty state ─────────────────────────────────────────── */
const EmptyExplanation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-full min-h-[400px] gap-5"
  >
    <div className="relative">
      <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
        <Brain size={32} className="text-slate-600" />
      </div>
      <div
        className="absolute inset-0 rounded-2xl border border-violet-500/10 scale-110 animate-ping"
        style={{ animationDuration: "3s" }}
      />
      <div className="absolute inset-0 rounded-2xl border border-cyan-500/10 scale-125" />
    </div>
    <div className="text-center max-w-xs">
      <p className="text-sm font-semibold text-slate-300 mb-1">
        Select a transaction to explain
      </p>
      <p className="text-xs text-slate-600 leading-relaxed">
        Choose any case from the panel on the left to view SHAP &amp; LIME
        feature contributions, fraud drivers, confidence metrics, and
        recommended analyst actions.
      </p>
    </div>
  </motion.div>
);

/* ── Loading state ───────────────────────────────────────── */
const ExplanationLoading = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-slate-800 p-5 space-y-3">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-3 w-full rounded bg-slate-800 animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
    <div className="rounded-2xl border border-slate-800 p-5 space-y-3">
      <div className="h-4 w-40 rounded bg-slate-800 animate-pulse" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="w-6 h-6 rounded-lg bg-slate-800 animate-pulse" />
          <div
            className="flex-1 h-2 rounded-full bg-slate-800 animate-pulse"
            style={{ width: `${60 + i * 7}%` }}
          />
        </div>
      ))}
    </div>
  </div>
);

/* ── Explanation workspace ───────────────────────────────── */
const ExplanationWorkspace = ({ selectedCase, explaining }) => (
  <AnimatePresence mode="wait">
    {explaining ? (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ExplanationLoading />
      </motion.div>
    ) : !selectedCase ? (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <EmptyExplanation />
      </motion.div>
    ) : (
      <motion.div
        key={selectedCase.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
      >
        <ExplanationSummary xcase={selectedCase} />
        <ContributionChart xcase={selectedCase} />
        <FraudDrivers xcase={selectedCase} />
        <RelatedTransaction xcase={selectedCase} />
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Page ────────────────────────────────────────────────── */
const Explanations = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const {
    cases,
    loading: listLoading,
    mode,
    toggleMode,
    refresh,
  } = useCaseList();
  const { detail, loading: detailLoading } = useCaseDetail(selectedId);

  // When detail loads from API, update selectedCase
  useEffect(() => {
    if (detail) setSelectedCase(detail);
  }, [detail]);

  const handleSelectCase = useCallback(
    (xcase) => {
      if (selectedId === String(xcase.id)) return;
      setSelectedCase(null);
      // Strip TXN- prefix if present, use transactionId
      setSelectedId(
        String(xcase.transactionId ?? xcase.id).replace(/^TXN-0*/i, ""),
      );
    },
    [selectedId],
  );

  const explaining = !!selectedId && detailLoading;

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header + mode toggle */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
          <div className="flex-1 min-w-0">
            <ExplanationsHeader selectedCase={selectedCase} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={toggleMode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all",
                mode === "live"
                  ? "bg-[#8B5CF60A] border-[#8B5CF633] text-[#8B5CF6]"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200",
              )}
            >
              {mode === "live" ? <Wifi size={12} /> : <Database size={12} />}
              {mode === "live" ? "Live API" : "Demo"}
            </button>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400
                hover:text-slate-200 transition-all"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        </div>

        <SplitLayout
          list={
            <CaseSelector
              cases={cases}
              selectedId={selectedCase?.id ?? selectedId}
              onSelect={handleSelectCase}
              loading={listLoading}
            />
          }
          detail={
            <ExplanationWorkspace
              selectedCase={selectedCase}
              explaining={explaining}
            />
          }
          detailOpen={!!selectedCase || explaining}
          height={600}
          listCols={1}
        />
      </div>
    </PageWrapper>
  );
};

export default Explanations;
