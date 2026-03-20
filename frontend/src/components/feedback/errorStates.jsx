/**
 * errorStates.jsx — FraudEye Error & Degraded-State System
 *
 * Error messaging hierarchy:
 *   1. Short user-facing title   (always visible)
 *   2. Clear explanation         (always visible)
 *   3. Retry button              (when retryable)
 *   4. Supporting note           (optional)
 *   5. Technical detail          (collapsed, opt-in only)
 *
 * Imports: import { PageError, SectionError, StreamError, ... } from '../components/feedback'
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  WifiOff,
  RefreshCw,
  ChevronDown,
  ShieldAlert,
  ServerCrash,
  Unplug,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../utils/cn";

/* ════════════════════════════════════════════════════════════
   BASE ERROR STATE
   ════════════════════════════════════════════════════════════ */
export function ErrorState({
  icon: _Icon = AlertTriangle,
  iconColor = "#F43F5E",
  title = "Something went wrong",
  message,
  note,
  technical,
  onRetry,
  retryLabel = "Try again",
  compact = false,
  className = "",
}) {
  const [showTech, setShowTech] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "py-10 px-4" : "py-16 px-6",
        className,
      )}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center border mb-4"
        style={{ background: `${iconColor}0A`, borderColor: `${iconColor}22` }}
      >
        <_Icon size={22} strokeWidth={1.5} style={{ color: iconColor }} />
      </div>

      {/* Title */}
      <p className="text-sm font-semibold mb-1" style={{ color: iconColor }}>
        {title}
      </p>

      {/* Message */}
      {message && (
        <p className="text-xs text-[#475569] max-w-sm leading-relaxed mb-3">
          {message}
        </p>
      )}

      {/* Retry */}
      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                      text-xs font-medium transition-colors duration-150 mb-3
                      text-[#F43F5E] border-[#F43F5E33] bg-[#F43F5E0A]
                      hover:bg-[#F43F5E14]"
        >
          <RefreshCw size={11} strokeWidth={1.5} />
          {retryLabel}
        </motion.button>
      )}

      {/* Supporting note */}
      {note && (
        <p className="text-[11px] text-[#334155] max-w-xs leading-relaxed">
          {note}
        </p>
      )}

      {/* Technical detail (collapsed) */}
      {technical && (
        <div className="mt-3 w-full max-w-sm">
          <button
            onClick={() => setShowTech((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-[#334155] hover:text-[#475569] transition-colors mx-auto"
          >
            <ChevronDown
              size={10}
              className={cn(
                "transition-transform duration-150",
                showTech && "rotate-180",
              )}
            />
            {showTech ? "Hide" : "Show"} technical details
          </button>
          <AnimatePresence>
            {showTech && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-3 rounded-lg bg-[#080F1A] border border-[#0F172A] text-left">
                  <p className="text-[10px] font-mono text-[#475569] break-all leading-relaxed">
                    {technical}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE-LEVEL ERRORS
   ════════════════════════════════════════════════════════════ */

export function PageError({ onRetry, message, technical }) {
  return (
    <div className="w-full px-5 md:px-6 lg:px-8 pt-6 pb-12 max-w-[1600px] mx-auto">
      <ErrorState
        icon={ServerCrash}
        iconColor="#F43F5E"
        title="Failed to load page"
        message={
          message ??
          "We could not load the data for this page. This is usually a temporary issue."
        }
        note="If this keeps happening, check your connection or contact support."
        technical={technical}
        onRetry={onRetry}
        retryLabel="Reload page"
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SECTION-LEVEL ERRORS
   ════════════════════════════════════════════════════════════ */

export function SectionError({ title, message, onRetry, compact = true }) {
  return (
    <ErrorState
      icon={AlertCircle}
      iconColor="#F43F5E"
      title={title ?? "Failed to load section"}
      message={
        message ??
        "This section could not be loaded. The rest of the page is unaffected."
      }
      onRetry={onRetry}
      retryLabel="Retry"
      compact={compact}
    />
  );
}

/* ── Inline section error (inside a panel card) ── */
export function InlineSectionError({ message, onRetry, className = "" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-lg",
        "bg-[#F43F5E08] border border-[#F43F5E22]",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle
          size={13}
          className="text-[#F43F5E] flex-shrink-0"
          strokeWidth={1.5}
        />
        <p className="text-xs text-[#F43F5E] truncate">
          {message ?? "Failed to load this section"}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#F43F5E]
                      hover:text-[#F43F5Ecc] transition-colors"
        >
          <RefreshCw size={10} strokeWidth={1.5} />
          Retry
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STREAM / REAL-TIME ERRORS
   ════════════════════════════════════════════════════════════ */

/* ── SSE Disconnected banner ── */
export function StreamDisconnected({ onRetry, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg mb-4",
        "bg-[#F59E0B0A] border border-[#F59E0B33]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] flex-shrink-0"
        />
        <WifiOff
          size={12}
          className="text-[#F59E0B] flex-shrink-0"
          strokeWidth={1.5}
        />
        <span className="text-xs text-[#F59E0B] font-medium">
          Live stream disconnected — attempting to reconnect
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#F59E0B]
                      hover:text-[#F59E0Bcc] transition-colors"
        >
          <RefreshCw size={10} strokeWidth={1.5} />
          Reconnect
        </button>
      )}
    </motion.div>
  );
}

/* ── Reconnecting state ── */
export function StreamReconnecting({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg mb-4",
        "bg-[#22D3EE08] border border-[#22D3EE22]",
        className,
      )}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw size={12} className="text-[#22D3EE]" strokeWidth={1.5} />
      </motion.div>
      <span className="text-xs text-[#22D3EE] font-medium">
        Reconnecting to live stream…
      </span>
    </motion.div>
  );
}

/* ── Stale data warning ── */
export function StaleDataWarning({ lastUpdate, className = "" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md",
        "bg-[#F59E0B0A] border border-[#F59E0B22] text-[11px] text-[#F59E0B]",
        className,
      )}
    >
      <Clock size={10} strokeWidth={1.5} />
      Data may be stale{lastUpdate ? ` · Last update: ${lastUpdate}` : ""}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PARTIAL DATA / DEGRADED STATES
   ════════════════════════════════════════════════════════════ */

export function PartialDataBanner({ message, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg mb-4",
        "bg-[#F59E0B08] border border-[#F59E0B22]",
        className,
      )}
    >
      <AlertTriangle
        size={12}
        className="text-[#F59E0B] flex-shrink-0"
        strokeWidth={1.5}
      />
      <p className="text-xs text-[#F59E0B]">
        {message ??
          "Some data could not be loaded. Displaying partial results."}
      </p>
    </motion.div>
  );
}

/* ── Unavailable panel (for a section that failed in a split layout) ── */
export function UnavailablePanel({
  title = "Unavailable",
  message,
  onRetry,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full rounded-xl border border-[#1E293B]",
        "bg-[#080F1A] text-center px-6 py-12",
        className,
      )}
    >
      <div
        className="w-10 h-10 rounded-xl bg-[#F43F5E08] border border-[#F43F5E20]
                        flex items-center justify-center mb-4"
      >
        <Unplug size={18} strokeWidth={1} className="text-[#F43F5E66]" />
      </div>
      <p className="text-xs font-semibold text-[#475569] mb-1">{title}</p>
      {message && (
        <p className="text-[11px] text-[#334155] leading-relaxed mb-3 max-w-[200px]">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[11px] text-[#22D3EE] hover:text-[#22D3EEcc] transition-colors
                      flex items-center gap-1"
        >
          <RefreshCw size={10} strokeWidth={1.5} />
          Try again
        </button>
      )}
    </div>
  );
}

/* ── Non-retryable error (terminal) ── */
export function TerminalError({ title, message }) {
  return (
    <ErrorState
      icon={ShieldAlert}
      iconColor="#F43F5E"
      title={title ?? "Unable to continue"}
      message={
        message ??
        "This operation cannot be completed. Please refresh the page or contact support."
      }
      note="Error ID has been logged automatically."
    />
  );
}
