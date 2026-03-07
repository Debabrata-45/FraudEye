import { useState, useEffect } from 'react';
import { getQueueStats } from '../../api/transactions';

const StatCard = ({ title, value, color = 'text-white' }) => (
  <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
  </div>
);

export default function QueueMonitor() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = () => {
    getQueueStats()
      .then((data) => {
        setStats(data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      })
      .catch(() => setError('Failed to load queue stats'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Queue Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">BullMQ scan_txn_queue stats</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-gray-500 text-xs">Updated: {lastUpdated}</span>
          )}
          <button
            onClick={fetchStats}
            className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-gray-400 text-sm">Loading queue stats...</div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Waiting" value={stats.waiting} color="text-yellow-400" />
            <StatCard title="Active" value={stats.active} color="text-blue-400" />
            <StatCard title="Completed" value={stats.completed} color="text-green-400" />
            <StatCard title="Failed" value={stats.failed} color="text-red-400" />
          </div>

          {/* Queue Health */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
            <h3 className="text-white font-semibold mb-4">Queue Health</h3>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stats.failed > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-gray-300 text-sm">
                {stats.failed > 0 ? `${stats.failed} failed jobs need attention` : 'All jobs processing normally'}
              </span>
            </div>
            {stats.waiting > 10 && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-300 text-sm">High queue depth: {stats.waiting} jobs waiting</span>
              </div>
            )}
          </div>

          {/* Throughput */}
          {stats.completed > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Throughput</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">
                    {((stats.completed / (stats.completed + stats.failed)) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Processed</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.completed + stats.failed).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}