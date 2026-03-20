/**
 * useKeyboardDismiss.js — Keyboard Escape dismiss hook
 *
 * Place at: frontend/src/hooks/useKeyboardDismiss.js
 *
 * Use in every drawer and modal to support keyboard navigation.
 * Apply to: TransactionDrawer, AlertDrawer, AuditDrawer,
 *           SpotlightPanel, ConfirmModal, and any onClose component.
 */

import { useEffect } from 'react';

/**
 * Calls onClose when the user presses Escape.
 *
 * @param {Function} onClose - function to call on Escape
 * @param {boolean}  enabled - only listen when true (default: true)
 *
 * Usage:
 *   useKeyboardDismiss(onClose);           // always active
 *   useKeyboardDismiss(onClose, isOpen);   // only when drawer is open
 */
export function useKeyboardDismiss(onClose, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof onClose !== 'function') return;

    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, enabled]);
}