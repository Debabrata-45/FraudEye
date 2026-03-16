import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  PanelRightOpen,
  PanelRightClose,
  Download,
} from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import TransactionsHeader from "./transactions/TransactionsHeader";
import TransactionsControls from "./transactions/TransactionsControls";
import TransactionsTable from "./transactions/TransactionsTable";
import TransactionDrawer from "./transactions/TransactionDrawer";
import {
  MOCK_TRANSACTIONS,
  getSummary,
  applyFilters,
} from "./transactions/transactionsData";

const DEFAULT_FILTERS = {
  search: "",
  risk: "ALL",
  status: "ALL",
  fraudLabel: "ALL",
  sort: "timestamp_desc",
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedTx, setSelectedTx] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isStreaming] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulate initial data load
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  // Filtered + sorted transactions
  const filtered = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters],
  );

  // Summary counts based on ALL transactions (not filtered)
  const summary = useMemo(() => getSummary(transactions), [transactions]);

  const handleSelectRow = useCallback((tx) => {
    setSelectedTx(tx);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    // Keep selectedTx briefly so exit animation is clean
    setTimeout(() => setSelectedTx(null), 300);
  }, []);

  const handleFilters = useCallback((f) => setFilters(f), []);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const handleSort = useCallback(
    (sort) => setFilters((f) => ({ ...f, sort })),
    [],
  );
  const handleRefresh = useCallback(() => {
    setSelectedTx(null);
    setDrawerOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  const hasFilters = useMemo(
    () =>
      filters.search ||
      filters.risk !== "ALL" ||
      filters.status !== "ALL" ||
      filters.fraudLabel !== "ALL",
    [filters],
  );

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Toolbar row — header + action buttons */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <TransactionsHeader summary={summary} isStreaming={isStreaming} />
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400
                hover:text-slate-200 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400
                hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              <Download size={12} />
              Export
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
        <TransactionsControls
          filters={filters}
          onChange={handleFilters}
          onReset={handleReset}
          resultCount={filtered.length}
          totalCount={transactions.length}
        />

        {/* Main workspace: table + optional drawer */}
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          {/* Table */}
          <div
            className={`flex-1 min-w-0 overflow-auto transition-all duration-300 ${drawerOpen ? "hidden xl:block" : ""}`}
          >
            <TransactionsTable
              transactions={filtered}
              selectedId={selectedTx?.id}
              onSelect={handleSelectRow}
              loading={loading}
              sort={filters.sort}
              onSort={handleSort}
              hasFilters={hasFilters}
            />
          </div>

          {/* Detail drawer — inline panel on large screens, slides in otherwise */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                key="drawer"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-shrink-0 overflow-hidden rounded-xl border border-slate-800"
                style={{ minWidth: drawerOpen ? 320 : 0 }}
              >
                <div className="w-[380px] h-full">
                  <TransactionDrawer
                    transaction={selectedTx}
                    onClose={handleCloseDrawer}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Transactions;
