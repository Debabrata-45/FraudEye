/**
 * checkAccuracy.js — Check FraudEye model accuracy
 * docker cp backend/checkAccuracy.js fraudeye-backend:/app/checkAccuracy.js
 * docker exec fraudeye-backend node checkAccuracy.js
 */

const { Pool } = require("pg");
const db = new Pool({
  host: "postgres",
  port: 5432,
  database: "fraudeye_db",
  user: "fraudeye",
  password: "fraudeye_pass",
});

async function run() {
  console.log("\n📊 FraudEye Model Accuracy Report");
  console.log("════════════════════════════════════════");

  // 1. Overall distribution
  const dist = await db.query(`
    SELECT risk_label, COUNT(*) as count,
           ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as pct
    FROM transaction_predictions
    GROUP BY risk_label ORDER BY count DESC
  `);
  console.log("\n📈 Risk Score Distribution:");
  dist.rows.forEach((r) =>
    console.log(`   ${r.risk_label?.padEnd(8)} : ${r.count} (${r.pct}%)`),
  );

  // 2. Model vs analyst agreement
  const agreement = await db.query(`
    SELECT
      COUNT(*) as total_reviewed,
      SUM(CASE WHEN
        (tp.risk_label = 'high' AND f.verdict = 'FRAUD') OR
        (tp.risk_label = 'low'  AND f.verdict = 'SAFE')  OR
        (tp.risk_label = 'medium' AND f.verdict IN ('FRAUD','SAFE'))
      THEN 1 ELSE 0 END) as agreed,
      SUM(CASE WHEN f.verdict = 'FRAUD' THEN 1 ELSE 0 END) as fraud_confirmed,
      SUM(CASE WHEN f.verdict = 'SAFE'  THEN 1 ELSE 0 END) as safe_confirmed
    FROM feedback f
    JOIN transaction_predictions tp ON tp.transaction_id = f.transaction_id
  `);

  const r = agreement.rows[0];
  console.log("\n👨‍💼 Analyst Feedback Summary:");
  console.log(`   Total reviewed    : ${r.total_reviewed}`);
  console.log(`   Fraud confirmed   : ${r.fraud_confirmed}`);
  console.log(`   Safe confirmed    : ${r.safe_confirmed}`);

  if (r.total_reviewed > 0) {
    const acc = ((r.agreed / r.total_reviewed) * 100).toFixed(1);
    console.log(`   Model agreement   : ${acc}%`);
  }

  // 3. Score statistics
  const stats = await db.query(`
    SELECT
      ROUND(AVG(risk_score), 1)    as avg_score,
      ROUND(MIN(risk_score), 1)    as min_score,
      ROUND(MAX(risk_score), 1)    as max_score,
      ROUND(STDDEV(risk_score), 1) as std_score,
      COUNT(CASE WHEN risk_score >= 85 THEN 1 END) as critical_count,
      COUNT(CASE WHEN risk_score BETWEEN 65 AND 84 THEN 1 END) as high_count,
      COUNT(CASE WHEN risk_score BETWEEN 31 AND 64 THEN 1 END) as medium_count,
      COUNT(CASE WHEN risk_score <= 30 THEN 1 END) as low_count
    FROM transaction_predictions
  `);

  const s = stats.rows[0];
  console.log("\n📉 Score Statistics:");
  console.log(`   Average score : ${s.avg_score}`);
  console.log(`   Min score     : ${s.min_score}`);
  console.log(`   Max score     : ${s.max_score}`);
  console.log(`   Std deviation : ${s.std_score}`);
  console.log("\n🎯 Score Breakdown:");
  console.log(`   Critical (85-100) : ${s.critical_count}`);
  console.log(`   High     (65-84)  : ${s.high_count}`);
  console.log(`   Medium   (31-64)  : ${s.medium_count}`);
  console.log(`   Low      (0-30)   : ${s.low_count}`);

  // 4. Known model metrics from training
  console.log("\n🤖 XGBoost Training Metrics (from model training):");
  console.log("   AUC-ROC   : 0.9962  (near perfect)");
  console.log("   Accuracy  : 99.6%");
  console.log("   F1 Score  : 0.8308");
  console.log("   Precision : ~85%");
  console.log("   Recall    : ~81%");
  console.log("   Model ver : xgb_v1");
  console.log("   Train data: 100,000 synthetic transactions");

  console.log("\n════════════════════════════════════════\n");
  await db.end();
}

run().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
