/**
 * useSpotlight.js — Mouse-tracking hook for fe-spotlight cards
 *
 * Sets CSS custom properties --mouse-x and --mouse-y on the element
 * so the ::before radial gradient follows the cursor precisely.
 *
 * Usage:
 *   const spotlightRef = useSpotlight();
 *   <div ref={spotlightRef} className="fe-spotlight bg-[#0D1627] ...">
 *
 * Apply ONLY to high-value surfaces:
 *   ✅ KPI / stat cards
 *   ✅ AI insight cards
 *   ✅ Major dashboard panels
 *   ❌ Tables, forms, nav items, small chips, buttons
 */

import { useRef, useCallback } from "react";

export function useSpotlight() {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Reset to off-screen so ::before fades out gracefully
    el.style.setProperty("--mouse-x", "-200px");
    el.style.setProperty("--mouse-y", "-200px");
  }, []);

  // Return a callback ref that attaches listeners
  const setRef = useCallback(
    (node) => {
      if (ref.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      ref.current = node;
      if (node) {
        node.addEventListener("mousemove", handleMouseMove, { passive: true });
        node.addEventListener("mouseleave", handleMouseLeave, {
          passive: true,
        });
      }
    },
    [handleMouseMove, handleMouseLeave],
  );

  return setRef;
}

/**
 * useSpotlightGroup — applies spotlight tracking to a container
 * so child cards all respond. Use when mapping over a card grid.
 *
 * Usage:
 *   const groupRef = useSpotlightGroup('.fe-spotlight');
 *   <div ref={groupRef} className="grid ...">
 *     {cards.map(c => <div className="fe-spotlight" ... />)}
 *   </div>
 */
export function useSpotlightGroup(childSelector = ".fe-spotlight") {
  const ref = useRef(null);

  const setRef = useCallback(
    (node) => {
      const handleMouseMove = (e) => {
        const cards = node?.querySelectorAll(childSelector);
        if (!cards) return;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        });
      };

      if (ref.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
      }
      ref.current = node;
      if (node) {
        node.addEventListener("mousemove", handleMouseMove, { passive: true });
      }
    },
    [childSelector],
  );

  return setRef;
}
