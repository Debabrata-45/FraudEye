import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, AlertTriangle, CheckCircle,
  Flag, Store, Brain, ChevronRight, Info
} from 'lucide-react';
import RiskBadge from '../../components/ui/RiskBadge';
import { submitFeedback, getFeedback, flagUser, flagMerchant } from '../../api/feedback';
import { getRiskConfig, COLORS } from '../../utils/constants';
import { cn } from '../../utils/cn';
import { motionVariants } from '../../styles/tokens';

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4 text-fe-cyan" />}
      <h3 className="text-fe-text font-semibold text-sm fe-section-heading">{title}</h3>
    </div>
  );
}

function ShapBar({ feature, shapValue, featureValue, maxAbs }) {
  const isPositive = shapValue > 0;
  const pct = Math.min(Math.abs(shapValue) / (maxAbs || 1) * 100, 100);
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-fe hover:bg-white/[0.02] transition-colors">
      <div className="w-36 flex-shrink-0">
        <p className="text-fe-text-2 text-xs font-medium truncate">{feature}</p>
        <p className="text-fe-text-3 text-xs font-mono">{featureValue}</p>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-fe-surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn('h-full rounded-full', isPositive ? 'bg-rose-500' : 'bg-emerald-500')}
          />
        </div>
        <span className={cn(
          'text-xs font-semibold font-mono w-16 text-right flex-shrink-0',
          isPositive ? 'text-rose-400' : 'text-emerald-400'
        )}>
          {isPositive ? '+' : ''}{shapValue.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

export default function TransactionDetail({ txn, onClose }) {
  const [notes, setNotes]               = useState('');
  const [savedFeedback, setSavedFeedback] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [flagLoading, setFlagLoading]   = useState('');
  const [message, setMessage]           = useState(null);
  const [activeTab, setActiveTab]       = useState('overview');

  useEffect(() => {
    if (txn?.transactionId) {
      getFeedback(txn.transactionId).then(setSavedFeedback).catch(() => {});
    }
  }, [txn?.transactionId]);

  if (!txn) return null;

  const config = getRiskConfig(txn.riskLabel || txn.riskScore);

  const handleVerdict = async (verdict) => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await submitFeedback(txn.transactionId, verdict, notes);
      setSavedFeedback(result);
      setMessage({ type: 'success', text: `Marked as ${verdict}` });
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
      setMessage({ type: 'success', text: `User ${txn.userId} flagged` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to flag user.' });
    } finally { setFlagLoading(''); }
  };

  const handleFlagMerchant = async () => {
    if (!txn.merchantId) return setMessage({ type: 'error', text: 'No merchantId on this transaction.' });
    setFlagLoading('merchant');
    try {
      await flagMerchant(txn.merchantId, notes || 'Flagged from transaction detail');
      setMessage({ type: 'success', text: `Merchant ${txn.merchantId} flagged` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to flag merchant.' });
    } finally { setFlagLoading(''); }
  };

  const shapValues  = txn.shap?.values || [];
  const maxAbsShap  = Math.max(...shapValues.map(s => Math.abs(s.shapValue || 0)), 0.001);
  const tabs = ['overview', 'shap', 'lime', 'raw'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          variants={motionVariants.drawerSlide}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-xl fe-glass border-l border-fe-border h-full overflow-hidden flex flex-col"
        >
          {/* Glow accent based on risk */}
          <div className={cn(
            'absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none',
            txn.riskScore >= 71 ? 'bg-rose-500' : txn.riskScore >= 31 ? 'bg-amber-500' : 'bg-emerald-500'
          )} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-fe-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-fe flex items-center justify-center',
                config.bg, config.border, 'border'
              )}>
                <Shield className={cn('w-4 h-4', config.color)} />
              </div>
              <div>
                <h2 className="text-fe-text font-bold text-sm">Transaction Detail</h2>
                <p className="text-fe-text-3 text-xs font-mono">#{txn.transactionId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-fe bg-fe-surface border border-fe-border flex items-center justify-center text-fe-text-3 hover:text-fe-text hover:border-fe-border transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-fe-border flex-shrink-0 px-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3 text-xs font-medium capitalize border-b-2 transition-all',
                  activeTab === tab
                    ? 'border-fe-cyan text-fe-cyan'
                    : 'border-transparent text-fe-text-3 hover:text-fe-text-2'
                )}
              >
                {tab === 'shap' ? 'SHAP' : tab === 'lime' ? 'LIME' : tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                variants={motionVariants.fadeUp}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {/* Risk score card */}
                <div className={cn('rounded-fe-xl p-5 border', config.bg, config.border)}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-fe-text-3 text-xs mb-1">Risk Score</p>
                      <div className="flex items-end gap-2">
                        <span className={cn('text-5xl font-bold', config.color)}>
                          {txn.riskScore ?? '—'}
                        </span>
                        <span className="text-fe-text-3 text-lg mb-1">/100</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-fe-text-3 text-xs mb-1">Fraud Probability</p>
                      <p className="text-2xl font-bold text-fe-text">
                        {txn.fraudProbability ? (txn.fraudProbability * 100).toFixed(1) : '—'}%
                      </p>
                      <p className="text-fe-text-3 text-xs mt-1 font-mono">{txn.modelVersion}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-fe-text-3 mb-1">
                      <span>Risk Level</span>
                      <RiskBadge label={txn.riskLabel} score={txn.riskScore} size="sm" />
                    </div>
                    <div className="w-full bg-fe-surface/50 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${txn.riskScore || 0}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={cn('h-2 rounded-full', config.bar)}
                      />
                    </div>
                  </div>
                </div>

                {/* Analyst actions */}
                <div className="fe-glass-light rounded-fe-xl p-5 space-y-4">
                  <SectionHeading icon={CheckCircle} title="Analyst Actions" />

                  {savedFeedback && (
                    <div className={cn(
                      'px-4 py-2.5 rounded-fe text-xs font-medium border flex items-center gap-2',
                      savedFeedback.verdict === 'FRAUD'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    )}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Previously marked as <strong>{savedFeedback.verdict}</strong>
                    </div>
                  )}

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'px-4 py-2.5 rounded-fe text-xs border flex items-center gap-2',
                        message.type === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      )}
                    >
                      {message.type === 'success'
                        ? <CheckCircle className="w-3.5 h-3.5" />
                        : <AlertTriangle className="w-3.5 h-3.5" />
                      }
                      {message.text}
                    </motion.div>
                  )}

                  <div>
                    <label className="text-fe-text-3 text-xs mb-1.5 block uppercase tracking-wider">Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add investigation notes..."
                      className="w-full bg-fe-surface border border-fe-border text-fe-text text-sm rounded-fe px-3 py-2.5 placeholder:text-fe-text-3 focus:outline-none focus:border-fe-cyan transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVerdict('FRAUD')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-fe bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 disabled:opacity-50 transition-all"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {loading ? '...' : 'Mark Fraud'}
                    </button>
                    <button
                      onClick={() => handleVerdict('SAFE')}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-fe bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {loading ? '...' : 'Mark Safe'}
                    </button>
                    <button
                      onClick={handleFlagUser}
                      disabled={flagLoading === 'user'}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-fe bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 disabled:opacity-50 transition-all"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      {flagLoading === 'user' ? '...' : 'Flag User'}
                    </button>
                    <button
                      onClick={handleFlagMerchant}
                      disabled={flagLoading === 'merchant'}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-fe bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/20 disabled:opacity-50 transition-all"
                    >
                      <Store className="w-3.5 h-3.5" />
                      {flagLoading === 'merchant' ? '...' : 'Flag Merchant'}
                    </button>
                  </div>
                </div>

                {/* Top risk factors */}
                {txn.topFactors?.length > 0 && (
                  <div>
                    <SectionHeading icon={Brain} title="Top Risk Factors" />
                    <div className="space-y-2">
                      {txn.topFactors.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between fe-glass-light rounded-fe px-4 py-3 border border-fe-border2"
                        >
                          <div>
                            <p className="text-fe-text text-sm font-medium">{f.feature}</p>
                            <p className="text-fe-text-3 text-xs">Value: {f.value}</p>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              'text-sm font-semibold',
                              f.direction === 'increases_risk' ? 'text-rose-400' : 'text-emerald-400'
                            )}>
                              {f.direction === 'increases_risk' ? '↑' : '↓'} {f.impact?.toFixed(3)}
                            </p>
                            <p className="text-fe-text-3 text-xs">
                              {f.direction === 'increases_risk' ? 'Increases Risk' : 'Decreases Risk'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SHAP TAB */}
            {activeTab === 'shap' && (
              <motion.div
                variants={motionVariants.fadeUp}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <SectionHeading icon={Brain} title="SHAP Explanation" />
                  {txn.shap?.baseValue !== undefined && (
                    <span className="text-fe-text-3 text-xs font-mono">
                      Base: {txn.shap.baseValue?.toFixed(4)}
                    </span>
                  )}
                </div>

                <div className="fe-glass-light rounded-fe-xl border border-fe-border2 overflow-hidden">
                  <div className="px-3 py-2 border-b border-fe-border2 flex items-center justify-between">
                    <span className="text-fe-text-3 text-xs">Feature</span>
                    <div className="flex items-center gap-4 text-xs text-fe-text-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Increases risk
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Decreases risk
                      </span>
                    </div>
                  </div>
                  {shapValues.length > 0 ? (
                    shapValues.map((s, i) => (
                      <ShapBar
                        key={i}
                        feature={s.feature}
                        shapValue={s.shapValue}
                        featureValue={s.featureValue}
                        maxAbs={maxAbsShap}
                      />
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-fe-text-3 text-sm">
                      No SHAP data available
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* LIME TAB */}
            {activeTab === 'lime' && (
              <motion.div
                variants={motionVariants.fadeUp}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <SectionHeading icon={Info} title="LIME Explanation" />
                {txn.lime?.rules?.length > 0 ? (
                  <div className="space-y-2">
                    {txn.lime.rules.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between fe-glass-light rounded-fe px-4 py-3 border border-fe-border2"
                      >
                        <span className="text-fe-text-2 text-sm">{r.rule}</span>
                        <span className={cn(
                          'text-sm font-semibold font-mono ml-4 flex-shrink-0',
                          r.weight > 0 ? 'text-rose-400' : 'text-emerald-400'
                        )}>
                          {r.weight > 0 ? '+' : ''}{r.weight?.toFixed(4)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="fe-glass-light rounded-fe-xl border border-fe-border2 px-4 py-8 text-center text-fe-text-3 text-sm">
                    No LIME data available
                  </div>
                )}
              </motion.div>
            )}

            {/* RAW TAB */}
            {activeTab === 'raw' && (
              <motion.div
                variants={motionVariants.fadeUp}
                initial="hidden"
                animate="visible"
              >
                <SectionHeading icon={ChevronRight} title="Raw Payload" />
                <pre className="fe-glass-light rounded-fe-xl border border-fe-border2 p-4 text-xs text-fe-text-3 overflow-x-auto font-mono leading-relaxed">
                  {JSON.stringify(txn, null, 2)}
                </pre>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}