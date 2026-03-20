/**
 * LiveMonitoring.jsx — Real SSE-powered live monitoring
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "../components/layout/PageShell";
import { ErrorState } from "../components/ui/States";
import { fadeUp, staggerNormal } from "../motion";
import { useSSE } from "../hooks/useSSE";

import LiveHeader from "./live/LiveHeader";
import ThreatFeed from "./live/ThreatFeed";
import SpotlightPanel from "./live/SpotlightPanel";
import ActivityTimeline from "./live/ActivityTimeline";

/* ── Loading skeleton ────────────────────────────────────── */
function LiveSkeleton() {
  return (
    <PageWrapper>
      <div className="mb-6 space-y-3">
        <div className="fe-shimmer h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="fe-shimmer h-16 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div
          className="lg:col-span-2 fe-shimmer rounded-xl"
          style={{ height: 520 }}
        />
        <div className="fe-shimmer rounded-xl" style={{ height: 520 }} />
      </div>
      <div className="fe-shimmer h-48 rounded-xl" />
    </PageWrapper>
  );
}

/* ── Disconnect banner ───────────────────────────────────── */
function DisconnectBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 px-4 py-2.5 rounded-lg bg-[#F59E0B0A] border border-[#F59E0B33]
                  flex items-center gap-2 text-xs text-[#F59E0B]"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
      Stream temporarily disconnected — attempting to reconnect…
    </motion.div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function LiveMonitoring() {
  const { events, newIds, connected, paused, togglePause, stats } = useSSE(100);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error] = useState(null);

  const handleSelect = (event) => {
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
  };

  if (error) {
    return (
      <PageWrapper>
        <ErrorState title="Failed to connect to live stream" message={error} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <AnimatePresence mode="wait">
        <motion.div
          key="live-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <LiveHeader
            connected={connected}
            paused={paused}
            onTogglePause={togglePause}
            stats={stats}
          />

          {/* Disconnect banner */}
          {!connected && <DisconnectBanner />}

          {/* Main layout */}
          <motion.div
            variants={staggerNormal}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
            style={{ minHeight: 520 }}
          >
            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 min-h-0"
              style={{ height: 560 }}
            >
              <ThreatFeed
                events={events}
                newIds={newIds}
                selectedId={selectedEvent?.id}
                onSelect={handleSelect}
              />
            </motion.div>

            <motion.div variants={fadeUp} style={{ height: 560 }}>
              <SpotlightPanel
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
              />
            </motion.div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
          >
            <ActivityTimeline />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between py-4 mt-2 border-t border-[#0F172A]"
          >
            <span className="text-[10px] font-mono text-[#1E293B] uppercase tracking-widest">
              SSE · /api/stream/transactions · XGBoost v1
            </span>
            <span className="text-[10px] text-[#1E293B]">
              Showing {events.length} events · Auto-refreshes on new activity
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
}
