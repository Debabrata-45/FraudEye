/**
 * Layout.jsx — FraudEye Main Dashboard Shell
 *
 * Renders: <Sidebar> + <Topbar> + <main content area>
 * Handles: sidebar collapsed state, mobile overlay, live clock
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/* ── Page title map ────────────────────────────────────────── */
const PAGE_META = {
  "/": { title: "Overview", sub: "System health at a glance" },
  "/live": { title: "Live Monitoring", sub: "Real-time transaction stream" },
  "/transactions": { title: "Transactions", sub: "Full transaction history" },
  "/alerts": { title: "Alerts", sub: "Active flags and incidents" },
  "/explanations": { title: "Explanations", sub: "SHAP · LIME · XAI insights" },
  "/analyst-review": {
    title: "Analyst Review",
    sub: "Pending decisions queue",
  },
  "/audit-logs": { title: "Audit Logs", sub: "Full system activity trail" },
  "/settings": { title: "Settings", sub: "System and account config" },
};

const SIDEBAR_W = 240; // px — expanded
const SIDEBAR_W_MINI = 64; // px — icon-only collapsed

export default function Layout({ children }) {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* Check viewport width */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => {
      setIsMobile(e.matches);
      if (e.matches) setCollapsed(false);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Close mobile drawer on route change.
     Intentional setState in effect: the drawer must close on every navigation.
     This does not cascade — location.pathname changes exactly once per nav. */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  }, [isMobile]);

  const meta = PAGE_META[location.pathname] ?? { title: "FraudEye", sub: "" };
  const sidebarWidth = isMobile ? 0 : collapsed ? SIDEBAR_W_MINI : SIDEBAR_W;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#020617]">
      {/* ── Sidebar (desktop) ──────────────────────────────── */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          onToggle={toggleSidebar}
          width={SIDEBAR_W}
          miniWidth={SIDEBAR_W_MINI}
        />
      )}

      {/* ── Mobile sidebar drawer ──────────────────────────── */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: -SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_W }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50"
              style={{ width: SIDEBAR_W }}
            >
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
                width={SIDEBAR_W}
                miniWidth={SIDEBAR_W_MINI}
                isMobileDrawer
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Right panel: topbar + content ─────────────────── */}
      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Topbar
          title={meta.title}
          sub={meta.sub}
          onMenuClick={toggleSidebar}
          collapsed={collapsed}
          isMobile={isMobile}
        />

        <main id="fe-main" className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
