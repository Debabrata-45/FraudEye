// ─── Default settings state ───────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  // Display
  density: "comfortable", // 'compact' | 'comfortable'
  animationIntensity: "full", // 'full' | 'reduced' | 'none'
  chartStyle: "filled", // 'filled' | 'line' | 'minimal'
  tableView: "default", // 'default' | 'compact'

  // Alert preferences
  alertEmphasis: "severity", // 'severity' | 'time' | 'risk'
  liveFeedEnabled: true,
  defaultAlertFilter: "ALL", // 'ALL' | 'CRITICAL' | 'HIGH'
  soundAlerts: false,

  // Monitoring
  autoRefresh: true,
  refreshInterval: "30", // seconds
  streamPause: false,
  showConfidence: true,

  // Risk display
  defaultSort: "severity_desc", // 'severity_desc' | 'time_desc' | 'risk_desc'
  showReasonChips: true,
  showShapPreview: true,
  riskBandStyle: "bar", // 'bar' | 'badge' | 'both'

  // Notifications
  browserNotifs: false,
  criticalOnly: false,
  emailDigest: false,
  digestFreq: "daily", // 'realtime' | 'hourly' | 'daily'
};

// ─── Mock user profile ────────────────────────────────────────────────────────
export const MOCK_USER = {
  name: "Debabrata Mondal",
  email: "analyst@fraudeye.com",
  role: "Fraud Analyst",
  level: "Senior",
  joined: "Jan 2025",
  lastLogin: "Today, 09:14 UTC",
  avatar: "DM",
  permissions: [
    "View Transactions",
    "Review Cases",
    "Submit Feedback",
    "View Explanations",
    "View Audit Logs",
  ],
};

// ─── System info ──────────────────────────────────────────────────────────────
export const SYSTEM_INFO = {
  appVersion: "v2.4.1",
  environment: "Production",
  model: "XGBoost v2.1.0",
  xaiMethod: "SHAP + LIME",
  modelAuc: "0.9962",
  apiStatus: "Healthy",
  wsStatus: "Connected",
  lastDeploy: "Mar 14, 2025",
};

// ─── Option sets ──────────────────────────────────────────────────────────────
export const DENSITY_OPTIONS = [
  {
    value: "comfortable",
    label: "Comfortable",
    desc: "More spacing, easier scanning",
  },
  {
    value: "compact",
    label: "Compact",
    desc: "Denser view, more rows visible",
  },
];

export const ANIMATION_OPTIONS = [
  { value: "full", label: "Full", desc: "All transitions and effects enabled" },
  {
    value: "reduced",
    label: "Reduced",
    desc: "Minimal animations, faster feel",
  },
  { value: "none", label: "None", desc: "No motion, maximum performance" },
];

export const CHART_OPTIONS = [
  { value: "filled", label: "Filled Area" },
  { value: "line", label: "Line Only" },
  { value: "minimal", label: "Minimal" },
];

export const REFRESH_OPTIONS = [
  { value: "15", label: "Every 15s" },
  { value: "30", label: "Every 30s" },
  { value: "60", label: "Every 60s" },
  { value: "300", label: "Every 5m" },
];

export const SORT_OPTIONS = [
  { value: "severity_desc", label: "Highest Severity" },
  { value: "time_desc", label: "Newest First" },
  { value: "risk_desc", label: "Highest Risk" },
];

export const ALERT_FILTER_OPTIONS = [
  { value: "ALL", label: "All Alerts" },
  { value: "CRITICAL", label: "Critical Only" },
  { value: "HIGH", label: "High and Above" },
];

export const DIGEST_OPTIONS = [
  { value: "realtime", label: "Real-time" },
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
];

export const RISK_BAND_OPTIONS = [
  { value: "bar", label: "Bar + Badge" },
  { value: "badge", label: "Badge Only" },
  { value: "both", label: "Full Detail" },
];
