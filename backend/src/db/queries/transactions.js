import { pool } from "../pool.js";

export async function insertTransaction(txn) {
  // Example columns: adjust to YOUR transactions schema
  const q = `
    INSERT INTO transactions (user_id, merchant_id, amount, currency, device_id, ip, location, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())
    RETURNING id;
  `;
  const values = [
    txn.userId,
    txn.merchantId,
    txn.amount,
    txn.currency,
    txn.deviceId,
    txn.ip,
    txn.location,
  ];
  const { rows } = await pool.query(q, values);
  return rows[0].id;
}