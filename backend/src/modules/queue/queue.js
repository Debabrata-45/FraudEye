const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const queueName = process.env.BULLMQ_QUEUE || "tx_infer_queue"; // ✅ IMPORTANT

const connection = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null,
});

const txQueue = new Queue(queueName, { connection });

module.exports = { txQueue, connection };