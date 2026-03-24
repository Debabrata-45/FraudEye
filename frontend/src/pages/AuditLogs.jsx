/**
 * AuditLogs.jsx — wired to real /api/audit-logs
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Download, Database, Wifi } from "lucide-react";
import { PageWrapper } from "../components/layout/PageShell";
import AuditHeader from "./audit/AuditHeader";
import AuditControls from "./audit/AuditControls";
import AuditTable from "./audit/AuditTable";
import AuditDrawer from "./audit/AuditDrawer";
import { AuditLogsFallbacks } from "../components/feedback";
import { useAuditData } from "./audit/useAuditData";
import { useToast } from "../components/feedback";
import { cn } from "../utils/cn";

export default function AuditLogs() {
  const { showToast } = useToast();
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    logs,
    loading,
    error,
    filters,
    total,
    summary,
    mode,
    handleFilters,
    handleReset,
    toggleMode,
    refresh,
  } = useAuditData();

  const handleSelectRow = useCallback((log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  }, []);

  const handleExport = useCallback(() => {
    showToast({
      type: "info",
      message: "Export started — file will download shortly",
      duration: 4000,
    });
  }, [showToast]);

  const hasFilters = filters.search || filters.actor || filters.category;

  if (loading) return <AuditLogsFallbacks.Loading />;
  if (error) return <AuditLogsFallbacks.Error onRetry={refresh} />;

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
          <div className="flex-1 min-w-0">
            <AuditHeader summary={summary} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={toggleMode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all",
                mode === "live"
                  ? "bg-[#22D3EE0A] border-[#22D3EE33] text-[#22D3EE]"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200",
              )}
            >
              {mode === "live" ? <Wifi size={12} /> : <Database size={12} />}
              {mode === "live" ? "Live" : "Demo"}
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400
                hover:text-slate-200 hover:border-slate-600
                disabled:opacity-40 transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400
                hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              <Download size={12} />
              Export
            </button>
          </div>
        </div>

        {/* Controls */}
        <AuditControls
          filters={filters}
          onChange={handleFilters}
          onReset={handleReset}
          resultCount={logs.length}
          totalCount={total}
          onExport={handleExport}
        />

        {/* Main split: table + drawer */}
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          {/* Table */}
          <div
            className={cn(
              "flex-1 min-w-0 overflow-auto transition-all duration-300",
              drawerOpen && "hidden xl:block",
            )}
          >
            {logs.length === 0 ? (
              hasFilters ? (
                <AuditLogsFallbacks.NoResults
                  query={filters.search}
                  onReset={handleReset}
                />
              ) : (
                <AuditLogsFallbacks.Empty onReset={handleReset} />
              )
            ) : (
              <AuditTable
                logs={logs}
                selectedId={selectedLog?.id}
                onSelect={handleSelectRow}
                sort={filters.sort}
                onSort={(sort) => handleFilters({ sort })}
              />
            )}
          </div>

          {/* Drawer */}
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
                  {selectedLog ? (
                    <AuditDrawer
                      log={selectedLog}
                      onClose={handleCloseDrawer}
                    />
                  ) : (
                    <AuditLogsFallbacks.DrawerEmpty />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
