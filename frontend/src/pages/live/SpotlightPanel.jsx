/**
 * SpotlightPanel.jsx — Selected event focus panel
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  Eye,
  Flag,
  User,
  CreditCard,
  Smartphone,
  Store,
  BrainCircuit,
  ChevronRight,
  X,
} from "lucide-react";
import { SeverityRing } from "../../components/ui/Badge";
import { RiskBar } from "../../components/ui/Badge";
import { cn } from "../../utils/cn";
import { REASON_META } from "./liveData";
import { EASING } from "../../motion";
import { ElitePanel } from "../../components/polish";
import { MetaRow } from "../../components/Responsive";

/* ── Quick action button ─────────────────────────────────── */
function ActionBtn({ icon: _Icon, label, variant = "ghost" }) {
  const styles = {
    danger:
      "bg-[#F43F5E14] text-[#F43F5E] border-[#F43F5E33] hover:bg-[#F43F5E22]",
    warning:
      "bg-[#F59E0B14] text-[#F59E0B] border-[#F59E0B33] hover:bg-[#F59E0B22]",
    ghost:
      "bg-[#FFFFFF06] text-[#64748B] border-[#1E293B] hover:text-[#94A3B8]",
    ai: "bg-[#8B5CF614] text-[#8B5CF6] border-[#8B5CF633] hover:bg-[#8B5CF622]",
  };
  return (
    <button
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border",
        "text-[10px] font-semibold uppercase tracking-wide transition-colors duration-150",
        styles[variant],
      )}
    >
      <_Icon size={11} strokeWidth={1.5} />
      {label}
    </button>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptySpotlight() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-2xl bg-[#22D3EE08] border border-[#22D3EE18] flex items-center justify-center"
      >
        <Eye size={20} strokeWidth={1} className="text-[#22D3EE44]" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-[#334155]">
          No event selected
        </p>
        <p className="text-[11px] text-[#1E293B] mt-1">
          Click any row in the threat feed to investigate
        </p>
      </div>
    </div>
  );
}

/* ── Spotlight panel ─────────────────────────────────────── */
export default function SpotlightPanel({ event, onClose }) {
  const isCritical = event?.severity === "critical";
  const isHigh = event?.severity === "high";
  const accent =
    isCritical || isHigh
      ? "#F43F5E"
      : event?.severity === "medium"
        ? "#F59E0B"
        : "#475569";

  const shapFeatures =
    event?.reasons?.map((r, i) => ({
      name: REASON_META[r]?.label ?? r,
      value: +(0.15 + (event.risk - 0.1) * (1 - i * 0.25)).toFixed(3),
      color: REASON_META[r]?.color ?? "#475569",
    })) ?? [];

  return (
    <ElitePanel className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0F172A] bg-[#0A1220] flex-shrink-0">
        <div className="flex items-center gap-2">
          <BrainCircuit
            size={13}
            strokeWidth={1.5}
            className="text-[#8B5CF6]"
          />
          <span className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
            Event Spotlight
          </span>
        </div>
        {event && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#334155] hover:text-[#64748B] transition-colors"
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!event ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptySpotlight />
            </motion.div>
          ) : (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASING.out }}
              className="p-4 space-y-4"
            >
              {/* Risk summary */}
              <div
                className="flex items-center gap-4 p-3.5 rounded-xl border"
                style={{
                  background: `${accent}08`,
                  borderColor: `${accent}25`,
                }}
              >
                <SeverityRing score={event.risk} size={52} strokeWidth={3} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isCritical || isHigh ? (
                      <ShieldAlert
                        size={13}
                        style={{ color: accent }}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <AlertTriangle
                        size={13}
                        style={{ color: accent }}
                        strokeWidth={1.5}
                      />
                    )}
                    <span
                      className="text-xs font-bold"
                      style={{ color: accent }}
                    >
                      {isCritical
                        ? "Likely Fraud — Block"
                        : isHigh
                          ? "High Risk — Review"
                          : "Medium Risk — Monitor"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-snug truncate">
                    {event.title}
                  </p>
                  <p
                    className="text-[10px] font-mono mt-1"
                    style={{ color: accent }}
                  >
                    Risk: {(event.risk * 100).toFixed(1)}% confidence
                  </p>
                </div>
              </div>

              {/* Transaction context — MetaRow from responsive */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mb-2">
                  Transaction Context
                </p>
                <div className="bg-[#0A1628] rounded-lg border border-[#0F172A] px-3 py-0.5">
                  <MetaRow
                    label={
                      <span className="flex items-center gap-1.5">
                        <Store size={10} className="text-[#334155]" />
                        Merchant
                      </span>
                    }
                    value={event.merchant}
                  />
                  <MetaRow
                    label={
                      <span className="flex items-center gap-1.5">
                        <CreditCard size={10} className="text-[#334155]" />
                        Amount
                      </span>
                    }
                    value={`$${event.amount.toLocaleString()}`}
                    mono
                  />
                  <MetaRow
                    label={
                      <span className="flex items-center gap-1.5">
                        <CreditCard size={10} className="text-[#334155]" />
                        Card
                      </span>
                    }
                    value={`···· ${event.card}`}
                    mono
                  />
                  <MetaRow
                    label={
                      <span className="flex items-center gap-1.5">
                        <Smartphone size={10} className="text-[#334155]" />
                        Device
                      </span>
                    }
                    value={event.device}
                    mono
                  />
                  <MetaRow
                    label={
                      <span className="flex items-center gap-1.5">
                        <User size={10} className="text-[#334155]" />
                        User ID
                      </span>
                    }
                    value={event.userId}
                    mono
                  />
                </div>
              </div>

              {/* SHAP drivers */}
              {shapFeatures.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mb-2">
                    Top Fraud Drivers
                  </p>
                  <div className="space-y-2">
                    {shapFeatures.map((f, i) => (
                      <motion.div
                        key={f.name}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-[10px] text-[#475569] w-24 flex-shrink-0 truncate">
                          {f.name}
                        </span>
                        <RiskBar
                          score={Math.min(f.value / 0.5, 1)}
                          showValue={false}
                          height={4}
                          className="flex-1"
                          animate
                        />
                        <span
                          className="text-[10px] font-mono font-bold w-10 text-right flex-shrink-0"
                          style={{ color: f.color }}
                        >
                          +{f.value.toFixed(3)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#334155] mb-2">
                  Quick Actions
                </p>
                <div className="flex gap-2">
                  <ActionBtn
                    icon={ShieldAlert}
                    label="Block"
                    variant="danger"
                  />
                  <ActionBtn icon={Flag} label="Flag" variant="warning" />
                  <ActionBtn
                    icon={BrainCircuit}
                    label="Full XAI"
                    variant="ai"
                  />
                </div>
                <button
                  className="w-full mt-2 flex items-center justify-center gap-1.5
                  text-[10px] text-[#334155] hover:text-[#64748B] transition-colors py-1.5"
                >
                  Open full investigation
                  <ChevronRight size={10} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ElitePanel>
  );
}
