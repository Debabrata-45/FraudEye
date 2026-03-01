import { insertTransaction } from "../db/queries/transactions.js";
import { scanQueue } from "../queue/scanQueue.js";

export async function createTransaction(req, res, next) {
  try {
    const transactionId = await insertTransaction(req.body);

    // IMPORTANT: payload must be { transactionId: string }
    await scanQueue.add(
      "scan",
      { transactionId: String(transactionId) },
      {
        // stable dedupe: same transactionId should not enqueue duplicates easily
        jobId: String(transactionId),
      }
    );

    return res.status(201).json({
      transactionId,
      status: "QUEUED",
    });
  } catch (err) {
    next(err);
  }
}