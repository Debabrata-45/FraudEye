/**
 * Drawer.jsx — FraudEye Overlay System
 *
 * Exports:
 *   SlideDrawer  — right-side slide-over panel (transaction detail, XAI, analyst actions)
 *   Modal        — centered dialog (confirmations, small forms)
 *   Overlay      — reusable backdrop
 *   DrawerHeader — header slot with title + close button
 *   DrawerBody   — scrollable body slot
 *   DrawerFooter — sticky footer slot for actions
 *
 * Usage:
 *   <SlideDrawer open={open} onClose={() => setOpen(false)} title="Transaction Detail">
 *     <DrawerBody>...</DrawerBody>
 *     <DrawerFooter>...</DrawerFooter>
 *   </SlideDrawer>
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

/* ── Overlay ─────────────────────────────────────────────── */
export function Overlay({ visible, onClick, blur = true }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className={cn(
            "fixed inset-0 z-40 bg-black/60",
            blur && "backdrop-blur-sm",
          )}
        />
      )}
    </AnimatePresence>
  );
}

/* ── DrawerHeader ────────────────────────────────────────── */
export function DrawerHeader({ title, subtitle, onClose, children }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#0F172A] flex-shrink-0">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#F8FAFC] leading-none truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-[#475569] mt-1">{subtitle}</p>
        )}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 rounded-lg text-[#475569]
                     hover:text-[#94A3B8] hover:bg-[#FFFFFF08]
                     transition-colors duration-150"
          aria-label="Close"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

/* ── DrawerBody ──────────────────────────────────────────── */
export function DrawerBody({ children, className = "" }) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-5 space-y-5", className)}>
      {children}
    </div>
  );
}

/* ── DrawerFooter ────────────────────────────────────────── */
export function DrawerFooter({ children, className = "" }) {
  return (
    <div
      className={cn(
        "flex-shrink-0 px-5 py-4 border-t border-[#0F172A]",
        "bg-[#080F1A]/60 backdrop-blur-sm",
        "flex items-center gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── SlideDrawer ─────────────────────────────────────────── */
export function SlideDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 480,
  side = "right",
}) {
  /* Close on Escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* Prevent body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const slideFrom = side === "right" ? { x: width } : { x: -width };

  return (
    <>
      <Overlay visible={open} onClick={onClose} />

      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            initial={{ ...slideFrom, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ ...slideFrom, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ width, maxWidth: "100vw" }}
            className={cn(
              "fixed inset-y-0 z-50 flex flex-col",
              "bg-[#0A1628] border-[#1E293B]",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
            )}
          >
            <DrawerHeader title={title} subtitle={subtitle} onClose={onClose} />
            {children}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Modal ───────────────────────────────────────────────── */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 480,
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Overlay visible={open} onClick={onClose} />

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ width, maxWidth: "100%" }}
              className="flex flex-col max-h-[90vh] rounded-2xl
                         bg-[#0A1628] border border-[#1E293B]
                         shadow-[0_24px_64px_#00000060]"
            >
              <DrawerHeader
                title={title}
                subtitle={subtitle}
                onClose={onClose}
              />
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
