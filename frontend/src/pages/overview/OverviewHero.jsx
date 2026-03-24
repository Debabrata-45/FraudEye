/**
 * OverviewHero.jsx — Overview page hero / header section
 */
import { motion } from "framer-motion";
import { ShieldAlert, Cpu, Database, Zap } from "lucide-react";
import { LiveDot } from "../../motion";
import { fadeUp, staggerNormal } from "../../motion";
import { cn } from "../../utils/cn";
import { HeroLine } from "../../components/polish";

function StatusPill({ icon: _Icon, label, status = "ok" }) {
  const styles = {
    ok: "text-[#22C55E] bg-[#22C55E0A] border-[#22C55E20]",
    warn: "text-[#F59E0B] bg-[#F59E0B0A] border-[#F59E0B20]",
    err: "text-[#F43F5E] bg-[#F43F5E0A] border-[#F43F5E20]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium",
        styles[status],
      )}
    >
      <_Icon size={11} strokeWidth={1.5} />
      {label}
    </span>
  );
}

export default function OverviewHero({ totalTransactions }) {
  // Use real count if provided, otherwise show loading placeholder
  const txnDisplay = totalTransactions
    ? totalTransactions.toLocaleString()
    : "—";

  return (
    <motion.div
      variants={staggerNormal}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      {/* Top row: tagline badge + system status */}
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between gap-4 mb-5 flex-wrap"
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                            bg-[#22D3EE0A] border border-[#22D3EE22] text-[11px]
                            font-semibold text-[#22D3EE] uppercase tracking-widest"
          >
            <ShieldAlert size={12} strokeWidth={1.5} />
            AI-Powered Fraud Intelligence
          </span>
          <LiveDot urgency="calm" size={8} />
          <span className="text-[11px] text-[#22C55E] font-medium">Live</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusPill icon={Cpu} label="ML Service" status="ok" />
          <StatusPill icon={Database} label="PostgreSQL" status="ok" />
          <StatusPill icon={Zap} label="Queue" status="ok" />
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.div variants={fadeUp} className="mb-3">
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC] leading-none mb-2">
          Fraud Intelligence{" "}
          <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
            Overview
          </span>
        </h1>
        <p className="text-sm text-[#475569] max-w-xl leading-relaxed">
          Real-time detection across all transaction streams. XGBoost model
          active with SHAP explainability. Monitoring{" "}
          <span className="text-[#22D3EE] font-medium">{txnDisplay}</span>{" "}
          transactions today.
        </p>
      </motion.div>

      <HeroLine color="cyan" delay={0.3} />
    </motion.div>
  );
}
