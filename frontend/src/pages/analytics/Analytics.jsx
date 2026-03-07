import { useState, useEffect } from 'react';
import { getAnalyticsSummary } from '../../api/transactions';

const KPICard = ({ title, value, subtitle, color = 'text-white' }) => (
  <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalyticsSummary()
      .then(setSummary)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Fraud trends and summary metrics</p>
      </div>

      {loading && (
        <div className="text-gray-400 text-sm">Loading analytics...</div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {summary && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              title="Total Transactions"
              value={summary.totalTransactions?.toLocaleString() || '—'}
              subtitle="All time"
            />
            <KPICard
              title="High Risk"
              value={summary.highRiskCount?.toLocaleString() || '—'}
              subtitle="Risk score > 70"
              color="text-red-400"
            />
            <KPICard
              title="Fraud Rate"
              value={summary.fraudRate ? `${(summary.fraudRate * 100).toFixed(1)}%` : '—'}
              subtitle="High risk / total"
              color="text-yellow-400"
            />
            <KPICard
              title="Avg Risk Score"
              value={summary.avgRiskScore?.toFixed(1) || '—'}
              subtitle="Across all transactions"
              color="text-blue-400"
            />
          </div>

          {/* Risk Distribution */}
          {summary.riskDistribution && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
              <h3 className="text-white font-semibold mb-4">Risk Distribution</h3>
              <div className="space-y-3">
                {['HIGH', 'MEDIUM', 'LOW'].map((label) => {
                  const count = summary.riskDistribution[label] || 0;
                  const total = summary.totalTransactions || 1;
                  const pct = ((count / total) * 100).toFixed(1);
                  const color = label === 'HIGH' ? 'bg-red-500' : label === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500';
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{label}</span>
                        <span className="text-gray-400">{count.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hourly Trend */}
          {summary.hourlyTrend && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Hourly Fraud Trend</h3>
              <div className="flex items-end gap-1 h-32">
                {summary.hourlyTrend.map((val, i) => {
                  const max = Math.max(...summary.hourlyTrend, 1);
                  const height = ((val / max) * 100).toFixed(0);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-red-500/70 rounded-sm"
                        style={{ height: `${height}%` }}
                        title={`Hour ${i}: ${val}`}
                      />
                      {i % 4 === 0 && (
                        <span className="text-gray-600 text-xs">{i}h</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !summary && !error && (
        <div className="text-gray-500 text-sm">No analytics data available.</div>
      )}
    </div>
  );
}