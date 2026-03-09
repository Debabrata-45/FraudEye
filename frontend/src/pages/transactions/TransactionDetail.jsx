import { useState, useEffect } from 'react';
import RiskBadge from '../../components/ui/RiskBadge';
import { submitFeedback, getFeedback, flagUser, flagMerchant } from '../../api/feedback';

export default function TransactionDetail({ txn, onClose }) {
  const [notes, setNotes] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flagLoading, setFlagLoading] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (txn?.transactionId) {
      getFeedback(txn.transactionId)
        .then(setSavedFeedback)
        .catch(() => {});
    }
  }, [txn?.transactionId]);

  if (!txn) return null;

  const handleVerdict = async (verdict) => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await submitFeedback(txn.transactionId, verdict, notes);
      setSavedFeedback(result);
      setMessage({ type: 'success', text: `Marked as ${verdict} successfully!` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit feedback.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFlagUser = async () => {
    if (!txn.userId) return setMessage({ type: 'error', text: 'No userId on this transaction.' });
    setFlagLoading('user');
    try {
      await flagUser(txn.userId, notes || 'Flagged from transaction detail');
      setMessage({ type: 'success', text: `User ${txn.userId} flagged!` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to flag user.' });
    } finally {
      setFlagLoading('');
    }
  };

  const handleFlagMerchant = async () => {
    if (!txn.merchantId) return setMessage({ type: 'error', text: 'No merchantId on this transaction.' });
    setFlagLoading('merchant');
    try {
      await flagMerchant(txn.merchantId, notes || 'Flagged from transaction detail');
      setMessage({ type: 'success', text: `Merchant ${txn.merchantId} flagged!` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to flag merchant.' });
    } finally {
      setFlagLoading('');
    }
  };

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
              <p className="text-gray-400 text-sm mb-1">Risk Score</p>
              <p className="text-4xl font-bold text-white">{txn.riskScore}<span className="text-xl text-gray-400">/100</span></p>
              <div className="mt-2"><RiskBadge label={txn.riskLabel} /></div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Probability</p>
              <p className="text-2xl font-bold text-white">
                {txn.fraudProbability ? (txn.fraudProbability * 100).toFixed(1) : '—'}%
              </p>
              <p className="text-gray-500 text-xs mt-1">Model: {txn.modelVersion || '—'}</p>
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

          {/* Analyst Actions */}
          <div className="bg-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-white font-semibold">Analyst Actions</h3>

            {/* Saved feedback state */}
            {savedFeedback && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                savedFeedback.verdict === 'FRAUD' ? 'bg-red-900/40 text-red-400 border border-red-700' : 'bg-green-900/40 text-green-400 border border-green-700'
              }`}>
                ✓ Previously marked as <strong>{savedFeedback.verdict}</strong>
                {savedFeedback.notes && ` — "${savedFeedback.notes}"`}
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`px-4 py-2 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-900/40 text-green-400 border border-green-700' : 'bg-red-900/40 text-red-400 border border-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Notes input */}
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note..."
                className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Verdict buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleVerdict('FRAUD')}
                disabled={loading}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {loading ? '...' : '🚨 Mark Fraud'}
              </button>
              <button
                onClick={() => handleVerdict('SAFE')}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {loading ? '...' : '✅ Mark Safe'}
              </button>
            </div>

            {/* Flag buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleFlagUser}
                disabled={flagLoading === 'user'}
                className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {flagLoading === 'user' ? '...' : '⚠️ Flag User'}
              </button>
              <button
                onClick={handleFlagMerchant}
                disabled={flagLoading === 'merchant'}
                className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {flagLoading === 'merchant' ? '...' : '🏪 Flag Merchant'}
              </button>
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
          {txn.lime?.rules?.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">LIME Explanation</h3>
              <div className="space-y-2">
                {txn.lime.rules.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                    <span className="text-gray-300 text-sm">{r.rule}</span>
                    <span className={`text-sm font-medium ${r.weight > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {r.weight > 0 ? '+' : ''}{r.weight.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON */}
          <div>
            <h3 className="text-white font-semibold mb-3">Raw Payload</h3>
            <pre className="bg-gray-800 rounded-lg p-4 text-xs text-gray-400 overflow-x-auto">
              {JSON.stringify(txn, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}