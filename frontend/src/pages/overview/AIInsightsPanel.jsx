/**
 * AIInsightsPanel.jsx — AI Insights preview section
 * Shows recent model-generated intelligence cards with accent colors
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";
import { EASING } from "../../motion";
import { cn } from "../../utils/cn";
import { MOCK_AI_INSIGHTS } from "./overviewData";

/* ── Accent styles ───────────────────────────────────────── */
const ACCENT = {
  danger: {
    text: "#F43F5E",
    bg: "bg-[#F43F5E0A]",
    border: "border-[#F43F5E22]",
    Icon: ShieldAlert,
  },
  warning: {
    text: "#F59E0B",
    bg: "bg-[#F59E0B0A]",
    border: "border-[#F59E0B22]",
    Icon: AlertTriangle,
  },
  ai: {
    text: "#8B5CF6",
    bg: "bg-[#8B5CF60A]",
    border: "border-[#8B5CF622]",
    Icon: BrainCircuit,
  },
  trend: {
    text: "#22D3EE",
    bg: "bg-[#22D3EE0A]",
    border: "border-[#22D3EE22]",
    Icon: TrendingUp,
  },
};

/* ── Single insight card ─────────────────────────────────── */
function InsightCard({ insight, index }) {
  const a = ACCENT[insight.accent] ?? ACCENT.ai;
  const Icon = a.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 + index * 0.07,
        duration: 0.28,
        ease: EASING.out,
      }}
      whileHover={{ y: -1, transition: { duration: 0.12 } }}
      className={cn(
        "flex gap-3 p-4 rounded-xl border cursor-default",
        "transition-shadow duration-200",
        a.bg,
        a.border,
        "hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        <span
          className="flex w-8 h-8 rounded-lg items-center justify-center border"
          style={{ background: `${a.text}14`, borderColor: `${a.text}28` }}
        >
          <Icon size={15} strokeWidth={1.5} style={{ color: a.text }} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs font-semibold text-[#F8FAFC] leading-snug">
            {insight.title}
          </p>
          <span
            className="flex-shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border"
            style={{
              color: a.text,
              background: `${a.text}10`,
              borderColor: `${a.text}25`,
            }}
          >
            {insight.tag}
          </span>
        </div>
        <p className="text-[11px] text-[#475569] leading-relaxed mb-2 line-clamp-2">
          {insight.body}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono" style={{ color: a.text }}>
            Confidence: {(insight.confidence * 100).toFixed(0)}%
          </span>
          <span className="text-[10px] text-[#334155]">{insight.ts}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Panel ───────────────────────────────────────────────── */
export default function AIInsightsPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#8B5CF614] border border-[#8B5CF622]">
            <BrainCircuit
              size={14}
              strokeWidth={1.5}
              className="text-[#8B5CF6]"
            />
          </span>
          <h3 className="fe-section-heading">AI Insights</h3>
        </div>
        <button className="flex items-center gap-1 text-[11px] text-[#334155] hover:text-[#22D3EE] transition-colors">
          View all <ChevronRight size={11} />
        </button>
      </div>

      {/* Insight cards */}
      <div className="space-y-3 flex-1">
        <AnimatePresence initial={false}>
          {MOCK_AI_INSIGHTS.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer stat */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 pt-3 border-t border-[#0F172A] flex items-center justify-between"
      >
        <span className="text-[10px] text-[#334155]">
          Powered by XGBoost v1 + SHAP
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#22C55E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          Model active
        </span>
      </motion.div>
    </div>
  );
}
