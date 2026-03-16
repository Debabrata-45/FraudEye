import FraudTrendChart from "../../charts/FraudTrendChart";
import DistributionChart from "../../charts/DistributionChart";
import RiskBandChart from "../../charts/RiskBandChart";
import MerchantRiskChart from "../../charts/MerchantRiskChart";
import DecisionTrendChart from "../../charts/DecisionTrendChart";
import ActivityHeatmap from "../../charts/ActivityHeatmap";
import AIInsightsMinis from "../../charts/AIInsightsMinis";

const OverviewCharts = () => (
  <div className="space-y-4">
    {/* Row 1: Primary trend — full width */}
    <FraudTrendChart size="lg" delay={0} />

    {/* Row 2: Distribution + Risk bands */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DistributionChart size="md" delay={0.05} />
      <RiskBandChart size="md" delay={0.1} />
    </div>

    {/* Row 3: Merchant risk + AI insights */}
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
      <MerchantRiskChart size="lg" delay={0.12} />
      <AIInsightsMinis />
    </div>

    {/* Row 4: Decision trends + Heatmap */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DecisionTrendChart size="md" delay={0.15} />
      <ActivityHeatmap size="md" delay={0.18} />
    </div>
  </div>
);

export default OverviewCharts;
