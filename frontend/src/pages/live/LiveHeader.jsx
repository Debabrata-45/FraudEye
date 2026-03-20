/**
 * LiveHeader.jsx — Live Monitoring command-center header
 * Includes: monitoring status, live indicators, stream health, pause/resume
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Pause, Play } from "lucide-react";
import { LiveDot } from "../../motion";
import { fadeUp } from "../../motion";
import { cn } from "../../utils/cn";
import { LiveBadge } from "../../components/polish";

/* ── Live clock ──────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(17, 25) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] text-[#475569] tabular-nums tracking-wide">
      {time}
    </span>
  );
}

/* ── Header ──────────────────────────────────────────────── */
export default function LiveHeader({
  connected,
  paused,
  onTogglePause,
  stats,
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        {/* Left: title */}
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="p-2 rounded-xl bg-[#F43F5E14] border border-[#F43F5E33]">
              <Radio size={16} strokeWidth={1.5} className="text-[#F43F5E]" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-[#F8FAFC] leading-none tracking-tight">
                Live{" "}
                <span className="bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] bg-clip-text text-transparent">
                  Monitoring
                </span>
              </h1>
              <p className="text-[11px] text-[#475569] mt-0.5">
                Real-time fraud surveillance — streaming AI inference results
              </p>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <LiveBadge
            variant={
              connected ? (paused ? "paused" : "active") : "disconnected"
            }
          />
          <LiveClock />
          <button
            onClick={onTogglePause}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
              "text-[11px] font-medium transition-all duration-150",
              paused
                ? "bg-[#22D3EE14] text-[#22D3EE] border-[#22D3EE33] hover:bg-[#22D3EE22]"
                : "bg-[#33415514] text-[#64748B] border-[#33415533] hover:text-[#94A3B8]",
            )}
          >
            {paused ? (
              <>
                <Play size={11} strokeWidth={1.5} /> Resume
              </>
            ) : (
              <>
                <Pause size={11} strokeWidth={1.5} /> Pause
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Critical",
            value: stats.critical,
            color: "#F43F5E",
            pulse: stats.critical > 0,
          },
          {
            label: "High Risk",
            value: stats.high,
            color: "#F59E0B",
            pulse: false,
          },
          {
            label: "Under Review",
            value: stats.medium,
            color: "#F59E0B",
            pulse: false,
          },
          {
            label: "Total Events",
            value: stats.total,
            color: "#22D3EE",
            pulse: false,
          },
        ].map(({ label, value, color, pulse }) => (
          <div
            key={label}
            className="bg-[#0D1627] border border-[#1E293B] rounded-lg px-4 py-3 flex items-center gap-3"
          >
            {pulse && value > 0 && (
              <LiveDot urgency="urgent" size={8} className="flex-shrink-0" />
            )}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#334155] font-medium leading-none mb-1">
                {label}
              </p>
              <motion.p
                key={value}
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold font-mono leading-none"
                style={{ color }}
              >
                {value}
              </motion.p>
            </div>
          </div>
        ))}
      </div>

      {/* Scan line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0, 0, 0.2, 1], delay: 0.2 }}
        style={{ originX: 0 }}
        className="h-px mt-5 bg-gradient-to-r from-[#F43F5E55] via-[#F59E0B33] to-transparent"
      />
    </motion.div>
  );
}
