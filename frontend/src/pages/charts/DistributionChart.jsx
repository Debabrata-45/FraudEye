import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import ChartContainer from './ChartContainer';
import { CHART_COLORS, TOOLTIP_STYLE } from './chartTheme';

const DATA = [
  { name: 'Fraud',      value: 127, color: CHART_COLORS.fraud      },
  { name: 'Suspicious', value: 198, color: CHART_COLORS.suspicious  },
  { name: 'Legitimate', value: 1847, color: CHART_COLORS.legitimate },
];

const RADIAN = Math.PI / 180;
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#F8FAFC" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
        <span style={{ color: '#94A3B8', fontSize: 11 }}>{d.name}</span>
      </div>
      <p style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
        {d.value.toLocaleString()} transactions
      </p>
    </div>
  );
};

// ─── Center stat ──────────────────────────────────────────────────────────────
const CenterStat = ({ cx, cy }) => {
  const total = DATA.reduce((s, d) => s + d.value, 0);
  const fraudPct = ((DATA[0].value / total) * 100).toFixed(1);
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#F43F5E" fontSize={20} fontWeight={900}>
        {fraudPct}%
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#475569" fontSize={10}>
        fraud rate
      </text>
    </g>
  );
};

const DistributionChart = ({ size = 'md', delay = 0 }) => {
  const total = useMemo(() => DATA.reduce((s, d) => s + d.value, 0), []);
  const { height } = { sm: { height: 160 }, md: { height: 220 }, lg: { height: 280 } }[size] || { height: 220 };
  const cx = '50%';

  return (
    <ChartContainer
      title="Fraud Distribution"
      subtitle={`${total.toLocaleString()} total transactions analyzed`}
      size={size}
      delay={delay}
    >
      <div className="flex items-center gap-4">
        {/* Donut */}
        <div style={{ height, flex: 1 }}>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={DATA}
                cx={cx}
                cy="50%"
                innerRadius="52%"
                outerRadius="72%"
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={<CustomLabel />}
              >
                {DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    stroke="transparent"
                    style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <CenterStat cx={cx} cy="50%" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + counts */}
        <div className="flex flex-col gap-2 flex-shrink-0 pr-2">
          {DATA.map(d => (
            <div key={d.name} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] text-slate-400">{d.name}</span>
              </div>
              <span className="text-sm font-bold tabular-nums pl-3.5" style={{ color: d.color }}>
                {d.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
};

export default DistributionChart;