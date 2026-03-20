/**
 * feedbackToast.jsx — FraudEye Success, Failure & Action Feedback
 *
 * Three layers of feedback:
 *   1. Toast / snackbar — floating, auto-dismiss (global)
 *   2. Inline success   — inside a card/panel (contextual)
 *   3. Action feedback  — button-level status
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast({ type: 'success', message: 'Settings saved' });
 *
 *   <ToastContainer />   ← place once in App.jsx or Layout.jsx
 *
 * Inline:
 *   <InlineSuccess message="Decision submitted" />
 *   <InlineFailure message="Failed to save" onRetry={fn} />
 *   <ActionFeedback status="success" message="Saved" />
 */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, Info, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";
import { ToastContext } from "./toastContext";

let _toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    ({
      type = "success", // 'success' | 'error' | 'warning' | 'info'
      message,
      duration = 3500,
      action, // optional { label, onClick }
    }) => {
      const id = ++_toastId;
      setToasts((prev) => [...prev.slice(-4), { id, type, message, action }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/* ════════════════════════════════════════════════════════════
   TOAST CONTAINER + ITEM
   ════════════════════════════════════════════════════════════ */
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: "#22C55E",
    bg: "bg-[#22C55E0A]",
    border: "border-[#22C55E33]",
  },
  error: {
    icon: AlertTriangle,
    color: "#F43F5E",
    bg: "bg-[#F43F5E0A]",
    border: "border-[#F43F5E33]",
  },
  warning: {
    icon: AlertTriangle,
    color: "#F59E0B",
    bg: "bg-[#F59E0B0A]",
    border: "border-[#F59E0B33]",
  },
  info: {
    icon: Info,
    color: "#22D3EE",
    bg: "bg-[#22D3EE0A]",
    border: "border-[#22D3EE33]",
  },
};

function ToastItem({ toast, onDismiss }) {
  const cfg = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[260px] max-w-[380px]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        "bg-[#0A1628]",
        cfg.border,
      )}
    >
      <Icon
        size={15}
        strokeWidth={1.5}
        style={{ color: cfg.color }}
        className="flex-shrink-0"
      />

      <p className="flex-1 text-xs font-medium text-[#CBD5E1] leading-snug">
        {toast.message}
      </p>

      {toast.action && (
        <button
          onClick={() => {
            toast.action.onClick();
            onDismiss(toast.id);
          }}
          className="text-[11px] font-semibold flex-shrink-0 transition-colors"
          style={{ color: cfg.color }}
        >
          {toast.action.label}
        </button>
      )}

      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-0.5 rounded text-[#334155] hover:text-[#64748B] transition-colors"
      >
        <X size={12} strokeWidth={1.5} />
      </button>
    </motion.div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   INLINE SUCCESS / FAILURE
   ════════════════════════════════════════════════════════════ */

export function InlineSuccess({ message, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        "bg-[#22C55E0A] border-[#22C55E33]",
        className,
      )}
    >
      <CheckCircle2
        size={13}
        className="text-[#22C55E] flex-shrink-0"
        strokeWidth={1.5}
      />
      <p className="text-xs text-[#22C55E] font-medium">{message}</p>
    </motion.div>
  );
}

export function InlineFailure({ message, onRetry, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-2 rounded-lg border",
        "bg-[#F43F5E0A] border-[#F43F5E33]",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle
          size={13}
          className="text-[#F43F5E] flex-shrink-0"
          strokeWidth={1.5}
        />
        <p className="text-xs text-[#F43F5E] truncate">{message}</p>
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
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   ACTION FEEDBACK — button-level status indicator
   status: 'idle' | 'loading' | 'success' | 'error'
   ════════════════════════════════════════════════════════════ */
export function ActionFeedback({ status, message, className = "" }) {
  if (status === "idle" || !status) return null;

  const configs = {
    loading: { color: "#22D3EE", icon: null, text: message ?? "Processing…" },
    success: { color: "#22C55E", icon: CheckCircle2, text: message ?? "Done" },
    error: { color: "#F43F5E", icon: AlertTriangle, text: message ?? "Failed" },
  };

  const cfg = configs[status];
  const Icon = cfg?.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          className,
        )}
        style={{ color: cfg?.color }}
      >
        {status === "loading" ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <RefreshCw size={11} strokeWidth={1.5} />
          </motion.span>
        ) : Icon ? (
          <Icon size={11} strokeWidth={1.5} />
        ) : null}
        {cfg?.text}
      </motion.span>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════
   SAVE BAR — sticky bottom bar for settings / forms
   ════════════════════════════════════════════════════════════ */
export function SaveBar({ isDirty, saveStatus, onSave, onDiscard }) {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 64, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between
                      gap-4 px-6 py-3 border-t border-[#1E293B]
                      bg-[#0A1628]/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-xs text-[#64748B]">
              You have unsaved changes
            </span>
            <ActionFeedback status={saveStatus} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDiscard}
              disabled={saveStatus === "loading"}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#475569]
                          border border-[#1E293B] hover:border-[#334155] hover:text-[#94A3B8]
                          transition-colors disabled:opacity-40"
            >
              Discard
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onSave}
              disabled={saveStatus === "loading"}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold
                          bg-[#22D3EE14] text-[#22D3EE] border border-[#22D3EE33]
                          hover:bg-[#22D3EE22] transition-colors disabled:opacity-40"
            >
              {saveStatus === "loading" ? "Saving…" : "Save changes"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════
   CONFIRM MODAL — for destructive / irreversible actions
   ════════════════════════════════════════════════════════════ */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  const variantStyles = {
    danger:
      "bg-[#F43F5E14] text-[#F43F5E] border-[#F43F5E33] hover:bg-[#F43F5E22]",
    warning:
      "bg-[#F59E0B14] text-[#F59E0B] border-[#F59E0B33] hover:bg-[#F59E0B22]",
    success:
      "bg-[#22C55E14] text-[#22C55E] border-[#22C55E33] hover:bg-[#22C55E22]",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0A1628] border border-[#1E293B] rounded-2xl
                          shadow-[0_24px_64px_#00000060] w-full max-w-sm p-6"
            >
              <h3 className="text-sm font-semibold text-[#F8FAFC] mb-2">
                {title}
              </h3>
              {message && (
                <p className="text-xs text-[#475569] leading-relaxed mb-5">
                  {message}
                </p>
              )}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#475569]
                              border border-[#1E293B] hover:border-[#334155] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                    variantStyles[confirmVariant] ?? variantStyles.danger,
                  )}
                >
                  {confirmLabel ?? "Confirm"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
