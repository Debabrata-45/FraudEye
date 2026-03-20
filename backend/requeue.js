/**
 * requeue.js — Re-queues all unscored transactions
 * Run: node requeue.js inside fraudeye-backend container
 */
require("dotenv").config();
const { txQueue } = require("./src/modules/queue/queue");
const { query } = require("./src/db");

async function requeue() {
  const result = await query(
    `SELECT id FROM transactions 
     WHERE id NOT IN (SELECT transaction_id FROM transaction_predictions)
     ORDER BY id ASC`
  );

  const ids = result.rows.map((r) => r.id);
  console.log(`Found ${ids.length} unscored transactions:`, ids);

  for (const id of ids) {
    await txQueue.add(
      "tx_infer",
      { transactionId: String(id) },
      { jobId: `requeue-${id}`, removeOnComplete: 1000, removeOnFail: 5000 }
    );
    console.log(`✅ Queued transaction ${id}`);
  }

  console.log(`\n🚀 Done. ${ids.length} jobs added to queue.`);
  process.exit(0);
}

requeue().catch((err) => {
  console.error("❌ Requeue failed:", err);
  process.exit(1);
});