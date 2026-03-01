const { pool } = require("./pool");

async function upsertPredictionAndExplanation(transactionId, mlResult) {
  const riskScore = mlResult.risk_score ?? 0;
  const riskLabel = mlResult.risk_label ?? "low";
  const fraudProbability = riskScore / 100;
  const topFactors = mlResult.top_factors ?? [];
  const modelVersion = mlResult.model ?? "unknown";
  const shap = mlResult.explanations?.shap ?? null;
  const lime = mlResult.explanations?.lime ?? null;

  await pool.query("BEGIN");
  try {
    await pool.query(
      `
      INSERT INTO predictions
        (transaction_id, fraud_probability, risk_score, risk_label, top_factors, model_version)
      VALUES
        ($1, $2, $3, $4, $5::jsonb, $6)
      ON CONFLICT (transaction_id)
      DO UPDATE SET
        fraud_probability = EXCLUDED.fraud_probability,
        risk_score = EXCLUDED.risk_score,
        risk_label = EXCLUDED.risk_label,
        top_factors = EXCLUDED.top_factors,
        model_version = EXCLUDED.model_version,
        updated_at = NOW()
      `,
      [
        transactionId,
        fraudProbability,
        riskScore,
        String(riskLabel),
        JSON.stringify(topFactors),
        String(modelVersion),
      ]
    );

    await pool.query(
      `
      INSERT INTO explanations
        (transaction_id, shap, lime)
      VALUES
        ($1, $2::jsonb, $3::jsonb)
      ON CONFLICT (transaction_id)
      DO UPDATE SET
        shap = EXCLUDED.shap,
        lime = EXCLUDED.lime,
        updated_at = NOW()
      `,
      [
        transactionId,
        JSON.stringify(shap),
        JSON.stringify(lime),
      ]
    );

    await pool.query("COMMIT");
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
}

module.exports = { upsertPredictionAndExplanation };