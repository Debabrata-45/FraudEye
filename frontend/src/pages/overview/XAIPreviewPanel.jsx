/**
 * XAIPreviewPanel.jsx — XAI / Explainability preview block
 * Shows: Why flagged, top SHAP drivers, confidence ring, recommendation
 */

import { motion } from "framer-motion";
import { BrainCircuit, ShieldAlert, ChevronRight } from "lucide-react";
import { SeverityRing } from "../../components/ui/Badge";
import {
  FeatureTable,
  RecommendationBox,
  ExplanationMetaRow,
} from "../../components/ui/XAI";
import { fadeUp } from "../../motion";
import { MOCK_XAI_SAMPLE } from "./overviewData";

/* ── Driver chip ─────────────────────────────────────────── */
function DriverChip({ label }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border
                      text-[10px] font-semibold text-[#F43F5E]
                      bg-[#F43F5E0E] border-[#F43F5E28]"
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {label.replace(/_/g, " ")}
    </span>
  );
}

export default function XAIPreviewPanel() {
  const xai = MOCK_XAI_SAMPLE;
  const maxAbs = Math.max(...xai.features.map((f) => Math.abs(f.value)));

  return (
    <div className="bg-[#0D1627] border border-[#1E293B] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#0F172A]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#8B5CF614] border border-[#8B5CF622]">
            <BrainCircuit
              size={14}
              strokeWidth={1.5}
              className="text-[#8B5CF6]"
            />
          </span>
          <div>
            <h3 className="text-xs font-semibold text-[#F8FAFC] leading-none">
              Explainability Preview
            </h3>
            <p className="text-[10px] text-[#334155] mt-0.5">
              Why was{" "}
              <span className="font-mono text-[#94A3B8]">{xai.txnId}</span>{" "}
              flagged?
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-[11px] text-[#334155] hover:text-[#8B5CF6] transition-colors">
          Full XAI <ChevronRight size={11} />
        </button>
      </div>

      <div className="p-5">
        {/* ── Summary row ──────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 p-4 rounded-xl border
                     bg-[#F43F5E08] border-[#F43F5E22] mb-5"
        >
          <SeverityRing score={xai.score} size={52} strokeWidth={3} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert
                size={14}
                strokeWidth={1.5}
                className="text-[#F43F5E]"
              />
              <span className="text-sm font-bold text-[#F43F5E]">
                Likely Fraud
              </span>
              <span
                className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded
                                bg-[#F43F5E18] text-[#F43F5E] border border-[#F43F5E33]"
              >
                {xai.method}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {xai.topDrivers.map((d) => (
                <DriverChip key={d} label={d} />
              ))}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-[#475569] mb-0.5">Confidence</p>
            <p className="text-lg font-bold font-mono text-[#F43F5E]">
              {(xai.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </motion.div>

        {/* ── SHAP feature table ────────────────────────── */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mb-3">
            Feature Contributions (SHAP values)
          </p>
          <FeatureTable features={xai.features} maxAbs={maxAbs} />
        </div>

        {/* ── Metadata ──────────────────────────────────── */}
        <div className="mb-4 bg-[#080F1A] rounded-lg border border-[#0F172A] px-3 py-1">
          <ExplanationMetaRow label="Model version" value={xai.modelVer} mono />
          <ExplanationMetaRow label="Method" value={xai.method} />
          <ExplanationMetaRow label="Transaction ID" value={xai.txnId} mono />
        </div>

        {/* ── Recommendation ───────────────────────────── */}
        <RecommendationBox
          type="block"
          reason="High confidence fraud signal with velocity and geo-anomaly as primary drivers."
        />
      </div>
    </div>
  );
}
