const { Pool } = require("pg");
const db = new Pool({
  host: "postgres",
  port: 5432,
  database: "fraudeye_db",
  user: "fraudeye",
  password: "fraudeye_pass",
});

async function run() {
  const r = await db.query(`
    SELECT
      COUNT(*)                                                        AS total,
      MIN(id)                                                         AS first_id,
      MAX(id)                                                         AS last_id,
      COUNT(CASE WHEN raw_json->>'source' = 'synthetic_seed' THEN 1 END)  AS synthetic,
      COUNT(CASE WHEN raw_json->>'source' = 'fraud_seed'     THEN 1 END)  AS fraud_injected,
      COUNT(CASE WHEN raw_json IS NULL
               OR raw_json->>'source' IS NULL
               OR raw_json->>'source' = ''     THEN 1 END)           AS original
    FROM transactions
  `);

  const scored = await db.query(
    `SELECT COUNT(*) AS total FROM transaction_predictions`,
  );
  const breakdown = await db.query(`
    SELECT risk_label, COUNT(*) AS count
    FROM transaction_predictions
    GROUP BY risk_label
    ORDER BY count DESC
  `);

  console.log("\n═══════════════════════════════════");
  console.log("  FraudEye Transaction Counts");
  console.log("═══════════════════════════════════");
  console.log("Total transactions   :", r.rows[0].total);
  console.log(
    "ID range             :",
    r.rows[0].first_id,
    "→",
    r.rows[0].last_id,
  );
  console.log("───────────────────────────────────");
  console.log("Original (no source) :", r.rows[0].original);
  console.log("Synthetic seeded     :", r.rows[0].synthetic);
  console.log("Fraud injected       :", r.rows[0].fraud_injected);
  console.log("───────────────────────────────────");
  console.log("Total scored         :", scored.rows[0].total);
  console.log("Risk breakdown:");
  breakdown.rows.forEach((row) =>
    console.log("  ", row.risk_label, ":", row.count),
  );
  console.log("═══════════════════════════════════\n");

  await db.end();
}

run().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
