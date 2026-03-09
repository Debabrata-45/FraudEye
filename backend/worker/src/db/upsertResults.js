const { pool } = require("./pool");

async function upsertPredictionAndExplanation(transactionId, mlResult) {
  const riskScore = mlResult.riskScore ?? 0;
  const riskLabel = (mlResult.riskLabel ?? "low").toLowerCase();
  const topFactors = mlResult.topFactors ?? [];
  const modelVersion = mlResult.modelVersion ?? "unknown";
  const shap = mlResult.shap ?? null;
  const lime = mlResult.lime ?? null;

  const explanationJson = {
    topFactors,
    shap,
    lime,
  };

  await pool.query(
    `INSERT INTO transaction_predictions
      (transaction_id, risk_score, risk_label, model_version, explanation_json)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     ON CONFLICT (transaction_id)
     DO UPDATE SET
       risk_score = EXCLUDED.risk_score,
       risk_label = EXCLUDED.risk_label,
       model_version = EXCLUDED.model_version,
       explanation_json = EXCLUDED.explanation_json`,
    [
      transactionId,
      riskScore,
      riskLabel,
      modelVersion,
      JSON.stringify(explanationJson),
    ]
  );
}

module.exports = { upsertPredictionAndExplanation };