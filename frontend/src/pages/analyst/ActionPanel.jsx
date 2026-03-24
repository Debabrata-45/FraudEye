import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Check, X, Loader2 } from "lucide-react";
import { ACTIONS } from "./analystData";
import { formatTime } from "./analystData";

// ─── Confirmation modal ───────────────────────────────────────────────────────
const ConfirmModal = ({ action, onConfirm, onCancel, loading }) => {
  const cfg = ACTIONS[action];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
          <div>
            <p className="text-sm font-bold text-slate-100 mb-1">{cfg.label}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cfg.desc}</p>
          </div>
        </div>

        {cfg.destructive && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-4">
            <p className="text-xs text-rose-300">
              ⚠️ This action will update the case status and may trigger
              downstream workflows. Confirm carefully.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400
              hover:text-slate-200 hover:border-slate-600 disabled:opacity-40 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold
              disabled:opacity-60 transition-all ${cfg.confirmStyle}`}
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Check size={12} /> Confirm
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Success toast ────────────────────────────────────────────────────────────
const SuccessToast = ({ label }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -4 }}
    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
  >
    <Check size={13} />
    {label} — action recorded
  </motion.div>
);

// ─── Note item ────────────────────────────────────────────────────────────────
const NoteItem = ({ note }) => (
  <div className="px-3 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/30">
    <div className="flex items-center justify-between gap-2 mb-1">
      <span className="text-[11px] font-semibold text-violet-300">
        {note.author.split("@")[0]}
      </span>
      <span className="text-[10px] text-slate-600">
        {formatTime(note.timestamp)}
      </span>
    </div>
    <p className="text-xs text-slate-300 leading-relaxed">{note.text}</p>
  </div>
);

// ─── Main panel ───────────────────────────────────────────────────────────────
const ActionPanel = ({ item, onAction }) => {
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastSuccess, setLastSuccess] = useState(null);
  const [note, setNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const handleActionClick = useCallback((actionKey) => {
    setLastSuccess(null);
    setPendingAction(actionKey);
  }, []);

  const handleConfirm = useCallback(() => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setPendingAction(null);
      setLastSuccess(ACTIONS[pendingAction]?.label);
      if (onAction) onAction(pendingAction, item);
      setTimeout(() => setLastSuccess(null), 3000);
    }, 900);
  }, [pendingAction, item, onAction]);

  const handleCancel = useCallback(() => setPendingAction(null), []);

  const handleSaveNote = useCallback(() => {
    if (!note.trim()) return;
    setNoteSaving(true);
    setTimeout(() => {
      setNoteSaving(false);
      setNoteSaved(true);
      setNote("");
      setTimeout(() => setNoteSaved(false), 2500);
    }, 700);
  }, [note]);

  if (!item)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-xs text-slate-600">Select a case to take action</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Success feedback */}
      <AnimatePresence>
        {lastSuccess && <SuccessToast key="toast" label={lastSuccess} />}
      </AnimatePresence>

      {/* Action buttons */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2.5">
          Triage Actions
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(ACTIONS).map(([key, cfg]) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleActionClick(key)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold
                transition-all text-left ${cfg.style}`}
            >
              <span className="text-base leading-none">{cfg.icon}</span>
              {cfg.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Previous notes */}
      {(item.notes ?? item.feedbackNote ?? "").length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
            Previous Notes
          </p>
          <div className="space-y-2">
            {item.notes.map((n, i) => (
              <NoteItem key={i} note={n} />
            ))}
          </div>
        </div>
      )}

      {/* Add note */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Add Note
        </p>
        <div
          className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden
          focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/15 transition-all"
        >
          <div className="flex items-start gap-2 p-2.5">
            <MessageSquare
              size={13}
              className="text-slate-500 mt-0.5 flex-shrink-0"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add review notes or reasoning for this decision…"
              rows={3}
              className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600
                focus:outline-none resize-none leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-700/40">
            <span className="text-[10px] text-slate-600">
              {note.length}/500
            </span>
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {noteSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] text-emerald-400 flex items-center gap-1"
                  >
                    <Check size={10} /> Saved
                  </motion.span>
                )}
              </AnimatePresence>
              {note.trim() && (
                <button
                  onClick={() => setNote("")}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X size={11} />
                </button>
              )}
              <button
                onClick={handleSaveNote}
                disabled={!note.trim() || noteSaving}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25
                  text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 disabled:opacity-40
                  disabled:cursor-not-allowed transition-all"
              >
                {noteSaving ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Send size={11} />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {pendingAction && (
          <ConfirmModal
            key="confirm"
            action={pendingAction}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionPanel;
