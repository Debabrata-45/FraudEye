/**
 * requeueUnscored.js — Re-queue all transactions missing predictions
 *
 * docker cp "...\backend\requeueUnscored.js" fraudeye-backend:/app/requeueUnscored.js
 * docker exec fraudeye-backend node requeueUnscored.js
 */

const { Pool } = require("pg");
const { Queue } = require("bullmq");

const db = new Pool({
  host: "postgres",
  port: 5432,
  database: "fraudeye_db",
  user: "fraudeye",
  password: "fraudeye_pass",
});

const queue = new Queue("scan_txn_queue", {
  connection: { host: "redis", port: 6379 },
});

async function run() {
  console.log("\n🔄 FraudEye — Re-queue Unscored Transactions");
  console.log("═══════════════════════════════════════════════");

  // Both columns are bigint — no cast needed
  const res = await db.query(`
    SELECT t.id
    FROM transactions t
    LEFT JOIN transaction_predictions tp ON tp.transaction_id = t.id
    WHERE tp.id IS NULL
    ORDER BY t.id ASC
  `);

  const unscored = res.rows;
  console.log(`Found ${unscored.length} unscored transactions`);

  if (unscored.length === 0) {
    console.log("✅ Nothing to re-queue — all transactions are scored!");
    await db.end();
    await queue.close();
    return;
  }

  const BATCH = 50;
  let queued = 0;

  for (let i = 0; i < unscored.length; i += BATCH) {
    const batch = unscored.slice(i, i + BATCH);
    await Promise.all(
      batch.map((row) =>
        queue.add(
          "scan_transaction",
          { transactionId: row.id },
          {
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 50 },
          },
        ),
      ),
    );
    queued += batch.length;
    console.log(`  Queued ${queued}/${unscored.length}...`);
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("\n═══════════════════════════════════════════════");
  console.log(`✅ Queued ${queued} transactions for scoring`);
  console.log("   Watch worker: docker logs fraudeye-worker -f");
  console.log("═══════════════════════════════════════════════\n");

  await db.end();
  await queue.close();
}

run().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
