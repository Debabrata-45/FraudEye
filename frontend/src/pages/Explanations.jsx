import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import ExplanationsHeader from "./explanations/ExplanationsHeader";
import CaseSelector from "./explanations/CaseSelector";
import ExplanationSummary from "./explanations/ExplanationSummary";
import ContributionChart from "./explanations/ContributionChart";
import FraudDrivers from "./explanations/FraudDrivers";
import RelatedTransaction from "./explanations/RelatedTransaction";
import { MOCK_CASES } from "./explanations/explanationsData";

// ─── Empty / no selection ─────────────────────────────────────────────────────
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
      {/* Orbit rings */}
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

// ─── Loading state ────────────────────────────────────────────────────────────
const ExplanationLoading = () => (
  <div className="space-y-4">
    {/* Summary skeleton */}
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
    {/* Chart skeleton */}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
const Explanations = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [explaining, setExplaining] = useState(false);

  // Load cases
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setCases(MOCK_CASES);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  // Simulate "fetching" explanation on case change
  const handleSelectCase = useCallback(
    (xcase) => {
      if (selectedCase?.id === xcase.id) return;
      setExplaining(true);
      setSelectedCase(null);
      const t = setTimeout(() => {
        setSelectedCase(xcase);
        setExplaining(false);
      }, 500);
      return () => clearTimeout(t);
    },
    [selectedCase],
  );

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        <ExplanationsHeader selectedCase={selectedCase} />

        {/* Main layout: case list + explanation workspace */}
        <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
          {/* Left: case selector */}
          <div className="w-64 flex-shrink-0 overflow-y-auto">
            <CaseSelector
              cases={cases}
              selectedId={selectedCase?.id}
              onSelect={handleSelectCase}
              loading={loading}
            />
          </div>

          {/* Right: explanation workspace */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              {explaining ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExplanationLoading />
                </motion.div>
              ) : !selectedCase ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
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
                  {/* 1 — Executive summary */}
                  <ExplanationSummary xcase={selectedCase} />

                  {/* 2 — Contribution chart */}
                  <ContributionChart xcase={selectedCase} />

                  {/* 3 — Drivers + confidence + recommendation */}
                  <FraudDrivers xcase={selectedCase} />

                  {/* 4 — Related transaction */}
                  <RelatedTransaction xcase={selectedCase} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Explanations;
