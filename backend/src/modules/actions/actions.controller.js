const { query } = require('../../db');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const flagUser = asyncHandler(async (req, res) => {
  const { userId, reason } = req.body;
  const actorId = req.user.userId;

  if (!userId) throw new ApiError(400, 'userId is required');

  await query(
    `INSERT INTO flagged_users (flagged_user_id, actor_user_id, reason)
     VALUES ($1, $2, $3)
     ON CONFLICT (flagged_user_id) DO UPDATE SET reason = $3, actor_user_id = $2`,
    [userId, actorId, reason || null]
  );

  await query(
    `INSERT INTO audit_logs (actor_user_id, event_type, meta)
     VALUES ($1, $2, $3)`,
    [actorId, 'user_flagged', JSON.stringify({ userId, reason })]
  );

  res.json({ ok: true, message: `User ${userId} flagged` });
});

const flagMerchant = asyncHandler(async (req, res) => {
  const { merchantId, reason } = req.body;
  const actorId = req.user.userId;

  if (!merchantId) throw new ApiError(400, 'merchantId is required');

  await query(
    `INSERT INTO flagged_merchants (merchant_id, actor_user_id, reason)
     VALUES ($1, $2, $3)
     ON CONFLICT (merchant_id) DO UPDATE SET reason = $3, actor_user_id = $2`,
    [merchantId, actorId, reason || null]
  );

  await query(
    `INSERT INTO audit_logs (actor_user_id, event_type, meta)
     VALUES ($1, $2, $3)`,
    [actorId, 'merchant_flagged', JSON.stringify({ merchantId, reason })]
  );

  res.json({ ok: true, message: `Merchant ${merchantId} flagged` });
});

module.exports = { flagUser, flagMerchant };