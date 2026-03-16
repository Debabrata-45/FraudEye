import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, CheckCircle, XCircle, Clock,
  AlertTriangle, RefreshCw, Activity
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/constants';
import { cn } from '../../utils/cn';
import { motionVariants } from '../../styles/tokens';

const QUEUE_CARDS = [
  {
    key:   'waiting',
    label: 'Waiting',
    icon:  Clock,
    color: { bg: 'bg-fe-cyan/10',    text: 'text-fe-cyan',    border: 'border-fe-cyan/20',    glow: 'fe-glow-cyan'    },
  },
  {
    key:   'active',
    label: 'Active',
    icon:  Activity,
    color: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', glow: 'fe-glow-violet'  },
  },
  {
    key:   'completed',
    label: 'Completed',
    icon:  CheckCircle,
    color: { bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/20',glow: 'fe-glow-success' },
  },
  {
    key:   'failed',
    label: 'Failed',
    icon:  XCircle,
    color: { bg: 'bg-rose-500/10',   text: 'text-rose-400',   border: 'border-rose-500/20',   glow: 'fe-glow-danger'  },
  },
  {
    key:   'delayed',
    label: 'Delayed',
    icon:  AlertTriangle,
    color: { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20',  glow: 'fe-glow-warning' },
  },
  {
    key:   'paused',
    label: 'Paused',
    icon:  Clock,
    color: { bg: 'bg-fe-text-3/10',  text: 'text-fe-text-3',  border: 'border-fe-border',     glow: ''                },
  },
];

function QueueCard({ cardDef, value, loading }) {
  const { label, icon: Icon, color } = cardDef;
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        'fe-glass rounded-fe-xl p-5 border transition-all',
        color.border,
        color.glow
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-9 h-9 rounded-fe flex items-center justify-center', color.bg)}>
          <Icon className={cn('w-4 h-4', color.text)} />
        </div>
        {cardDef.key === 'active' && value > 0 && (
          <span className="flex items-center gap-1 text-xs text-violet-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Processing
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-9 w-16 rounded-fe fe-shimmer mb-1" />
      ) : (
        <p className={cn('text-4xl font-bold mb-1', color.text)}>{value ?? 0}</p>
      )}
      <p className="text-fe-text-2 text-sm font-medium">{label}</p>
    </motion.div>
  );
}

function HealthIndicator({ counts }) {
  const total     = (counts?.waiting || 0) + (counts?.active || 0);
  const failed    = counts?.failed || 0;
  const completed = counts?.completed || 0;
  const successRate = completed > 0
    ? ((completed / (completed + failed)) * 100).toFixed(1)
    : null;

  const health = failed > 5 ? 'degraded' : total > 10 ? 'busy' : 'healthy';
  const healthConfig = {
    healthy:  { label: 'Healthy',  color: 'text-emerald-400', dot: 'bg-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    busy:     { label: 'Busy',     color: 'text-amber-400',   dot: 'bg-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
    degraded: { label: 'Degraded', color: 'text-rose-400',    dot: 'bg-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20'    },
  }[health];

  return (
    <div className={cn(
      'fe-glass rounded-fe-xl p-5 border',
      healthConfig.border
    )}>
      <h3 className="text-fe-text font-semibold text-sm mb-4 fe-section-heading">Queue Health</h3>
      <div className="flex items-center gap-4 flex-wrap">
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-fe border',
          healthConfig.bg, healthConfig.border
        )}>
          <span className={cn('w-2 h-2 rounded-full animate-pulse', healthConfig.dot)} />
          <span className={cn('text-sm font-semibold', healthConfig.color)}>{healthConfig.label}</span>
        </div>
        {successRate && (
          <div className="flex items-center gap-2">
            <span className="text-fe-text-3 text-xs">Success rate</span>
            <span className="text-emerald-400 font-semibold text-sm">{successRate}%</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-fe-text-3 text-xs">In progress</span>
          <span className="text-fe-cyan font-semibold text-sm">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-fe-text-3 text-xs">Total processed</span>
          <span className="text-fe-text-2 font-semibold text-sm">{completed}</span>
        </div>
      </div>

      {/* Progress bar */}
      {completed > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-fe-text-3 mb-1.5">
            <span>Completed vs Failed</span>
            <span>{completed} / {completed + failed}</span>
          </div>
          <div className="w-full bg-fe-surface rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${successRate || 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function QueueMonitor() {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const token = localStorage.getItem('fraudeye_token');
      const res   = await fetch(`${API_BASE_URL}/api/queue/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setStats(data.data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError('Failed to fetch queue stats');
      }
    } catch {
      setError('Cannot reach backend');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(), 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <motion.div
      variants={motionVariants.stagger}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={motionVariants.fadeUp} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-fe-cyan" />
            <h1 className="text-xl font-bold text-fe-text">Queue Monitor</h1>
          </div>
          <p className="text-fe-text-3 text-sm">
            BullMQ job processing — <span className="font-mono text-fe-cyan text-xs">
              {stats?.queue || 'scan_txn_queue'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-fe-text-3 text-xs">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-fe bg-fe-surface border border-fe-border text-fe-text-2 text-xs hover:border-fe-cyan/50 hover:text-fe-cyan transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          variants={motionVariants.fadeUp}
          className="px-4 py-3 rounded-fe bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {QUEUE_CARDS.map((card) => (
          <QueueCard
            key={card.key}
            cardDef={card}
            value={stats?.counts?.[card.key]}
            loading={loading}
          />
        ))}
      </div>

      {/* Health */}
      {stats?.counts && (
        <motion.div variants={motionVariants.fadeUp}>
          <HealthIndicator counts={stats.counts} />
        </motion.div>
      )}

      {/* Queue info */}
      <motion.div
        variants={motionVariants.fadeUp}
        className="fe-glass rounded-fe-xl p-5 border border-fe-border"
      >
        <h3 className="text-fe-text font-semibold text-sm mb-4 fe-section-heading">Pipeline Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-fe-text-3 text-xs uppercase tracking-wider">Queue Name</p>
            <p className="text-fe-cyan font-mono text-sm">{stats?.queue || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-fe-text-3 text-xs uppercase tracking-wider">Worker</p>
            <p className="text-fe-text-2 text-sm">Node.js BullMQ</p>
          </div>
          <div className="space-y-1">
            <p className="text-fe-text-3 text-xs uppercase tracking-wider">ML Service</p>
            <p className="text-fe-text-2 text-sm">FastAPI + XGBoost</p>
          </div>
          <div className="space-y-1">
            <p className="text-fe-text-3 text-xs uppercase tracking-wider">Retry Policy</p>
            <p className="text-fe-text-2 text-sm">3 attempts, exponential backoff</p>
          </div>
          <div className="space-y-1">
            <p className="text-fe-text-3 text-xs uppercase tracking-wider">ML Timeout</p>
            <p className="text-fe-text-2 text-sm">15 seconds</p>
          </div>
          <div className="space-y-1">
            <p className="text-fe-text-3 text-xs uppercase tracking-wider">Auto Refresh</p>
            <p className="text-emerald-400 text-sm">Every 10 seconds</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}