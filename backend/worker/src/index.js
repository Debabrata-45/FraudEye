require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { Worker } = require("bullmq");
const { env } = require("./config/env");
const { redis } = require("./queue/redis");
const { processScanJob } = require("./processor/scanProcessor");

const worker = new Worker(env.BULLMQ_QUEUE, processScanJob, {
  connection: redis,
  concurrency: 5,
  lockDuration: 600000,
});

worker.on("ready", () => {
  console.log(`✅ BullMQ worker ready. Queue: ${env.BULLMQ_QUEUE}`);
});

worker.on("completed", (job, result) => {
  console.log(`✅ completed job ${job.id}`, result);
});

worker.on("failed", (job, err) => {
  console.error(`❌ failed job ${job?.id}`, err?.message);
});

worker.on("error", (err) => {
  console.error("❌ worker error", err?.message);
});

console.log(`🚀 Worker listening on queue: ${env.BULLMQ_QUEUE}`);