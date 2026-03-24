import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  PanelRightOpen,
  PanelRightClose,
  Download,
  Wifi,
  WifiOff,
} from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import { ControlsBar, DataTable } from "../components/Responsive";
import TransactionsHeader from "./transactions/TransactionsHeader";
import TransactionsControls from "./transactions/TransactionsControls";
import TransactionsTable from "./transactions/TransactionsTable";
import TransactionDrawer from "./transactions/TransactionDrawer";
import {
  TransactionsFallbacks,
  InlineFilterEmpty,
} from "../components/feedback";
import { useTransactions } from "./overview/useOverviewData";
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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedTx, setSelectedTx] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dataMode, setDataMode] = useState("live");

  const {
    data: realData,
    loading,
    error,
    isRealData,
  } = useTransactions({ limit: 200 });

  /* ── Smart merge ─────────────────────────────────────── */
  const transactions = useMemo(() => {
    if (dataMode === "demo") return MOCK_TRANSACTIONS;
    if (realData.length > 0) {
      const mockHistory = MOCK_TRANSACTIONS.slice(0, 20).map((t) => ({
        ...t,
        isDemoHistory: true,
      }));
      return [...realData, ...mockHistory];
    }
    return MOCK_TRANSACTIONS;
  }, [realData, dataMode]);

  const filtered = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters],
  );
  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const hasFilters = useMemo(
    () =>
      filters.search ||
      filters.risk !== "ALL" ||
      filters.status !== "ALL" ||
      filters.fraudLabel !== "ALL",
    [filters],
  );

  /* ── Handlers ────────────────────────────────────────── */
  const handleSelectRow = useCallback((tx) => {
    setSelectedTx(tx);
    setDrawerOpen(true);
  }, []);
  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedTx(null), 300);
  }, []);
  const handleFilters = useCallback((f) => setFilters(f), []);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const handleSort = useCallback(
    (sort) => setFilters((f) => ({ ...f, sort })),
    [],
  );

  /* ── Export ──────────────────────────────────────────── */
  const handleExport = useCallback(() => {
    const headers = [
      "ID",
      "Merchant",
      "Amount",
      "Currency",
      "Status",
      "Risk Score",
      "Label",
      "Time",
    ];
    const rows = filtered.map((t) => [
      t.id,
      t.merchant?.name ?? t.merchant ?? "—",
      t.amount,
      t.currency ?? "INR",
      t.status ?? "—",
      t.riskScore ?? "—",
      t.fraudLabel ?? "—",
      t.timestamp ? new Date(t.timestamp).toLocaleString() : "—",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fraudeye_transactions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  if (loading) return <TransactionsFallbacks.Loading />;
  if (error && !transactions.length) return <TransactionsFallbacks.Error />;

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Toolbar */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <TransactionsHeader summary={summary} isStreaming={isRealData} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            {/* Mode toggle */}
            <button
              onClick={() =>
                setDataMode((m) => (m === "live" ? "demo" : "live"))
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                dataMode === "live"
                  ? "bg-[#22D3EE14] border-[#22D3EE33] text-[#22D3EE]"
                  : "bg-[#8B5CF614] border-[#8B5CF633] text-[#8B5CF6]"
              }`}
            >
              {dataMode === "live" ? (
                <>
                  <Wifi size={11} /> Live + Demo
                </>
              ) : (
                <>
                  <WifiOff size={11} /> Demo Only
                </>
              )}
            </button>

            {/* Export — now functional */}
            <button onClick={handleExport} className="fe-btn-ghost">
              <Download size={12} />
              Export
            </button>

            {/* Drawer toggle */}
            <button
              onClick={() =>
                drawerOpen ? handleCloseDrawer() : setDrawerOpen(true)
              }
              className={drawerOpen ? "fe-btn-primary" : "fe-btn-ghost"}
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

        {/* Live banner */}
        {dataMode === "live" && realData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg bg-[#22D3EE08] border border-[#22D3EE18]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse flex-shrink-0" />
            <span className="text-[11px] text-[#22D3EE] font-medium">
              {realData.length} live transactions
            </span>
            <span className="text-[11px] text-[#334155]">·</span>
            <span className="text-[11px] text-[#475569]">
              +20 historical demo records below
            </span>
            <span className="ml-auto text-[10px] text-[#334155]">
              Switch to Demo Only to see full synthetic dataset
            </span>
          </motion.div>
        )}

        {/* Controls */}
        <ControlsBar>
          <TransactionsControls
            filters={filters}
            onChange={handleFilters}
            onReset={handleReset}
            resultCount={filtered.length}
            totalCount={transactions.length}
          />
        </ControlsBar>

        {/* Table + drawer */}
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          <div
            className={`flex-1 min-w-0 transition-all duration-300 ${drawerOpen ? "hidden xl:block" : ""}`}
          >
            {filtered.length === 0 && hasFilters ? (
              <DataTable>
                <table className="w-full">
                  <tbody>
                    <InlineFilterEmpty colSpan={7} onReset={handleReset} />
                  </tbody>
                </table>
              </DataTable>
            ) : (
              <DataTable>
                <TransactionsTable
                  transactions={filtered}
                  selectedId={selectedTx?.id}
                  onSelect={handleSelectRow}
                  loading={loading}
                  sort={filters.sort}
                  onSort={handleSort}
                  hasFilters={hasFilters}
                />
              </DataTable>
            )}
          </div>

          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                key="drawer"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-shrink-0 overflow-hidden rounded-xl border border-[#1E293B]"
                style={{ minWidth: drawerOpen ? 320 : 0 }}
              >
                <div className="w-[380px] h-full">
                  {selectedTx ? (
                    <TransactionDrawer
                      transaction={selectedTx}
                      onClose={handleCloseDrawer}
                    />
                  ) : (
                    <TransactionsFallbacks.DrawerError onRetry={null} />
                  )}
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
