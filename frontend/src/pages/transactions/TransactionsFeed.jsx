import { useState } from 'react';
import TransactionDetail from './TransactionDetail';
import { useSSE } from '../../hooks/useSSE';
import RiskBadge from '../../components/ui/RiskBadge';

export default function TransactionsFeed() {
  const { transactions, connected, error, clear } = useSSE(100);
  const [filters, setFilters] = useState({ riskLabel: '', userId: '', merchantId: '' });
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filtered = transactions.filter((t) => {
    if (filters.riskLabel && t.riskLabel !== filters.riskLabel) return false;
    if (filters.userId && !t.userId?.includes(filters.userId)) return false;
    if (filters.merchantId && !t.merchantId?.includes(filters.merchantId)) return false;
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time fraud scoring feed</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border ${connected ? 'text-green-400 border-green-800 bg-green-900/20' : 'text-red-400 border-red-800 bg-red-900/20'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {connected ? 'Live' : 'Disconnected'}
          </span>
          <button onClick={clear} className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
            Clear
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={filters.riskLabel}
          onChange={(e) => setFilters({ ...filters, riskLabel: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
        >
          <option value="">All Risk Levels</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <input
          type="text"
          placeholder="Filter by User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 w-48"
        />
        <input
          type="text"
          placeholder="Filter by Merchant ID"
          value={filters.merchantId}
          onChange={(e) => setFilters({ ...filters, merchantId: e.target.value })}
          className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Transaction ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Merchant</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Risk Score</th>
              <th className="px-4 py-3 text-center">Risk Label</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  {connected ? 'Waiting for transactions...' : 'Connecting to live feed...'}
                </td>
              </tr>
            ) : (
              filtered.map((txn, i) => (
                <tr
                  key={txn.transactionId || i}
                  onClick={() => setSelectedTxn(txn)}
                  className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-gray-400">
                    {txn.timestamp ? new Date(txn.timestamp).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                    {txn.transactionId || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{txn.userId || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{txn.merchantId || '—'}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">
                    ₹{txn.amount?.toLocaleString() || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-white font-bold">{txn.riskScore ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {txn.riskLabel ? <RiskBadge label={txn.riskLabel} /> : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 text-xs mt-3">
        Showing {filtered.length} of {transactions.length} transactions
      </p>

      {/* Transaction Detail Drawer */}
      {selectedTxn && (
        <TransactionDetail
          txn={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
}