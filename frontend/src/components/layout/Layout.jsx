/**
 * Layout.jsx — FraudEye Main Dashboard Shell
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSidebarBehavior, useMobileMenu } from "../Responsive";

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

const SIDEBAR_W = 240;
const SIDEBAR_W_MINI = 64;

export default function Layout({ children }) {
  const location = useLocation();

  const { defaultCollapsed } = useSidebarBehavior();
  const {
    isOpen: mobileOpen,
    toggle: toggleMobile,
    close: closeMobile,
  } = useMobileMenu();

  const [collapsed, setCollapsed] = useState(defaultCollapsed);
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

  /* Sync collapsed with defaultCollapsed on first meaningful resize */
  useEffect(() => {
    if (!isMobile) setCollapsed(defaultCollapsed);
  }, [defaultCollapsed, isMobile]);

  /* Close mobile drawer on route change */
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) toggleMobile();
    else setCollapsed((v) => !v);
  }, [isMobile, toggleMobile]);

  const meta = PAGE_META[location.pathname] ?? { title: "FraudEye", sub: "" };
  const sidebarWidth = isMobile ? 0 : collapsed ? SIDEBAR_W_MINI : SIDEBAR_W;

  return (
    <div className="relative flex h-screen w-full bg-[#020617]">
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
              onClick={closeMobile}
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
                onToggle={closeMobile}
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

        <main id="fe-main" className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
