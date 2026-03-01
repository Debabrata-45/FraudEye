import { scanQueue } from "./scanQueue.js";

export async function getScanQueueCounts() {
  const counts = await scanQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
    "paused"
  );
  return counts;
}