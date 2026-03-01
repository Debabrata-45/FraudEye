const { query } = require("../../db");

async function summary() {
  const byLabel = await query(
    `SELECT COALESCE(p.risk_label,'unscored') AS label, COUNT(*)::int AS count
     FROM transactions t
     LEFT JOIN transaction_predictions p ON p.transaction_id = t.id
     GROUP BY 1
     ORDER BY 1`
  );

  const totals = await query(`SELECT COUNT(*)::int AS total FROM transactions`);
  const avgRisk = await query(`SELECT COALESCE(AVG(risk_score),0)::float AS avg_risk FROM transaction_predictions`);

  return {
    totalTransactions: totals.rows[0].total,
    avgRiskScore: avgRisk.rows[0].avg_risk,
    byRiskLabel: byLabel.rows,
  };
}

module.exports = { summary };