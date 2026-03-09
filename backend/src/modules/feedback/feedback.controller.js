const { query } = require('../../db');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const submitFeedback = asyncHandler(async (req, res) => {
  const { transactionId, verdict, notes } = req.body;
  const actorId = req.user.userId;

  if (!transactionId || !verdict) throw new ApiError(400, 'transactionId and verdict are required');
  if (!['FRAUD', 'SAFE'].includes(verdict)) throw new ApiError(400, 'verdict must be FRAUD or SAFE');

  // Upsert feedback
  const result = await query(
    `INSERT INTO feedback (transaction_id, actor_user_id, verdict, notes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (transaction_id) DO UPDATE
     SET verdict = $3, notes = $4, actor_user_id = $2
     RETURNING *`,
    [transactionId, actorId, verdict, notes || null]
  );

  // Write audit log
  await query(
    `INSERT INTO audit_logs (actor_user_id, event_type, meta)
     VALUES ($1, $2, $3)`,
    [actorId, 'feedback_submitted', JSON.stringify({ transactionId, verdict, notes })]
  );

  // Update merchant risk score if verdict is FRAUD
  if (verdict === 'FRAUD') {
    await updateMerchantRisk(transactionId, actorId);
  }

  res.json({ ok: true, data: result.rows[0] });
});

async function updateMerchantRisk(transactionId, actorId) {
  // Get merchant for this transaction
  const txnRes = await query(
    `SELECT merchant_id FROM transactions WHERE id = $1`,
    [transactionId]
  );
  if (!txnRes.rows[0]) return;

  const merchantId = txnRes.rows[0].merchant_id;

  // Count confirmed fraud cases for this merchant
  const fraudCount = await query(
    `SELECT COUNT(*) as fraud_count
     FROM feedback f
     JOIN transactions t ON t.id = f.transaction_id
     WHERE t.merchant_id = $1 AND f.verdict = 'FRAUD'`,
    [merchantId]
  );

  const count = parseInt(fraudCount.rows[0].fraud_count);

  // Simple rule: risk_score = min(count * 10, 100)
  const newRiskScore = Math.min(count * 10, 100);

  // Upsert merchant with updated risk score
  await query(
    `INSERT INTO merchants (id, risk_score)
     VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET risk_score = $2`,
    [merchantId, newRiskScore]
  );

  // Write audit log
  await query(
    `INSERT INTO audit_logs (actor_user_id, event_type, meta)
     VALUES ($1, $2, $3)`,
    [actorId, 'merchant_risk_updated', JSON.stringify({ merchantId, newRiskScore, fraudCount: count })]
  );
}

const getFeedback = asyncHandler(async (req, res) => {
  const { transactionId } = req.query;
  if (!transactionId) throw new ApiError(400, 'transactionId is required');

  const result = await query(
    `SELECT * FROM feedback WHERE transaction_id = $1`,
    [transactionId]
  );

  res.json({ ok: true, data: result.rows[0] || null });
});

module.exports = { submitFeedback, getFeedback };