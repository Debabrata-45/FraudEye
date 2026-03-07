import { RISK_COLORS } from '../../utils/constants';

export default function RiskBadge({ label }) {
  const colors = RISK_COLORS[label] || RISK_COLORS.LOW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}