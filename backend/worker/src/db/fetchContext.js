const { pool } = require("./pool");
const { env } = require("../config/env");

async function fetchTransactionContext(transactionId) {
  // 1) raw transaction
  const txnRes = await pool.query(
    `SELECT * FROM transactions WHERE id = $1`,
    [transactionId]
  );
  if (txnRes.rowCount === 0) return null;

  const txn = txnRes.rows[0];

  // Adjust if your transactions table uses different column names
  const userId = txn.user_id;
  const deviceId = txn.device_id || null;
  const merchantId = txn.merchant_id;

  // 2) user aggregates (recent txn stats)
  // Your API uses occurredAt, so DB likely has occurred_at; fallback to created_at if exists.
  const userAggRes = await pool.query(
    `
    SELECT
      COUNT(*)::int AS txn_count_30d,
      COALESCE(SUM(amount),0)::float AS total_amount_30d,
      COALESCE(AVG(amount),0)::float AS avg_amount_30d,
      COALESCE(MAX(occurred_at), NOW()) AS last_txn_time
    FROM transactions
    WHERE user_id = $1 AND occurred_at >= NOW() - INTERVAL '30 days'
    `,
    [userId]
  );

  // 3) device profile (trust score/history) - optional device
  const deviceRes = deviceId
    ? await pool.query(
        `
        SELECT id, trust_score, last_seen_at, risk_flags
        FROM devices
        WHERE id = $1
        `,
        [deviceId]
      )
    : { rows: [] };

  // 4) merchant profile (risk score/category)
  const merchantRes = await pool.query(
    `
    SELECT id, risk_score, category, name
    FROM merchants
    WHERE id = $1
    `,
    [merchantId]
  );

  // 5) recent transactions (last N for the user)
  // Use columns that likely exist based on your validator: ip_address, geo_lat, geo_lng, occurred_at
  const recentTxRes = await pool.query(
    `
    SELECT
      id,
      amount,
      currency,
      merchant_id,
      device_id,
      ip_address,
      geo_lat,
      geo_lng,
      occurred_at
    FROM transactions
    WHERE user_id = $1
    ORDER BY occurred_at DESC
    LIMIT $2
    `,
    [userId, env.RECENT_TXN_LIMIT]
  );

  return {
    transaction: txn,
    userProfile: userAggRes.rows[0] || null,
    deviceProfile: deviceRes.rows[0] || null,
    merchantProfile: merchantRes.rows[0] || null,
    recentTransactions: recentTxRes.rows || [],
  };
}

module.exports = { fetchTransactionContext };