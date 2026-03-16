import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, PanelRightOpen, PanelRightClose } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import AuditHeader from "./audit/AuditHeader";
import AuditControls from "./audit/AuditControls";
import AuditTable from "./audit/AuditTable";
import AuditDrawer from "./audit/AuditDrawer";
import {
  MOCK_LOGS,
  getAuditSummary,
  applyAuditFilters,
} from "./audit/auditData";

const DEFAULT_FILTERS = {
  search: "",
  actor: "ALL",
  category: "ALL",
  sort: "time_desc",
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 750);
    return () => clearTimeout(t);
  }, [refreshKey]);

  const filtered = useMemo(
    () => applyAuditFilters(logs, filters),
    [logs, filters],
  );
  const summary = useMemo(() => getAuditSummary(logs), [logs]);

  const handleSelect = useCallback((log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedLog(null), 280);
  }, []);

  const handleFilters = useCallback((f) => setFilters(f), []);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const handleExport = useCallback(() => {}, []);

  const handleRefresh = useCallback(() => {
    setSelectedLog(null);
    setDrawerOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  const hasFilters = useMemo(
    () =>
      filters.search || filters.actor !== "ALL" || filters.category !== "ALL",
    [filters],
  );

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <AuditHeader summary={summary} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50
                text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={() =>
                drawerOpen ? handleCloseDrawer() : setDrawerOpen(true)
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all
                ${
                  drawerOpen
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
            >
              {drawerOpen ? (
                <PanelRightClose size={12} />
              ) : (
                <PanelRightOpen size={12} />
              )}
              <span className="hidden sm:block">Detail</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <AuditControls
          filters={filters}
          onChange={handleFilters}
          onReset={handleReset}
          onExport={handleExport}
          resultCount={filtered.length}
          totalCount={logs.length}
        />

        {/* Table + drawer */}
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          <div
            className={`flex-1 min-w-0 overflow-auto transition-all duration-300 ${drawerOpen ? "hidden xl:block" : ""}`}
          >
            <AuditTable
              logs={filtered}
              selectedId={selectedLog?.id}
              onSelect={handleSelect}
              loading={loading}
              hasFilters={hasFilters}
            />
          </div>

          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                key="audit-drawer"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-shrink-0 overflow-hidden rounded-xl border border-slate-800"
                style={{ minWidth: drawerOpen ? 320 : 0 }}
              >
                <div className="w-[380px] h-full">
                  <AuditDrawer log={selectedLog} onClose={handleCloseDrawer} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AuditLogs;
