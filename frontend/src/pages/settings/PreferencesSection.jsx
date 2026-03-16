import {
  SettingsCard,
  SettingsRow,
  Toggle,
  SettingsSelect,
  RadioGroup,
} from "./SettingsComponents";
import {
  DENSITY_OPTIONS,
  ANIMATION_OPTIONS,
  CHART_OPTIONS,
  ALERT_FILTER_OPTIONS,
  REFRESH_OPTIONS,
  SORT_OPTIONS,
  DIGEST_OPTIONS,
  RISK_BAND_OPTIONS,
} from "./settingsData";

// ─── Display preferences ──────────────────────────────────────────────────────
export const DisplaySection = ({ settings, onChange }) => (
  <SettingsCard
    title="Display & Interface"
    description="Control how information is presented across the platform"
    icon="🖥️"
  >
    <SettingsRow
      label="Table Density"
      description="Controls row spacing in transaction and audit tables"
    >
      <RadioGroup
        value={settings.tableView}
        onChange={(v) => onChange("tableView", v)}
        options={[
          { value: "default", label: "Default" },
          { value: "compact", label: "Compact" },
        ]}
      />
    </SettingsRow>

    <SettingsRow
      label="View Density"
      description="Adjusts spacing and padding across dashboard surfaces"
    >
      <SettingsSelect
        value={settings.density}
        onChange={(v) => onChange("density", v)}
        options={DENSITY_OPTIONS}
      />
    </SettingsRow>

    <SettingsRow
      label="Animation Intensity"
      description="Reduce or disable motion effects for accessibility or performance"
    >
      <SettingsSelect
        value={settings.animationIntensity}
        onChange={(v) => onChange("animationIntensity", v)}
        options={ANIMATION_OPTIONS}
      />
    </SettingsRow>

    <SettingsRow
      label="Chart Style"
      description="Default rendering style for trend and time-series charts"
      last
    >
      <SettingsSelect
        value={settings.chartStyle}
        onChange={(v) => onChange("chartStyle", v)}
        options={CHART_OPTIONS}
      />
    </SettingsRow>
  </SettingsCard>
);

// ─── Alert preferences ────────────────────────────────────────────────────────
export const AlertSection = ({ settings, onChange }) => (
  <SettingsCard
    title="Alert Preferences"
    description="Configure how alerts are displayed and filtered by default"
    icon="🔔"
  >
    <SettingsRow
      label="Default Alert Filter"
      description="Starting filter applied when opening the Alerts page"
    >
      <SettingsSelect
        value={settings.defaultAlertFilter}
        onChange={(v) => onChange("defaultAlertFilter", v)}
        options={ALERT_FILTER_OPTIONS}
      />
    </SettingsRow>

    <SettingsRow
      label="Alert Emphasis"
      description="Primary sort order used for the alert feed"
    >
      <RadioGroup
        value={settings.alertEmphasis}
        onChange={(v) => onChange("alertEmphasis", v)}
        options={[
          { value: "severity", label: "Severity" },
          { value: "time", label: "Time" },
          { value: "risk", label: "Risk" },
        ]}
      />
    </SettingsRow>

    <SettingsRow
      label="Live Feed"
      description="Enable real-time alert streaming via SSE connection"
    >
      <Toggle
        checked={settings.liveFeedEnabled}
        onChange={(v) => onChange("liveFeedEnabled", v)}
      />
    </SettingsRow>

    <SettingsRow
      label="Sound Alerts"
      description="Play audio notification for new critical alerts"
      last
    >
      <Toggle
        checked={settings.soundAlerts}
        onChange={(v) => onChange("soundAlerts", v)}
      />
    </SettingsRow>
  </SettingsCard>
);

// ─── Monitoring preferences ───────────────────────────────────────────────────
export const MonitoringSection = ({ settings, onChange }) => (
  <SettingsCard
    title="Monitoring Preferences"
    description="Live monitoring and refresh behavior settings"
    icon="📡"
  >
    <SettingsRow
      label="Auto Refresh"
      description="Automatically refresh transaction and queue data at interval"
    >
      <Toggle
        checked={settings.autoRefresh}
        onChange={(v) => onChange("autoRefresh", v)}
      />
    </SettingsRow>

    <SettingsRow
      label="Refresh Interval"
      description="How often data refreshes when auto-refresh is enabled"
    >
      <SettingsSelect
        value={settings.refreshInterval}
        onChange={(v) => onChange("refreshInterval", v)}
        options={REFRESH_OPTIONS}
      />
    </SettingsRow>

    <SettingsRow
      label="Show Model Confidence"
      description="Display confidence scores alongside risk badges in tables"
      last
    >
      <Toggle
        checked={settings.showConfidence}
        onChange={(v) => onChange("showConfidence", v)}
      />
    </SettingsRow>
  </SettingsCard>
);

// ─── Risk display preferences ─────────────────────────────────────────────────
export const RiskDisplaySection = ({ settings, onChange }) => (
  <SettingsCard
    title="Risk Display"
    description="Control how fraud risk and model reasoning is shown"
    icon="🎯"
  >
    <SettingsRow
      label="Default Sort Order"
      description="Default ordering applied to transaction and alert lists"
    >
      <SettingsSelect
        value={settings.defaultSort}
        onChange={(v) => onChange("defaultSort", v)}
        options={SORT_OPTIONS}
      />
    </SettingsRow>

    <SettingsRow
      label="Risk Band Style"
      description="How risk scores are visualized in table rows"
    >
      <SettingsSelect
        value={settings.riskBandStyle}
        onChange={(v) => onChange("riskBandStyle", v)}
        options={RISK_BAND_OPTIONS}
      />
    </SettingsRow>

    <SettingsRow
      label="Show Reason Chips"
      description="Display fraud signal tags on alerts and transaction rows"
    >
      <Toggle
        checked={settings.showReasonChips}
        onChange={(v) => onChange("showReasonChips", v)}
      />
    </SettingsRow>

    <SettingsRow
      label="Show SHAP Preview"
      description="Include SHAP contribution preview in analyst review panels"
      last
    >
      <Toggle
        checked={settings.showShapPreview}
        onChange={(v) => onChange("showShapPreview", v)}
      />
    </SettingsRow>
  </SettingsCard>
);

// ─── Notification preferences ─────────────────────────────────────────────────
export const NotificationSection = ({ settings, onChange }) => (
  <SettingsCard
    title="Notifications"
    description="Configure how and when you receive platform notifications"
    icon="📨"
  >
    <SettingsRow
      label="Browser Notifications"
      description="Allow FraudEye to send desktop push notifications"
    >
      <Toggle
        checked={settings.browserNotifs}
        onChange={(v) => onChange("browserNotifs", v)}
      />
    </SettingsRow>

    <SettingsRow
      label="Critical Alerts Only"
      description="Only notify for CRITICAL severity events when notifications are on"
    >
      <Toggle
        checked={settings.criticalOnly}
        onChange={(v) => onChange("criticalOnly", v)}
        disabled={!settings.browserNotifs}
      />
    </SettingsRow>

    <SettingsRow
      label="Email Digest"
      description="Receive periodic summaries of fraud activity to your email"
    >
      <Toggle
        checked={settings.emailDigest}
        onChange={(v) => onChange("emailDigest", v)}
      />
    </SettingsRow>

    <SettingsRow
      label="Digest Frequency"
      description="How often email digests are sent when enabled"
      last
    >
      <SettingsSelect
        value={settings.digestFreq}
        onChange={(v) => onChange("digestFreq", v)}
        options={DIGEST_OPTIONS}
      />
    </SettingsRow>
  </SettingsCard>
);
