import RiskBadge from '../../components/ui/RiskBadge';

export default function TransactionDetail({ txn, onClose }) {
  if (!txn) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-gray-900 h-full overflow-y-auto shadow-2xl border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-white font-bold text-lg">Transaction Detail</h2>
            <p className="text-gray-400 text-xs font-mono mt-0.5">{txn.transactionId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Risk Score */}
          <div className="bg-gray-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Fraud Probability</p>
              <p className="text-4xl font-bold text-white">{txn.riskScore}<span className="text-xl text-gray-400">/100</span></p>
              <div className="mt-2">
                <RiskBadge label={txn.riskLabel} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Probability</p>
              <p className="text-2xl font-bold text-white">{(txn.fraudProbability * 100).toFixed(1)}%</p>
              <p className="text-gray-500 text-xs mt-1">Model: {txn.modelVersion}</p>
            </div>
          </div>

          {/* Risk Score Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Risk Score</span>
              <span>{txn.riskScore}/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  txn.riskScore >= 71 ? 'bg-red-500' :
                  txn.riskScore >= 31 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${txn.riskScore}%` }}
              />
            </div>
          </div>

          {/* Top Factors */}
          {txn.topFactors?.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Top Risk Factors</h3>
              <div className="space-y-2">
                {txn.topFactors.map((f, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{f.feature}</p>
                      <p className="text-gray-400 text-xs">Value: {f.value}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${f.direction === 'increases_risk' ? 'text-red-400' : 'text-green-400'}`}>
                        {f.direction === 'increases_risk' ? '↑' : '↓'} {f.impact.toFixed(3)}
                      </p>
                      <p className="text-gray-500 text-xs">{f.direction === 'increases_risk' ? 'Increases Risk' : 'Decreases Risk'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHAP */}
          {txn.shap?.values?.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-1">SHAP Explanation</h3>
              <p className="text-gray-500 text-xs mb-3">Base Value: {txn.shap.baseValue?.toFixed(4)}</p>
              <div className="space-y-2">
                {txn.shap.values.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                    <span className="text-gray-300 text-sm">{s.feature}</span>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${s.shapValue > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {s.shapValue > 0 ? '+' : ''}{s.shapValue.toFixed(4)}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">({s.featureValue})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIME */}