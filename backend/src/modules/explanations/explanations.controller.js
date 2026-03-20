const { asyncHandler } = require("../../utils/asyncHandler");
const { query } = require("../../db");
const { ApiError } = require("../../utils/ApiError");

const getExplanation = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new ApiError(400, "Invalid transaction ID");

  const result = await query(
    `SELECT
      t.id,
      t.user_id,
      t.merchant_id,
      t.amount,
      t.currency,
      t.occurred_at,
      p.risk_score,
      p.risk_label,
      p.model_version,
      p.explanation_json
     FROM transactions t
     INNER JOIN transaction_predictions p ON p.transaction_id = t.id
     WHERE t.id = $1`,
    [id]
  );

  if (!result.rows[0]) throw new ApiError(404, "Explanation not found", "ERR_NOT_FOUND");

  const row = result.rows[0];
  const explanation = row.explanation_json ?? {};

  res.json({
    ok: true,
    data: {
      txnId:        `TXN-${row.id}`,
      transactionId: row.id,
      merchantId:   row.merchant_id,
      userId:       row.user_id,
      amount:       parseFloat(row.amount),
      currency:     row.currency,
      occurredAt:   row.occurred_at,
      riskScore:    row.risk_score,
      riskLabel:    row.risk_label,
      modelVersion: row.model_version,
      topFactors:   explanation.topFactors ?? [],
      shap:         explanation.shap ?? null,
      lime:         explanation.lime ?? null,
      confidence:   row.risk_score ? row.risk_score / 100 : 0,
    },
  });
});

const listExplanations = asyncHandler(async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit  || "50", 10), 200);
  const offset = Math.max(parseInt(req.query.offset || "0",  10), 0);
  const riskLabel = req.query.riskLabel;

  const filters = riskLabel ? `WHERE p.risk_label = '${riskLabel}'` : "";

  const result = await query(`
    SELECT
      t.id,
      t.user_id,
      t.merchant_id,
      t.amount,
      t.currency,
      t.occurred_at,
      p.risk_score,
      p.risk_label,
      p.model_version,
      p.explanation_json
    FROM transactions t
    INNER JOIN transaction_predictions p ON p.transaction_id = t.id
    ${filters}
    ORDER BY p.risk_score DESC, t.occurred_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  const items = result.rows.map((row) => ({
    txnId:        `TXN-${row.id}`,
    transactionId: row.id,
    merchantId:   row.merchant_id,
    userId:       row.user_id,
    amount:       parseFloat(row.amount),
    currency:     row.currency,
    occurredAt:   row.occurred_at,
    riskScore:    row.risk_score,
    riskLabel:    row.risk_label,
    modelVersion: row.model_version,
    topFactors:   row.explanation_json?.topFactors ?? [],
    confidence:   row.risk_score ? row.risk_score / 100 : 0,
  }));

  res.json({ ok: true, data: { items, limit, offset } });
});

module.exports = { getExplanation, listExplanations };