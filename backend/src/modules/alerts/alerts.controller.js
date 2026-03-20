const { asyncHandler } = require("../../utils/asyncHandler");
const { query } = require("../../db");
const { ApiError } = require("../../utils/ApiError");

const listAlerts = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
  const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);
  const severity = req.query.severity; // optional filter
  const status = req.query.status; // optional filter

  // Map risk_label to severity
  const severityFilter = severity
    ? `AND CASE
         WHEN p.risk_label = 'critical' THEN 'CRITICAL'
         WHEN p.risk_label = 'high'     THEN 'HIGH'
         WHEN p.risk_label = 'medium'   THEN 'MEDIUM'
         ELSE 'LOW'
       END = '${severity.toUpperCase()}'`
    : "";

  const sql = `
    SELECT
      t.id,
      t.user_id,
      t.merchant_id,
      t.amount,
      t.currency,
      t.occurred_at,
      t.created_at,
      p.risk_score,
      p.risk_label,
      p.model_version,
      p.explanation_json,
      CASE
        WHEN p.risk_label = 'critical' THEN 'CRITICAL'
        WHEN p.risk_label = 'high'     THEN 'HIGH'
        WHEN p.risk_label = 'medium'   THEN 'MEDIUM'
        ELSE 'LOW'
      END AS severity,
      CASE
        WHEN f.verdict = 'FRAUD'  THEN 'RESOLVED'
        WHEN f.verdict = 'SAFE'   THEN 'DISMISSED'
        WHEN p.risk_label IN ('critical','high') THEN 'ACTIVE'
        ELSE 'REVIEWING'
      END AS status,
      f.verdict,
      f.notes
    FROM transactions t
    INNER JOIN transaction_predictions p ON p.transaction_id = t.id
    LEFT JOIN feedback f ON f.transaction_id = t.id
    WHERE p.risk_label IN ('critical','high','medium')
    ${severityFilter}
    ORDER BY p.risk_score DESC, t.occurred_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const result = await query(sql);

  // Shape into alert format
  const alerts = result.rows.map((row) => ({
    id: `ALT-${String(row.id).padStart(6, "0")}`,
    txnId: `TXN-${row.id}`,
    transactionId: row.id,
    severity: row.severity,
    status: row.status,
    riskScore: row.risk_score ?? 0,
    riskLabel: row.risk_label,
    amount: parseFloat(row.amount),
    currency: row.currency,
    merchantId: row.merchant_id,
    userId: row.user_id,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
    topFactors: row.explanation_json?.topFactors ?? [],
    verdict: row.verdict ?? null,
    notes: row.notes ?? null,
  }));

  res.json({ ok: true, data: { items: alerts, limit, offset } });
});

const getAlertById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new ApiError(400, "Invalid alert ID");

  const result = await query(
    `SELECT
      t.*,
      p.risk_score, p.risk_label, p.model_version, p.explanation_json,
      f.verdict, f.notes
     FROM transactions t
     INNER JOIN transaction_predictions p ON p.transaction_id = t.id
     LEFT JOIN feedback f ON f.transaction_id = t.id
     WHERE t.id = $1`,
    [id],
  );

  if (!result.rows[0])
    throw new ApiError(404, "Alert not found", "ERR_NOT_FOUND");

  const row = result.rows[0];
  res.json({
    ok: true,
    data: {
      id: `ALT-${String(row.id).padStart(6, "0")}`,
      txnId: `TXN-${row.id}`,
      transactionId: row.id,
      severity: row.risk_label?.toUpperCase() ?? "LOW",
      riskScore: row.risk_score ?? 0,
      riskLabel: row.risk_label,
      amount: parseFloat(row.amount),
      currency: row.currency,
      merchantId: row.merchant_id,
      userId: row.user_id,
      occurredAt: row.occurred_at,
      explanation: row.explanation_json ?? {},
      verdict: row.verdict ?? null,
      notes: row.notes ?? null,
    },
  });
});

module.exports = { listAlerts, getAlertById };
